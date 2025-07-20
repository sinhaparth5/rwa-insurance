// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PremiumSubscription
 * @dev ERC-948 inspired recurring payment system for insurance premiums
 */
contract PremiumSubscription is Ownable, Pausable, ReentrancyGuard {
    
    // Subscription status
    enum SubscriptionStatus { Active, Paused, Cancelled, Expired }
    
    // Subscription structure
    struct Subscription {
        uint256 subscriptionId;
        address subscriber;
        address recipient;
        uint256 amount;
        uint256 period;         // Payment period in seconds
        uint256 startTime;
        uint256 nextPayment;
        uint256 endTime;
        SubscriptionStatus status;
        uint256 policyId;       // Associated insurance policy
        uint256 totalPaid;
        uint256 paymentCount;
    }
    
    // State variables
    IERC20 public immutable paymentToken;
    uint256 private _subscriptionIdCounter;
    
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public userSubscriptions;
    mapping(uint256 => uint256) public policySubscriptions; // policyId => subscriptionId
    
    // Payment execution
    mapping(address => bool) public authorizedExecutors;
    uint256 public executorRewardPercent = 50; // 0.5% reward for executing payments
    uint256 public constant BASIS_POINTS = 10000;
    
    // Grace period for late payments
    uint256 public gracePeriod = 7 days;
    
    // Events
    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        address indexed recipient,
        uint256 amount,
        uint256 period
    );
    event PaymentExecuted(
        uint256 indexed subscriptionId,
        uint256 amount,
        address executor,
        uint256 nextPayment
    );
    event SubscriptionCancelled(uint256 indexed subscriptionId);
    event SubscriptionPaused(uint256 indexed subscriptionId);
    event SubscriptionResumed(uint256 indexed subscriptionId);
    event SubscriptionExpired(uint256 indexed subscriptionId);
    
    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        authorizedExecutors[msg.sender] = true;
    }
    
    modifier onlyAuthorizedExecutor() {
        require(authorizedExecutors[msg.sender], "Not authorized executor");
        _;
    }
    
    /**
     * @dev Create a new subscription for insurance premium payments
     */
    function createSubscription(
        address recipient,
        uint256 amount,
        uint256 period,
        uint256 duration,
        uint256 policyId
    ) public whenNotPaused returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(period > 0, "Period must be greater than 0");
        require(duration > period, "Duration must be greater than period");
        
        // Check if policy already has a subscription
        require(policySubscriptions[policyId] == 0, "Policy already has subscription");
        
        uint256 subscriptionId = ++_subscriptionIdCounter;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;
        
        subscriptions[subscriptionId] = Subscription({
            subscriptionId: subscriptionId,
            subscriber: msg.sender,
            recipient: recipient,
            amount: amount,
            period: period,
            startTime: startTime,
            nextPayment: startTime,
            endTime: endTime,
            status: SubscriptionStatus.Active,
            policyId: policyId,
            totalPaid: 0,
            paymentCount: 0
        });
        
        userSubscriptions[msg.sender].push(subscriptionId);
        policySubscriptions[policyId] = subscriptionId;
        
        emit SubscriptionCreated(subscriptionId, msg.sender, recipient, amount, period);
        return subscriptionId;
    }
    
    /**
     * @dev Execute payment for a subscription
     */
    function executePayment(uint256 subscriptionId) public onlyAuthorizedExecutor whenNotPaused nonReentrant {
        Subscription storage sub = subscriptions[subscriptionId];
        
        require(sub.subscriber != address(0), "Subscription does not exist");
        require(sub.status == SubscriptionStatus.Active, "Subscription not active");
        require(block.timestamp >= sub.nextPayment, "Payment not due yet");
        require(block.timestamp <= sub.endTime, "Subscription expired");
        
        // Check if payment is within grace period
        if (block.timestamp > sub.nextPayment + gracePeriod) {
            sub.status = SubscriptionStatus.Expired;
            emit SubscriptionExpired(subscriptionId);
            return;
        }
        
        // Execute payment
        uint256 paymentAmount = sub.amount;
        require(
            paymentToken.transferFrom(sub.subscriber, sub.recipient, paymentAmount),
            "Payment transfer failed"
        );
        
        // Update subscription
        sub.totalPaid += paymentAmount;
        sub.paymentCount += 1;
        sub.nextPayment += sub.period;
        
        // Check if subscription should end
        if (sub.nextPayment > sub.endTime) {
            sub.status = SubscriptionStatus.Expired;
            emit SubscriptionExpired(subscriptionId);
        }
        
        // Reward executor
        uint256 executorReward = (paymentAmount * executorRewardPercent) / BASIS_POINTS;
        if (executorReward > 0) {
            paymentToken.transfer(msg.sender, executorReward);
        }
        
        emit PaymentExecuted(subscriptionId, paymentAmount, msg.sender, sub.nextPayment);
    }
    
    /**
     * @dev Execute multiple payments in batch
     */
    function batchExecutePayments(uint256[] memory subscriptionIds) public onlyAuthorizedExecutor {
        for (uint256 i = 0; i < subscriptionIds.length; i++) {
            try this.executePayment(subscriptionIds[i]) {
                // Payment executed successfully
            } catch {
                // Continue with next payment if one fails
                continue;
            }
        }
    }
    
    /**
     * @dev Cancel subscription (by subscriber or owner)
     */
    function cancelSubscription(uint256 subscriptionId) public whenNotPaused {
        Subscription storage sub = subscriptions[subscriptionId];
        
        require(sub.subscriber != address(0), "Subscription does not exist");
        require(
            sub.subscriber == msg.sender || owner() == msg.sender,
            "Not authorized to cancel"
        );
        require(sub.status == SubscriptionStatus.Active, "Subscription not active");
        
        sub.status = SubscriptionStatus.Cancelled;
        emit SubscriptionCancelled(subscriptionId);
    }
    
    /**
     * @dev Pause subscription (by subscriber)
     */
    function pauseSubscription(uint256 subscriptionId) public {
        Subscription storage sub = subscriptions[subscriptionId];
        
        require(sub.subscriber == msg.sender, "Not subscriber");
        require(sub.status == SubscriptionStatus.Active, "Subscription not active");
        
        sub.status = SubscriptionStatus.Paused;
        emit SubscriptionPaused(subscriptionId);
    }
    
    /**
     * @dev Resume paused subscription
     */
    function resumeSubscription(uint256 subscriptionId) public {
        Subscription storage sub = subscriptions[subscriptionId];
        
        require(sub.subscriber == msg.sender, "Not subscriber");
        require(sub.status == SubscriptionStatus.Paused, "Subscription not paused");
        require(block.timestamp <= sub.endTime, "Subscription expired");
        
        // Adjust next payment time
        sub.nextPayment = block.timestamp;
        sub.status = SubscriptionStatus.Active;
        
        emit SubscriptionResumed(subscriptionId);
    }
    
    /**
     * @dev Get subscription details
     */
    function getSubscription(uint256 subscriptionId) public view returns (Subscription memory) {
        return subscriptions[subscriptionId];
    }
    
    /**
     * @dev Get user's subscriptions
     */
    function getUserSubscriptions(address user) public view returns (uint256[] memory) {
        return userSubscriptions[user];
    }
    
    /**
     * @dev Get due payments for execution
     */
    function getDuePayments(uint256 limit) public view returns (uint256[] memory) {
        uint256[] memory duePayments = new uint256[](limit);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _subscriptionIdCounter && count < limit; i++) {
            Subscription memory sub = subscriptions[i];
            
            if (sub.status == SubscriptionStatus.Active &&
                block.timestamp >= sub.nextPayment &&
                block.timestamp <= sub.endTime &&
                block.timestamp <= sub.nextPayment + gracePeriod) {
                duePayments[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = duePayments[i];
        }
        
        return result;
    }
    
    /**
     * @dev Check if payment is due for subscription
     */
    function isPaymentDue(uint256 subscriptionId) public view returns (bool) {
        Subscription memory sub = subscriptions[subscriptionId];
        
        return sub.status == SubscriptionStatus.Active &&
               block.timestamp >= sub.nextPayment &&
               block.timestamp <= sub.endTime &&
               block.timestamp <= sub.nextPayment + gracePeriod;
    }
    
    /**
     * @dev Check if subscription is overdue
     */
    function isSubscriptionOverdue(uint256 subscriptionId) public view returns (bool) {
        Subscription memory sub = subscriptions[subscriptionId];
        
        return sub.status == SubscriptionStatus.Active &&
               block.timestamp > sub.nextPayment + gracePeriod;
    }
    
    /**
     * @dev Authorize payment executor
     */
    function authorizeExecutor(address executor) public onlyOwner {
        authorizedExecutors[executor] = true;
    }
    
    /**
     * @dev Revoke executor authorization
     */
    function revokeExecutor(address executor) public onlyOwner {
        authorizedExecutors[executor] = false;
    }
    
    /**
     * @dev Update executor reward percentage
     */
    function updateExecutorReward(uint256 newRewardPercent) public onlyOwner {
        require(newRewardPercent <= 500, "Reward too high"); // Max 5%
        executorRewardPercent = newRewardPercent;
    }
    
    /**
     * @dev Update grace period
     */
    function updateGracePeriod(uint256 newGracePeriod) public onlyOwner {
        require(newGracePeriod <= 30 days, "Grace period too long");
        gracePeriod = newGracePeriod;
    }
    
    /**
     * @dev Get subscription statistics
     */
    function getSubscriptionStats() public view returns (
        uint256 totalSubscriptions,
        uint256 activeSubscriptions,
        uint256 totalPaymentVolume
    ) {
        uint256 active = 0;
        uint256 volume = 0;
        
        for (uint256 i = 1; i <= _subscriptionIdCounter; i++) {
            Subscription memory sub = subscriptions[i];
            if (sub.status == SubscriptionStatus.Active) {
                active++;
            }
            volume += sub.totalPaid;
        }
        
        return (_subscriptionIdCounter, active, volume);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }
}
