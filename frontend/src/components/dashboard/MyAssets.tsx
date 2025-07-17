"use client";

import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Spinner,
  SimpleGrid
} from "@chakra-ui/react";
import { Alert } from "@/components/ui/alert";
import { useAssetRegistry } from "@/hooks/useContracts";
import { useWallet } from "@/hooks/useWallet";
import { formatEther } from "viem";

// Define proper types for asset data
interface Asset {
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

const getStatusColor = (status: number) => {
  switch (status) {
    case 0: return "yellow"; // Pending
    case 1: return "green";  // Verified
    case 2: return "red";    // Rejected
    case 3: return "blue";   // Insured
    case 4: return "gray";   // Claimed
    default: return "gray";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Verified";
    case 2: return "Rejected";
    case 3: return "Insured";
    case 4: return "Claimed";
    default: return "Unknown";
  }
};

export const MyAssets = () => {
  const { address, isConnected } = useWallet();
  const { useUserAssets } = useAssetRegistry();

  const { data: assetIds, isLoading } = useUserAssets(address);

  // Type guard to ensure assetIds is an array
  const assetIdArray = Array.isArray(assetIds) ? assetIds as bigint[] : [];

  if (!isConnected) {
    return (
      <Box>
        <Heading size="lg" mb={6}>My Assets</Heading>
        <Card.Root>
          <Card.Body>
            <Alert.Root status="info">
              <Alert.Indicator />
              <Alert.Title>Connect your wallet to view your assets</Alert.Title>
            </Alert.Root>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Heading size="lg" mb={6}>My Assets</Heading>
        <Card.Root>
          <Card.Body>
            <VStack gap={4}>
              <Spinner size="lg" />
              <Text>Loading your assets...</Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  if (!assetIdArray || assetIdArray.length === 0) {
    return (
      <Box>
        <Heading size="lg" mb={6}>My Assets</Heading>
        <Card.Root>
          <Card.Body>
            <VStack gap={4}>
              <Text fontSize="lg">You haven't registered any assets yet.</Text>
              <Text color="gray.500" textAlign="center">
                Register your first asset to get started with insurance protection.
              </Text>
              <Button colorScheme="cyan" size="sm">
                Register Your First Asset
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Assets</Heading>
        <Badge colorScheme="cyan" fontSize="md" px={3} py={1}>
          {assetIdArray.length} Asset{assetIdArray.length !== 1 ? 's' : ''}
        </Badge>
      </HStack>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {assetIdArray.map((assetId: bigint) => (
          <AssetCard key={assetId.toString()} assetId={assetId} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

interface AssetCardProps {
  assetId: bigint;
}

const AssetCard = ({ assetId }: AssetCardProps) => {
  const { useAsset } = useAssetRegistry();
  const { data: assetData, isLoading } = useAsset(assetId);

  // Type assertion with proper type checking
  const asset = assetData as Asset | undefined;

  if (isLoading) {
    return (
      <Card.Root>
        <Card.Body>
          <VStack gap={4}>
            <Spinner />
            <Text fontSize="sm">Loading asset...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (!asset) {
    return (
      <Card.Root>
        <Card.Body>
          <Text>Asset not found</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root>
      <Card.Header>
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1}>
            <Text fontSize="sm" color="gray.500">Asset #{assetId.toString()}</Text>
            <Badge colorScheme={getStatusColor(asset.status)} size="sm">
              {getStatusText(asset.status)}
            </Badge>
          </VStack>
          {asset.isInsurable && (
            <Badge colorScheme="green" size="sm">Insurable</Badge>
          )}
        </HStack>
      </Card.Header>
      
      <Card.Body>
        <VStack align="start" gap={3}>
          <Text fontWeight="semibold" fontSize="lg">
            {asset.assetType.replace('_', ' ').toUpperCase()}
          </Text>
          {/* Fixed: Removed noOfLines and used lineClamp instead */}
          <Text 
            fontSize="sm" 
            color="gray.600" 
            lineClamp={2}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {asset.description}
          </Text>
          <Text fontWeight="bold" color="cyan.600">
            {formatEther(asset.estimatedValue)} BDAG
          </Text>
        </VStack>
      </Card.Body>
      
      <Card.Footer>
        <Button 
          size="sm" 
          variant="outline" 
          colorScheme="cyan"
          w="full"
          disabled={asset.status !== 1} // Only verified assets can be insured
        >
          {asset.status === 1 ? 'Get Insurance' : 'Pending Verification'}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};