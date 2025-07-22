"use client";

import {
  Box, Card, Heading, Text, VStack, HStack, Badge, Button, 
  Spinner, SimpleGrid, Flex, IconButton
} from "@chakra-ui/react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { useInsuranceAPI } from "@/lib/api/services";
import { useState, useEffect } from "react";
import { AreaChart, BarChart } from "@tremor/react";
import { 
  FiShield, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPlus, 
  FiRefreshCw,
  FiEye,
  FiEdit
} from "react-icons/fi";

export const MyAssets = () => {
  const { isConnected } = useWallet();
  const { isAuthenticated, token } = useAuth();
  const insuranceAPI = useInsuranceAPI(token);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async () => {
    if (!insuranceAPI || !token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏛️ Loading assets from backend...');
      const assetsData = await insuranceAPI.assets.getAll();
      setAssets(assetsData || []);
      console.log('✅ Assets loaded:', assetsData);
    } catch (error: any) {
      console.error('❌ Failed to load assets:', error);
      setError(error.message || 'Failed to load assets');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Fixed useEffect - only depend on stable values
  useEffect(() => {
    if (isAuthenticated && token && insuranceAPI) {
      loadAssets();
    }
  }, [isAuthenticated, token]); // Remove insuranceAPI from dependencies

  const refreshData = async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  };

  const getTotalValue = () => {
    return assets.reduce((sum, asset) => sum + (asset.current_value || asset.value || 0), 0);
  };

  const getVerifiedAssets = () => {
    return assets.filter(asset => asset.verification_status === 'verified' || asset.verified === true);
  };

  const getCategoryDistribution = () => {
    const distribution: { [key: string]: number } = {};
    assets.forEach(asset => {
      const category = asset.asset_type || asset.category || 'Unknown';
      distribution[category] = (distribution[category] || 0) + 1;
    });
    return Object.entries(distribution).map(([category, count]) => ({ category, count }));
  };

  if (!isConnected) {
    return (
      <Box 
        minH="100vh" 
        bgGradient="linear(to-br, green.50, blue.50, purple.50)"
        p={6}
      >
        <VStack gap={6} justify="center" minH="50vh">
          <Card.Root 
            bg="white" 
            borderRadius="2xl" 
            boxShadow="xl" 
            p={8}
            textAlign="center"
          >
            <VStack gap={4}>
              <Box
                w={16}
                h={16}
                bgGradient="linear(to-r, green.400, blue.500)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
              >
                <FiShield />
              </Box>
              <Heading size="xl" bgGradient="linear(to-r, green.600, blue.600)" bgClip="text">
                My Assets
              </Heading>
              <Text color="gray.600">
                Connect your wallet to view your tokenized assets
              </Text>
            </VStack>
          </Card.Root>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box 
        minH="100vh" 
        bgGradient="linear(to-br, orange.50, red.50, pink.50)"
        p={6}
      >
        <VStack gap={6} justify="center" minH="50vh">
          <Card.Root 
            bg="white" 
            borderRadius="2xl" 
            boxShadow="xl" 
            p={8}
            textAlign="center"
          >
            <VStack gap={4}>
              <Heading size="xl" bgGradient="linear(to-r, orange.600, red.600)" bgClip="text">
                Authentication Required
              </Heading>
              <Text color="gray.600">Please authenticate to view your assets</Text>
            </VStack>
          </Card.Root>
        </VStack>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box bgGradient="linear(to-br, green.50, blue.50)" minH="100vh" p={6}>
        <Flex justify="center" align="center" minH="50vh">
          <VStack gap={4}>
            <Spinner size="xl" color="green.500" />
            <Text color="gray.600">Loading your assets...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bgGradient="linear(to-br, red.50, orange.50)" minH="100vh" p={6}>
        <VStack gap={6} justify="center" minH="50vh">
          <Card.Root 
            bg="white" 
            borderRadius="2xl" 
            boxShadow="xl" 
            p={8}
            textAlign="center"
          >
            <VStack gap={4}>
              <Text color="red.500" fontSize="xl" fontWeight="bold">
                Failed to Load Assets
              </Text>
              <Text color="gray.600">{error}</Text>
              <Button colorScheme="red" onClick={refreshData} loading={refreshing}>
                Try Again
              </Button>
            </VStack>
          </Card.Root>
        </VStack>
      </Box>
    );
  }

  const verifiedAssets = getVerifiedAssets();
  const totalValue = getTotalValue();
  const categoryData = getCategoryDistribution();

  return (
    <Box bgGradient="linear(to-br, green.50, blue.50, cyan.50)" minH="100vh" p={6}>
      <VStack gap={8} align="stretch">
        
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading 
              size="xl" 
              bgGradient="linear(to-r, green.600, blue.600, purple.600)" 
              bgClip="text"
            >
              My Assets
            </Heading>
            <Text color="gray.600">
              Manage your tokenized assets and insurance coverage
            </Text>
          </VStack>
          <HStack>
            <IconButton
              aria-label="Refresh assets"
              onClick={refreshData}
              loading={refreshing}
              variant="outline"
              colorScheme="green"
              bg="white"
              _hover={{ bg: "green.50" }}
            >
              <FiRefreshCw />
            </IconButton>
            <Button 
              colorScheme="green"
              bg="white"
              color="green.600"
              _hover={{ bg: "green.50" }}
              border="1px solid"
              borderColor="green.200"
            >
              <FiPlus />
              Register Asset
            </Button>
          </HStack>
        </Flex>

        {/* Portfolio Overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Card.Root 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Card.Body textAlign="center" p={6}>
              <VStack gap={2}>
                <Box
                  w={12}
                  h={12}
                  bgGradient="linear(to-r, green.400, emerald.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                >
                  <FiDollarSign />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, green.600, emerald.600)" bgClip="text">
                  ${totalValue.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Portfolio Value</Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Card.Body textAlign="center" p={6}>
              <VStack gap={2}>
                <Box
                  w={12}
                  h={12}
                  bgGradient="linear(to-r, blue.400, cyan.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                >
                  <FiShield />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, cyan.600)" bgClip="text">
                  {verifiedAssets.length}
                </Text>
                <Text fontSize="sm" color="gray.600">Verified Assets</Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Card.Body textAlign="center" p={6}>
              <VStack gap={2}>
                <Box
                  w={12}
                  h={12}
                  bgGradient="linear(to-r, purple.400, pink.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                >
                  <FiTrendingUp />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, purple.600, pink.600)" bgClip="text">
                  {assets.length}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Assets</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Category Distribution Chart */}
        {categoryData.length > 0 && (
          <Card.Root 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <Card.Header 
              bgGradient="linear(to-r, green.500, blue.600)" 
              color="white" 
              borderTopRadius="xl"
            >
              <Heading size="md">Asset Distribution by Category</Heading>
            </Card.Header>
            <Card.Body>
              <BarChart
                data={categoryData}
                index="category"
                categories={["count"]}
                colors={["green"]}
                yAxisWidth={60}
                showLegend={false}
              />
            </Card.Body>
          </Card.Root>
        )}

        {/* Assets Grid */}
        <Card.Root 
          bg="white" 
          borderRadius="xl" 
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Card.Header 
            bgGradient="linear(to-r, green.500, blue.600)" 
            color="white" 
            borderTopRadius="xl"
          >
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Heading size="md">Your Assets</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  {assets.length > 0 ? `${assets.length} assets found` : 'No assets registered yet'}
                </Text>
              </VStack>
              <Badge variant="solid" bg="whiteAlpha.200">
                {assets.length} Total
              </Badge>
            </HStack>
          </Card.Header>
          <Card.Body p={6}>
            {assets.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {assets.map((asset: any, idx: number) => (
                  <Card.Root key={asset.id || idx} variant="outline" borderRadius="lg">
                    <Card.Header>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          ID: {asset.id || 'Unknown'}
                        </Text>
                        <Badge 
                          colorScheme={
                            asset.verification_status === 'verified' || asset.verified 
                              ? "green" 
                              : asset.verification_status === 'pending' 
                                ? "yellow" 
                                : "gray"
                          }
                          variant="solid"
                        >
                          {asset.verification_status || (asset.verified ? 'Verified' : 'Unverified')}
                        </Badge>
                      </HStack>
                    </Card.Header>
                    <Card.Body>
                      <VStack align="start" gap={3}>
                        <Text fontWeight="semibold" fontSize="lg">
                          {asset.name || 'Unnamed Asset'}
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color="green.600">
                          ${(asset.current_value || asset.value || 0).toLocaleString()}
                        </Text>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Type:</Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {asset.asset_type || asset.category || 'Unknown'}
                          </Text>
                        </HStack>
                        {asset.location && (
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" color="gray.600">Location:</Text>
                            <Text fontSize="sm" fontWeight="medium">{asset.location}</Text>
                          </HStack>
                        )}
                        {asset.postcode && (
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" color="gray.600">Postcode:</Text>
                            <Text fontSize="sm" fontWeight="medium">{asset.postcode}</Text>
                          </HStack>
                        )}
                        {asset.description && (
                          <Text fontSize="sm" color="gray.600">
                            {asset.description}
                          </Text>
                        )}
                      </VStack>
                    </Card.Body>
                    <Card.Footer>
                      <HStack w="full" gap={2}>
                        <Button 
                          colorScheme="green" 
                          size="sm" 
                          flex="1"
                          variant="outline"
                        >
                          <FiEye />
                          View Details
                        </Button>
                        <Button 
                          colorScheme="blue" 
                          size="sm" 
                          flex="1"
                        >
                          <FiShield />
                          Insure
                        </Button>
                        <IconButton
                          aria-label="Edit asset"
                          size="sm"
                          variant="outline"
                          colorScheme="gray"
                        >
                          <FiEdit />
                        </IconButton>
                      </HStack>
                    </Card.Footer>
                  </Card.Root>
                ))}
              </SimpleGrid>
            ) : (
              <VStack gap={6} py={12} textAlign="center">
                <Box
                  w={20}
                  h={20}
                  bgGradient="linear(to-r, gray.100, gray.200)"
                  borderRadius="2xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.400"
                  fontSize="3xl"
                >
                  <FiShield />
                </Box>
                <VStack gap={2}>
                  <Heading size="lg" color="gray.600">
                    No Assets Found
                  </Heading>
                  <Text color="gray.500" textAlign="center" maxW="md">
                    You haven't registered any tokenized assets yet. Register your first asset 
                    to get started with insurance coverage.
                  </Text>
                </VStack>
                <Button 
                  colorScheme="green" 
                  size="lg"
                  bgGradient="linear(to-r, green.500, blue.600)"
                  _hover={{ bgGradient: "linear(to-r, green.600, blue.700)" }}
                >
                  <FiPlus />
                  Register Your First Asset
                </Button>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
};