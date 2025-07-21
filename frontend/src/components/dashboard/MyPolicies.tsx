"use client";

import {
  Box, Card, Heading, Text, VStack, HStack, Badge, Button,
  SimpleGrid, Flex, Spinner, IconButton
} from "@chakra-ui/react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { useInsuranceAPI } from "@/lib/api/services";
import { useState, useEffect } from "react";
import { LineChart, DonutChart } from "@tremor/react";
import { 
  FiShield, 
  FiDollarSign, 
  FiCalendar, 
  FiFileText,
  FiPlus, 
  FiRefreshCw,
  FiEye,
  FiCreditCard
} from "react-icons/fi";

export const MyPolicies = () => {
  const { isConnected } = useWallet();
  const { isAuthenticated, token } = useAuth();
  const insuranceAPI = useInsuranceAPI(token);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && insuranceAPI) {
      loadPolicies();
    }
  }, [isAuthenticated, insuranceAPI]);

  const loadPolicies = async () => {
    if (!insuranceAPI) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Loading policies from backend...');
      const policiesData = await insuranceAPI.policies.getAll();
      setPolicies(policiesData || []);
      console.log('✅ Policies loaded:', policiesData);
    } catch (error: any) {
      console.error('❌ Failed to load policies:', error);
      setError(error.message || 'Failed to load policies');
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadPolicies();
    setRefreshing(false);
  };

  const getTotalCoverage = () => {
    return policies.reduce((sum, policy) => sum + (policy.coverage_amount || 0), 0);
  };

  const getTotalPremiums = () => {
    return policies.reduce((sum, policy) => sum + (policy.premium_amount || 0), 0);
  };

  const getActivePolicies = () => {
    return policies.filter(policy => policy.status === 'active');
  };

  const getCoverageDistribution = () => {
    const distribution: { [key: string]: number } = {};
    policies.forEach(policy => {
      const type = policy.coverage_type || 'Unknown';
      distribution[type] = (distribution[type] || 0) + policy.coverage_amount || 0;
    });
    return Object.entries(distribution).map(([type, amount]) => ({ 
      name: type, 
      value: amount 
    }));
  };

  if (!isConnected) {
    return (
      <Box 
        minH="100vh" 
        bgGradient="linear(to-br, purple.50, blue.50, cyan.50)"
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
                bgGradient="linear(to-r, purple.400, blue.500)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
              >
                <FiShield />
              </Box>
              <Heading size="xl" bgGradient="linear(to-r, purple.600, blue.600)" bgClip="text">
                My Insurance Policies
              </Heading>
              <Text color="gray.600">
                Connect your wallet to view your insurance policies
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
              <Text color="gray.600">Please authenticate to view your policies</Text>
            </VStack>
          </Card.Root>
        </VStack>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box bgGradient="linear(to-br, purple.50, blue.50)" minH="100vh" p={6}>
        <Flex justify="center" align="center" minH="50vh">
          <VStack gap={4}>
            <Spinner size="xl" color="purple.500" />
            <Text color="gray.600">Loading your policies...</Text>
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
                Failed to Load Policies
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

  const activePolicies = getActivePolicies();
  const totalCoverage = getTotalCoverage();
  const totalPremiums = getTotalPremiums();
  const coverageData = getCoverageDistribution();

  return (
    <Box bgGradient="linear(to-br, purple.50, blue.50, cyan.50)" minH="100vh" p={6}>
      <VStack gap={8} align="stretch">
        
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading 
              size="xl" 
              bgGradient="linear(to-r, purple.600, blue.600, cyan.600)" 
              bgClip="text"
            >
              My Insurance Policies
            </Heading>
            <Text color="gray.600">
              Manage your active insurance coverage
            </Text>
          </VStack>
          <HStack>
            <IconButton
              aria-label="Refresh policies"
              onClick={refreshData}
              loading={refreshing}
              variant="outline"
              colorScheme="purple"
              bg="white"
              _hover={{ bg: "purple.50" }}
            >
              <FiRefreshCw />
            </IconButton>
            <Button 
              colorScheme="purple"
              bg="white"
              color="purple.600"
              _hover={{ bg: "purple.50" }}
              border="1px solid"
              borderColor="purple.200"
            >
              <FiPlus />
              New Policy
            </Button>
          </HStack>
        </Flex>

        {/* Overview Cards */}
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
                  bgGradient="linear(to-r, purple.400, violet.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                >
                  <FiShield />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, purple.600, violet.600)" bgClip="text">
                  ${totalCoverage.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Coverage</Text>
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
                  <FiDollarSign />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, cyan.600)" bgClip="text">
                  ${totalPremiums}
                </Text>
                <Text fontSize="sm" color="gray.600">Monthly Premiums</Text>
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
                  bgGradient="linear(to-r, green.400, emerald.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                >
                  <FiFileText />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, green.600, emerald.600)" bgClip="text">
                  {activePolicies.length}
                </Text>
                <Text fontSize="sm" color="gray.600">Active Policies</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Coverage Distribution Chart */}
        {coverageData.length > 0 && (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <Card.Root 
              bg="white" 
              borderRadius="xl" 
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Card.Header 
                bgGradient="linear(to-r, purple.500, blue.600)" 
                color="white" 
                borderTopRadius="xl"
              >
                <Heading size="md">Coverage Distribution</Heading>
                <Text fontSize="sm" opacity={0.9}>By coverage type</Text>
              </Card.Header>
              <Card.Body>
                <DonutChart
                  data={coverageData}
                  category="value"
                  index="name"
                  colors={["purple", "blue", "cyan", "green"]}
                  showLabel={true}
                />
              </Card.Body>
            </Card.Root>

            <Card.Root 
              bg="white" 
              borderRadius="xl" 
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Card.Header 
                bgGradient="linear(to-r, blue.500, cyan.600)" 
                color="white" 
                borderTopRadius="xl"
              >
                <Heading size="md">Premium History</Heading>
                <Text fontSize="sm" opacity={0.9}>Monthly payments</Text>
              </Card.Header>
              <Card.Body>
                {policies.length > 0 ? (
                  <LineChart
                    data={[
                      { month: "Jan", premium: totalPremiums * 0.8 },
                      { month: "Feb", premium: totalPremiums * 0.9 },
                      { month: "Mar", premium: totalPremiums * 0.95 },
                      { month: "Apr", premium: totalPremiums },
                      { month: "May", premium: totalPremiums },
                      { month: "Jun", premium: totalPremiums }
                    ]}
                    index="month"
                    categories={["premium"]}
                    colors={["blue"]}
                    yAxisWidth={48}
                    showLegend={false}
                  />
                ) : (
                  <Text color="gray.500" textAlign="center" py={8}>
                    No premium history available
                  </Text>
                )}
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        )}

        {/* Policies List */}
        <Card.Root 
          bg="white" 
          borderRadius="xl" 
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Card.Header 
            bgGradient="linear(to-r, purple.500, blue.600)" 
            color="white" 
            borderTopRadius="xl"
          >
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Heading size="md">Your Policies</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  {policies.length > 0 ? `${policies.length} policies found` : 'No policies created yet'}
                </Text>
              </VStack>
              <Badge variant="solid" bg="whiteAlpha.200">
                {policies.length} Total
              </Badge>
            </HStack>
          </Card.Header>
          <Card.Body p={6}>
            {policies.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {policies.map((policy: any, idx: number) => (
                  <Card.Root key={policy.id || idx} variant="outline" borderRadius="lg">
                    <Card.Header>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Policy #{policy.id || policy.policy_number || 'Unknown'}
                        </Text>
                        <Badge 
                          colorScheme={
                            policy.status === 'active' ? 'green' : 
                            policy.status === 'pending' ? 'yellow' : 'gray'
                          }
                          variant="solid"
                        >
                          {policy.status?.toUpperCase() || 'UNKNOWN'}
                        </Badge>
                      </HStack>
                    </Card.Header>
                    <Card.Body>
                      <VStack align="start" gap={3}>
                        <Text fontWeight="semibold" fontSize="lg">
                          {policy.asset_name || policy.coverage_type || 'Unknown Policy'}
                        </Text>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Coverage:</Text>
                          <Text fontWeight="semibold">${(policy.coverage_amount || 0).toLocaleString()}</Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Premium:</Text>
                          <Text fontWeight="semibold">${policy.premium_amount || 0}/month</Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Deductible:</Text>
                          <Text fontWeight="semibold">${policy.deductible || 0}</Text>
                        </HStack>
                        {policy.start_date && (
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" color="gray.600">Start Date:</Text>
                            <Text fontSize="sm">{new Date(policy.start_date).toLocaleDateString()}</Text>
                          </HStack>
                        )}
                        {policy.end_date && (
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" color="gray.600">End Date:</Text>
                            <Text fontSize="sm">{new Date(policy.end_date).toLocaleDateString()}</Text>
                          </HStack>
                        )}
                      </VStack>
                    </Card.Body>
                    <Card.Footer>
                      <HStack w="full" gap={2}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          flex="1"
                          colorScheme="purple"
                        >
                          <FiEye />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="blue"
                          variant="outline"
                        >
                          <FiCreditCard />
                          Pay
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="outline"
                        >
                          <FiFileText />
                          Claim
                        </Button>
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
                    No Policies Found
                  </Heading>
                  <Text color="gray.500" textAlign="center" maxW="md">
                    You haven't created any insurance policies yet. Create your first policy 
                    to protect your assets with comprehensive coverage.
                  </Text>
                </VStack>
                <Button 
                  colorScheme="purple" 
                  size="lg"
                  bgGradient="linear(to-r, purple.500, blue.600)"
                  _hover={{ bgGradient: "linear(to-r, purple.600, blue.700)" }}
                >
                  <FiPlus />
                  Create Your First Policy
                </Button>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
};