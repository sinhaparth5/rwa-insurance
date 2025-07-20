// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PremiumSubscription.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock Token", "MOCK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract PremiumSubscriptionTest is Test {
    PremiumSubscription public subscription;
    MockERC20 public token;
    
    address public owner = address(1);
    address public subscriber = address(2);
    address public recipient = address(3);
    address public executor = address(4);
    
    uint256 public constant AMOUNT = 1000 * 10**18;
    uint256 public constant PERIOD = 30 days;
    uint256 public constant DURATION = 365 days;
    
    function setUp() public {
        vm.startPrank(owner);
        token = new MockERC20();
        subscription = new PremiumSubscription(address(token));
        
        token.transfer(subscriber, 100000 * 10**18);
        token.transfer(address(subscription), 10000 * 10**18); // Fund subscription for executor rewards
        subscription.authorizeExecutor(executor);
        
        vm.stopPrank();
    }
    
    function testCreateSubscription() public {
        vm.startPrank(subscriber);
        
        uint256 subscriptionId = subscription.createSubscription(
            recipient,
            AMOUNT,
            PERIOD,
            DURATION,
            1 // policyId
        );
        
        assertEq(subscriptionId, 1);
        
        PremiumSubscription.Subscription memory sub = subscription.getSubscription(subscriptionId);
        assertEq(sub.subscriber, subscriber);
        assertEq(sub.recipient, recipient);
        assertEq(sub.amount, AMOUNT);
        assertEq(uint256(sub.status), uint256(PremiumSubscription.SubscriptionStatus.Active));
        
        vm.stopPrank();
    }
    
    function testExecutePayment() public {
        vm.startPrank(subscriber);
        uint256 subscriptionId = subscription.createSubscription(
            recipient,
            AMOUNT,
            PERIOD,
            DURATION,
            1
        );
        token.approve(address(subscription), AMOUNT * 20);
        vm.stopPrank();
        
        vm.startPrank(executor);
        
        uint256 recipientBalanceBefore = token.balanceOf(recipient);
        subscription.executePayment(subscriptionId);
        uint256 recipientBalanceAfter = token.balanceOf(recipient);
        
        assertEq(recipientBalanceAfter - recipientBalanceBefore, AMOUNT);
        
        PremiumSubscription.Subscription memory sub = subscription.getSubscription(subscriptionId);
        assertEq(sub.totalPaid, AMOUNT);
        assertEq(sub.paymentCount, 1);
        
        vm.stopPrank();
    }
    
    function testCancelSubscription() public {
        vm.startPrank(subscriber);
        uint256 subscriptionId = subscription.createSubscription(
            recipient,
            AMOUNT,
            PERIOD,
            DURATION,
            1
        );
        
        subscription.cancelSubscription(subscriptionId);
        
        PremiumSubscription.Subscription memory sub = subscription.getSubscription(subscriptionId);
        assertEq(uint256(sub.status), uint256(PremiumSubscription.SubscriptionStatus.Cancelled));
        
        vm.stopPrank();
    }
}
