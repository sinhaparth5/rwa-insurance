"use client";

import {
  Box, Card, Heading, Text, VStack, HStack, Badge, Button, 
  Spinner, SimpleGrid, Flex
} from "@chakra-ui/react";
import { Alert } from "@/components/ui/alert";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect } from "react";
import { fakeAPI } from "@/utils/fakeAPI";
import { AreaChart, BarChart } from "@tremor/react";

export const MyAssets = () => {
  const { address, isConnected } = useWallet();
  const [assets, setAssets] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadAssets();
    }
  }, [isConnected, address]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await fakeAPI.getUserAssets(address!);
      setAssets(data);
    } catch (error) {
      console.error("Failed to load assets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data for asset performance
  const assetValueTrend = [
    { month: "Jan", value: 70000 },
    { month: "Feb", value: 72000 },
    { month: "Mar", value: 75000 },
    { month: "Apr", value: 73000 },
    { month: "May", value: 75000 },
    { month: "Jun", value: 75000 }
  ];

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

  if (loading) {
    return (
      <Box>
        <Heading size="lg" mb={6}>My Assets</Heading>
        <Flex justify="center" py={12}>
          <VStack gap={4}>
            <Spinner size="lg" />
            <Text>Loading your assets...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Assets</Heading>
        {assets && (
          <Badge colorScheme="cyan" fontSize="md" px={3} py={1}>
            {assets.total_assets} Asset{assets.total_assets !== 1 ? 's' : ''}
          </Badge>
        )}
      </HStack>

      {assets ? (
        <VStack gap={6} align="stretch">
          
          {/* Portfolio Overview */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Card.Root>
              <Card.Body textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="cyan.600">
                  £{assets.total_value.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Portfolio Value</Text>
              </Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {assets.total_assets}
                </Text>
                <Text fontSize="sm" color="gray.600">Verified Assets</Text>
              </Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                  £{Math.round(assets.assets.reduce((sum: number, asset: any) => sum + asset.premium_estimate, 0))}
                </Text>
                <Text fontSize="sm" color="gray.600">Monthly Premiums</Text>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Value Trend Chart */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Portfolio Value Trend</Heading>
            </Card.Header>
            <Card.Body>
              <AreaChart
                data={assetValueTrend}
                index="month"
                categories={["value"]}
                colors={["cyan"]}
                yAxisWidth={60}
                showLegend={false}
              />
            </Card.Body>
          </Card.Root>

          {/* Assets Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {assets.assets.map((asset: any) => (
              <Card.Root key={asset.token_id}>
                <Card.Header>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">Token #{asset.token_id}</Text>
                    <Badge colorScheme={asset.verified ? "green" : "yellow"}>
                      {asset.verified ? "Verified" : "Pending"}
                    </Badge>
                  </HStack>
                </Card.Header>
                <Card.Body>
                  <VStack align="start" gap={3}>
                    <Text fontWeight="semibold" fontSize="lg">{asset.name}</Text>
                    <Text fontSize="xl" fontWeight="bold" color="cyan.600">
                      £{asset.value.toLocaleString()}
                    </Text>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">Risk Score:</Text>
                      <Badge colorScheme={asset.risk_score > 70 ? "red" : "green"}>
                        {asset.risk_score}/100
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Est. Premium: £{asset.premium_estimate}/month
                    </Text>
                  </VStack>
                </Card.Body>
                <Card.Footer>
                  <Button colorScheme="cyan" size="sm" w="full">
                    Create Policy
                  </Button>
                </Card.Footer>
              </Card.Root>
            ))}
          </SimpleGrid>
        </VStack>
      ) : (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Text fontSize="lg">No assets found</Text>
              <Text color="gray.500" textAlign="center">
                Register your first tokenized asset to get started with insurance.
              </Text>
              <Button colorScheme="cyan">Register Asset</Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  );
};