import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import { parseEther, formatEther } from "viem";
import {
    CONTRACT_ADDRESSES,
    ASSET_REGISTRY_ABI,
    INSURANCE_MANAGER_ABI,
    POLICY_NFT_ABI,
    ERC20_ABI
} from "../contracts/index"

export const useAssetRegistry = () => {
    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const [isLoading, setIsLoading] = useState(false);

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const registerAsset = async (
        assetType: string,
        description: string,
        estimatedValue: string,
        documentHash: string,
        metadataURI: string
    ) => {
        try {
            setIsLoading(true);
            await writeContract({
                address: CONTRACT_ADDRESSES.ASSET_REGISTRY,
                abi: ASSET_REGISTRY_ABI,
                functionName: 'registerAsset',
                args: [
                    assetType,
                    description,
                    parseEther(estimatedValue),
                    documentHash,
                    metadataURI
                ]
            });
        } catch (err) {
            console.error("Error registering asset:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Get user assets
    const useUserAssets = (userAddress?: string) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.ASSET_REGISTRY,
            abi: ASSET_REGISTRY_ABI,
            functionName: 'getOwnerAssets',
            args: userAddress ? [userAddress as `0x${string}`] : undefined,
            query: { enabled: !!userAddress }
        });
    };

    // Get specific asset
    const useAsset = (assetId?: bigint) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.ASSET_REGISTRY,
            abi: ASSET_REGISTRY_ABI,
            functionName: 'getAsset',
            args: assetId !== undefined ? [assetId] : undefined,
            query: { enabled: assetId !== undefined }
        });
    };

    return {
        registerAsset,
        useUserAssets,
        useAsset,
        isLoading: isLoading || isPending || isConfirming,
        isSuccess,
        error,
        hash
    };
};

// Insurance Manager Hook
export const useInsuranceManager = () => {
    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const [isLoading, setIsLoading] = useState(false);

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    // Calculate premium
    const useCalculatePremium = (
        assetType?: string,
        coverageAmount?: bigint,
        riskLevel?: number
    ) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.INSURANCE_MANAGER,
            abi: INSURANCE_MANAGER_ABI,
            functionName: 'calculatePremium',
            args: (assetType && coverageAmount !== undefined && riskLevel !== undefined) 
                ? [assetType, coverageAmount, riskLevel] 
                : undefined,
            query: { 
                enabled: !!(assetType && coverageAmount !== undefined && riskLevel !== undefined)
            }
        });
    };

    // Purchase insurance policy
    const purchasePolicy = async (
        assetId: bigint,
        coverageAmount: string,
        duration: number,
        riskLevel: number
    ) => {
        try {
            setIsLoading(true);
            await writeContract({
                address: CONTRACT_ADDRESSES.INSURANCE_MANAGER,
                abi: INSURANCE_MANAGER_ABI,
                functionName: 'purchasePolicy',
                args: [
                    assetId,
                    parseEther(coverageAmount),
                    BigInt(duration),
                    riskLevel
                ]
            });
        } catch (err) {
            console.error('Failed to purchase policy:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Submit claim
    const submitClaim = async (
        policyId: bigint,
        claimAmount: string,
        description: string,
        evidenceHash: string
    ) => {
        try {
            setIsLoading(true);
            await writeContract({
                address: CONTRACT_ADDRESSES.INSURANCE_MANAGER,
                abi: INSURANCE_MANAGER_ABI,
                functionName: 'submitClaim',
                args: [
                    policyId,
                    parseEther(claimAmount),
                    description,
                    evidenceHash
                ]
            });
        } catch (err) {
            console.error('Failed to submit claim:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        useCalculatePremium,
        purchasePolicy,
        submitClaim,
        isLoading: isLoading || isPending || isConfirming,
        isSuccess,
        error,
        hash
    };
};

// Token operations hook
export const useToken = () => {
    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const [isLoading, setIsLoading] = useState(false);

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    // Get token balance
    const useTokenBalance = (userAddress?: string) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.PAYMENT_TOKEN,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: userAddress ? [userAddress as `0x${string}`] : undefined,
            query: { enabled: !!userAddress }
        });
    };

    // Get allowance
    const useAllowance = (userAddress?: string, spenderAddress?: string) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.PAYMENT_TOKEN,
            abi: ERC20_ABI,
            functionName: 'allowance',
            args: (userAddress && spenderAddress) 
                ? [userAddress as `0x${string}`, spenderAddress as `0x${string}`] 
                : undefined,
            query: { enabled: !!(userAddress && spenderAddress) }
        });
    };

    // Approve tokens
    const approveTokens = async (spenderAddress: string, amount: string) => {
        try {
            setIsLoading(true);
            await writeContract({
                address: CONTRACT_ADDRESSES.PAYMENT_TOKEN,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [spenderAddress as `0x${string}`, parseEther(amount)]
            });
        } catch (err) {
            console.error('Failed to approve tokens:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        useTokenBalance,
        useAllowance,
        approveTokens,
        isLoading: isLoading || isPending || isConfirming,
        isSuccess,
        error,
        hash
    };
};

// Policy NFT Hook
export const usePolicyNFT = () => {
    // Get user policies
    const useUserPolicies = (userAddress?: string) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.POLICY_NFT,
            abi: POLICY_NFT_ABI,
            functionName: 'getUserPolicies',
            args: userAddress ? [userAddress as `0x${string}`] : undefined,
            query: { enabled: !!userAddress }
        });
    };

    // Get specific policy
    const usePolicy = (policyId?: bigint) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.POLICY_NFT,
            abi: POLICY_NFT_ABI,
            functionName: 'getPolicy',
            args: policyId !== undefined ? [policyId] : undefined,
            query: { enabled: policyId !== undefined }
        });
    };

    // Check if policy is active
    const usePolicyActive = (policyId?: bigint) => {
        return useReadContract({
            address: CONTRACT_ADDRESSES.POLICY_NFT,
            abi: POLICY_NFT_ABI,
            functionName: 'isPolicyActive',
            args: policyId !== undefined ? [policyId] : undefined,
            query: { enabled: policyId !== undefined }
        });
    };

    return {
        useUserPolicies,
        usePolicy,
        usePolicyActive
    };
};

// Utility function to validate and format addresses
export const formatAddress = (address: string): `0x${string}` => {
    if (!address.startsWith('0x')) {
        throw new Error('Invalid address format');
    }
    return address as `0x${string}`;
};

// Type definitions for better TypeScript support
export interface Asset {
    id: bigint;
    owner: string;
    assetType: string;
    description: string;
    estimatedValue: bigint;
    documentHash: string;
    metadataURI: string;
    status: number;
    verifier: string;
    verificationDate: bigint;
    lastAssessment: bigint;
    isInsurable: boolean;
}

export interface Policy {
    assetId: bigint;
    policyholder: string;
    coverageAmount: bigint;
    premiumAmount: bigint;
    startDate: bigint;
    endDate: bigint;
    lastPremiumPaid: bigint;
    status: number;
    metadataURI: string;
}

export enum AssetStatus {
    Pending = 0,
    Verified = 1,
    Rejected = 2,
    Insured = 3,
    Claimed = 4
}

export enum PolicyStatus {
    Active = 0,
    Claimed = 1,
    Expired = 2,
    Cancelled = 3
}

export enum RiskLevel {
    Low = 0,
    Medium = 1,
    High = 2,
    VeryHigh = 3
}