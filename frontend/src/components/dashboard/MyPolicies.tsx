"use client";

import {
  Box, Card, Heading, Text, VStack, HStack, Badge, Button,
  SimpleGrid, Flex, Spinner
} from "@chakra-ui/react";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect } from "react";
import { fakeAPI } from "@/utils/fakeAPI";
import { LineChart, DonutChart } from "@tremor/react";

export const MyPolicies = () => {
  const { address, isConnected } = useWallet();
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadPolicies();
    }
  }, [isConnected, address]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await fakeAPI.getUserPolicies(address!);
      setPolicies(data);
    } catch (error) {
      console.error("Failed to load policies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const premiumHistory = [
    { month: "Jan", premium: 156 },
    { month: "Feb", premium: 156 },
    { month: "Mar", premium: 156 },
    { month: "Apr", premium: 168 },
    { month: "May", premium: 168 },
    { month: "Jun", premium: 156 }
  ];

  const coverageBreakdown = [
    { name: "Comprehensive", value: 70, color: "#0891b2" },
    { name: "Third Party", value: 20, color: "#06b6d4" },
    { name: "Basic", value: 10, color: "#67e8f9" }
  ];

  if (!isConnected) {
    return (
      <Box>
        <Heading size="lg" mb={6}>My Insurance Policies</Heading>
        <Card.Root>
          <Card.Body>
            <Text>Connect your wallet to view your policies</Text>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box>
        <Heading size="lg" mb={6}>My Insurance Policies</Heading>
        <Flex justify="center" py={12}>
          <VStack gap={4}>
            <Spinner size="lg" />
            <Text>Loading your policies...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Insurance Policies</Heading>
        <Badge colorScheme="cyan" fontSize="md" px={3} py={1}>
          {policies.length} Active
        </Badge>
      </HStack>

      <VStack gap={6} align="stretch">
        
        {/* Overview Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Card.Root>
            <Card.Body textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="cyan.600">
                £{policies.reduce((sum, p) => sum + p.coverage_amount, 0).toLocaleString()}
              </Text>
              <Text fontSize="sm" color="gray.600">Total Coverage</Text>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                £{policies.reduce((sum, p) => sum + p.monthly_premium, 0)}
              </Text>
              <Text fontSize="sm" color="gray.600">Monthly Premiums</Text>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {policies.length}
              </Text>
              <Text fontSize="sm" color="gray.600">Active Policies</Text>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          
          {/* Premium History Chart */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Premium History</Heading>
            </Card.Header>
            <Card.Body>
              <LineChart
                data={premiumHistory}
                index="month"
                categories={["premium"]}
                colors={["cyan"]}
                yAxisWidth={48}
                showLegend={false}
              />
            </Card.Body>
          </Card.Root>

          {/* Coverage Breakdown */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Coverage Distribution</Heading>
            </Card.Header>
            <Card.Body>
              <DonutChart
                data={coverageBreakdown}
                category="value"
                index="name"
                colors={["cyan", "blue", "sky"]}
                showLabel={true}
              />
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Policies List */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {policies.map((policy) => (
            <Card.Root key={policy.policy_id}>
              <Card.Header>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">
                    {policy.policy_id}
                  </Text>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Text fontWeight="semibold">{policy.asset_name}</Text>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.600">Coverage:</Text>
                    <Text fontWeight="semibold">£{policy.coverage_amount.toLocaleString()}</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.600">Premium:</Text>
                    <Text fontWeight="semibold">£{policy.monthly_premium}/month</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.600">Next Payment:</Text>
                    <Text fontSize="sm">{policy.next_payment}</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.600">Claims:</Text>
                    <Badge size="sm">{policy.claims_count}</Badge>
                  </HStack>
                </VStack>
              </Card.Body>
              <Card.Footer>
                <HStack w="full">
                  <Button size="sm" variant="outline" flex="1">
                    View Details
                  </Button>
                  <Button size="sm" colorScheme="red" variant="outline">
                    File Claim
                  </Button>
                </HStack>
              </Card.Footer>
            </Card.Root>
          ))}
        </SimpleGrid>

        {policies.length === 0 && (
          <Card.Root>
            <Card.Body>
              <VStack gap={4} py={8}>
                <Text fontSize="lg">No policies found</Text>
                <Text color="gray.500" textAlign="center">
                  Create your first insurance policy to protect your assets.
                </Text>
                <Button colorScheme="cyan">Create Policy</Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        )}
      </VStack>
    </Box>
  );
};