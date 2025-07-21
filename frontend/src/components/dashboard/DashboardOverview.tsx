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
  SimpleGrid,
  Flex,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { useInsuranceAPI } from "@/lib/api/services";
import { 
  LineChart, 
  AreaChart, 
  BarChart, 
  DonutChart,
  Card as TremorCard,
  Metric,
  Text as TremorText,
  Flex as TremorFlex,
  BadgeDelta,
} from "@tremor/react";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiShield, 
  FiDollarSign,
  FiRefreshCw,
  FiEye,
  FiPlus
} from "react-icons/fi";

export const DashboardOverview = () => {
  const { address, isConnected } = useWallet();
  const { isAuthenticated, token } = useAuth();
  const insuranceAPI = useInsuranceAPI(token);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!insuranceAPI) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Loading real dashboard data from backend...');
      
      // Get real data from backend
      const [stats, portfolio, analytics, cryptoData] = await Promise.all([
        insuranceAPI.dashboard.getStats(),
        insuranceAPI.dashboard.getPortfolio(), 
        insuranceAPI.dashboard.getAnalytics(),
        // Get crypto data from external API
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true')
          .then(res => res.json())
          .catch(() => ({ ethereum: { usd: 0, usd_24h_change: 0 }, bitcoin: { usd: 0, usd_24h_change: 0 } }))
      ]);

      // Get crypto historical data
      const [ethHistory, btcHistory] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30')
          .then(res => res.json())
          .then(data => data.prices?.map((price: any) => ({
            date: new Date(price[0]).toLocaleDateString(),
            price: price[1]
          })) || [])
          .catch(() => []),
        fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30')
          .then(res => res.json())
          .then(data => data.prices?.map((price: any) => ({
            date: new Date(price[0]).toLocaleDateString(),
            price: price[1]
          })) || [])
          .catch(() => [])
      ]);

      setDashboardData({
        stats,
        portfolio,
        analytics,
        crypto: {
          prices: cryptoData,
          ethereum_history: ethHistory,
          bitcoin_history: btcHistory
        }
      });
      
      console.log('✅ Real dashboard data loaded:', { stats, portfolio, analytics });
      
    } catch (error: any) {
      console.error("❌ Failed to load dashboard data:", error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [insuranceAPI]);

  useEffect(() => {
    if (isAuthenticated && token && insuranceAPI) {
      loadDashboardData();
    }
  }, [isAuthenticated, token, loadDashboardData]);

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (!isConnected) {
    return (
      <Box 
        minH="100vh" 
        bgGradient="linear(to-br, blue.50, purple.50, pink.50)"
        p={6} 
        textAlign="center"
      >
        <VStack gap={6} justify="center" minH="50vh">
          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <VStack gap={4}>
              <Box
                w={16}
                h={16}
                bgGradient="linear(to-r, cyan.400, blue.500)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
              >
                <FiShield />
              </Box>
              <Heading size="xl" bgGradient="linear(to-r, cyan.600, blue.600)" bgClip="text">
                Welcome to RWA Insurance
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Connect your wallet to access your personalized insurance dashboard
              </Text>
            </VStack>
          </Box>
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
        textAlign="center"
      >
        <VStack gap={6} justify="center" minH="50vh">
          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
          >
            <VStack gap={4}>
              <Heading size="xl" bgGradient="linear(to-r, orange.600, red.600)" bgClip="text">
                Authentication Required
              </Heading>
              <Text color="gray.600">Please authenticate your wallet to access the dashboard</Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box bgGradient="linear(to-br, blue.50, purple.50)" minH="100vh" p={6}>
        <Flex justify="center" align="center" minH="50vh">
          <VStack gap={4}>
            <Spinner size="xl" color="cyan.500" />
            <Text color="gray.600">Loading your dashboard...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bgGradient="linear(to-br, red.50, orange.50)" minH="100vh" p={6}>
        <VStack gap={6} justify="center" minH="50vh">
          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            textAlign="center"
          >
            <VStack gap={4}>
              <Text color="red.500" fontSize="xl" fontWeight="bold">
                Failed to Load Dashboard
              </Text>
              <Text color="gray.600">{error}</Text>
              <Button colorScheme="red" onClick={refreshData} loading={refreshing}>
                Try Again
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box bgGradient="linear(to-br, gray.50, blue.50)" minH="100vh" p={6}>
        <Text>No dashboard data available</Text>
      </Box>
    );
  }

  const { stats, portfolio, analytics, crypto } = dashboardData;

  return (
    <Box bgGradient="linear(to-br, blue.50, purple.50, cyan.50)" minH="100vh" p={6}>
      <VStack gap={8} align="stretch">
        
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading 
              size="xl" 
              bgGradient="linear(to-r, cyan.600, blue.600, purple.600)" 
              bgClip="text"
            >
              Insurance Dashboard
            </Heading>
            <Text color="gray.600">
              Real-time overview of your tokenized asset insurance portfolio
            </Text>
          </VStack>
          <HStack>
            <IconButton
              aria-label="Refresh data"
              onClick={refreshData}
              loading={refreshing}
              variant="outline"
              colorScheme="cyan"
              bg="white"
              _hover={{ bg: "cyan.50" }}
            >
              <FiRefreshCw />
            </IconButton>
            <Button 
              colorScheme="cyan" 
              variant="outline"
              bg="white"
              _hover={{ bg: "cyan.50" }}
            >
              <FiEye />
              Portfolio Report
            </Button>
          </HStack>
        </Flex>

        {/* Key Metrics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          <TremorCard decoration="top" decorationColor="cyan">
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Total Assets</TremorText>
                <Metric>{stats.total_assets || 0}</Metric>
              </div>
              <BadgeDelta deltaType={stats.total_assets > 0 ? "moderateIncrease" : "unchanged"}>
                {stats.total_assets || 0}
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>Insured: {stats.insured_assets || 0}</TremorText>
              <TremorText className="text-right">
                Uninsured: {stats.uninsured_assets || 0}
              </TremorText>
            </TremorFlex>
          </TremorCard>

          <TremorCard decoration="top" decorationColor="emerald">
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Portfolio Value</TremorText>
                <Metric>${(stats.total_value || 0).toLocaleString()}</Metric>
              </div>
              <BadgeDelta deltaType={stats.total_value > 0 ? "moderateIncrease" : "unchanged"}>
                {stats.total_value > 0 ? '+' : ''}${(stats.total_value || 0).toLocaleString()}
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>Total Value</TremorText>
              <TremorText className="text-right">USD</TremorText>
            </TremorFlex>
          </TremorCard>

          <TremorCard decoration="top" decorationColor="blue">
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Monthly Premiums</TremorText>
                <Metric>${stats.monthly_premium || 0}</Metric>
              </div>
              <BadgeDelta deltaType={stats.monthly_premium > 0 ? "moderateIncrease" : "unchanged"}>
                ${stats.monthly_premium || 0}
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>Annual: ${((stats.monthly_premium || 0) * 12).toLocaleString()}</TremorText>
              <TremorText className="text-right">Per month</TremorText>
            </TremorFlex>
          </TremorCard>

          <TremorCard decoration="top" decorationColor="violet">
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Active Policies</TremorText>
                <Metric>{stats.active_policies || 0}</Metric>
              </div>
              <BadgeDelta deltaType={stats.active_policies > 0 ? "moderateIncrease" : "unchanged"}>
                {stats.active_policies || 0}
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>Claims: {stats.total_claims || 0}</TremorText>
              <TremorText className="text-right">Pending: {stats.pending_claims || 0}</TremorText>
            </TremorFlex>
          </TremorCard>
        </SimpleGrid>

        {/* Crypto Charts */}
        {crypto?.prices && (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <Card.Root 
              bg="white" 
              borderRadius="xl" 
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Card.Header 
                bgGradient="linear(to-r, blue.500, purple.600)"
                color="white"
                borderTopRadius="xl"
              >
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <Heading size="md">Ethereum (ETH)</Heading>
                    <Text fontSize="sm" opacity={0.9}>30-day price trend</Text>
                  </VStack>
                  <Badge 
                    colorScheme={crypto.prices.ethereum?.usd_24h_change >= 0 ? "green" : "red"}
                    variant="solid"
                  >
                    {crypto.prices.ethereum?.usd_24h_change >= 0 ? '+' : ''}
                    {crypto.prices.ethereum?.usd_24h_change?.toFixed(2) || 0}%
                  </Badge>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                      ${crypto.prices.ethereum?.usd?.toLocaleString() || 0}
                    </Text>
                    <Box color={crypto.prices.ethereum?.usd_24h_change >= 0 ? "green.500" : "red.500"}>
                      {crypto.prices.ethereum?.usd_24h_change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    </Box>
                  </HStack>
                  {crypto.ethereum_history?.length > 0 ? (
                    <Box w="full">
                      <LineChart
                        data={crypto.ethereum_history}
                        index="date"
                        categories={["price"]}
                        colors={["blue"]}
                        yAxisWidth={70}
                        showLegend={false}
                        showGridLines={true}
                        curveType="monotone"
                      />
                    </Box>
                  ) : (
                    <Text color="gray.500" textAlign="center" w="full" py={8}>
                      No price history available
                    </Text>
                  )}
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
              <Card.Header 
                bgGradient="linear(to-r, orange.500, yellow.600)"
                color="white"
                borderTopRadius="xl"
              >
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <Heading size="md">Bitcoin (BTC)</Heading>
                    <Text fontSize="sm" opacity={0.9}>30-day price trend</Text>
                  </VStack>
                  <Badge 
                    colorScheme={crypto.prices.bitcoin?.usd_24h_change >= 0 ? "green" : "red"}
                    variant="solid"
                  >
                    {crypto.prices.bitcoin?.usd_24h_change >= 0 ? '+' : ''}
                    {crypto.prices.bitcoin?.usd_24h_change?.toFixed(2) || 0}%
                  </Badge>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack>
                    <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                      ${crypto.prices.bitcoin?.usd?.toLocaleString() || 0}
                    </Text>
                    <Box color={crypto.prices.bitcoin?.usd_24h_change >= 0 ? "green.500" : "red.500"}>
                      {crypto.prices.bitcoin?.usd_24h_change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    </Box>
                  </HStack>
                  {crypto.bitcoin_history?.length > 0 ? (
                    <Box w="full">
                      <LineChart
                        data={crypto.bitcoin_history}
                        index="date"
                        categories={["price"]}
                        colors={["orange"]}
                        yAxisWidth={70}
                        showLegend={false}
                        showGridLines={true}
                        curveType="monotone"
                      />
                    </Box>
                  ) : (
                    <Text color="gray.500" textAlign="center" w="full" py={8}>
                      No price history available
                    </Text>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        )}

        {/* Portfolio Overview */}
        <Card.Root 
          bg="white" 
          borderRadius="xl" 
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Card.Header bgGradient="linear(to-r, cyan.500, blue.600)" color="white" borderTopRadius="xl">
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Heading size="md">Your Portfolio</Heading>
                <Text fontSize="sm" opacity={0.9}>Assets and their insurance status</Text>
              </VStack>
              <Badge variant="solid" bg="whiteAlpha.200">
                {portfolio?.portfolio?.length || 0} Assets
              </Badge>
            </HStack>
          </Card.Header>
          <Card.Body>
            {portfolio?.portfolio?.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {portfolio.portfolio.map((item: any, idx: number) => (
                  <Card.Root key={idx} variant="outline" borderRadius="lg">
                    <Card.Body>
                      <VStack align="start" gap={3}>
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="bold" fontSize="lg">
                            {item.asset?.name || 'Unknown Asset'}
                          </Text>
                          <Badge 
                            colorScheme={item.policy?.status === 'active' ? 'green' : 'gray'}
                            variant="solid"
                          >
                            {item.policy?.status || 'Uninsured'}
                          </Badge>
                        </HStack>
                        <Text color="gray.600" fontSize="sm">
                          {item.asset?.type || 'Unknown Type'} • {item.asset?.location || 'No Location'}
                        </Text>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.500">Value:</Text>
                          <Text fontWeight="semibold">${(item.asset?.value || 0).toLocaleString()}</Text>
                        </HStack>
                        {item.policy && (
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" color="gray.500">Coverage:</Text>
                            <Text fontWeight="semibold">${(item.policy.coverage_amount || 0).toLocaleString()}</Text>
                          </HStack>
                        )}
                        {item.risk?.score && (
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" color="gray.500">Risk Score:</Text>
                            <Badge colorScheme={item.risk.score > 70 ? 'red' : item.risk.score > 40 ? 'yellow' : 'green'}>
                              {item.risk.score}/100
                            </Badge>
                          </HStack>
                        )}
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                ))}
              </SimpleGrid>
            ) : (
              <VStack gap={4} py={12} textAlign="center">
                <Box
                  w={16}
                  h={16}
                  bgGradient="linear(to-r, gray.100, gray.200)"
                  borderRadius="2xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.400"
                  fontSize="2xl"
                >
                  <FiShield />
                </Box>
                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                  No Assets Found
                </Text>
                <Text color="gray.500">
                  Register your first tokenized asset to get started with insurance coverage
                </Text>
                <Button colorScheme="cyan" size="lg">
                  <FiPlus />
                  Register Asset
                </Button>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>

        {/* Analytics */}
        {analytics && (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {/* Asset Distribution */}
            <Card.Root bg="white" borderRadius="xl" boxShadow="lg">
              <Card.Header>
                <Heading size="md">Asset Distribution</Heading>
                <Text fontSize="sm" color="gray.600">Breakdown by asset type</Text>
              </Card.Header>
              <Card.Body>
                {analytics.asset_distribution && Object.keys(analytics.asset_distribution).length > 0 ? (
                  <DonutChart
                    data={Object.entries(analytics.asset_distribution).map(([type, data]: [string, any]) => ({
                      name: type.charAt(0).toUpperCase() + type.slice(1),
                      value: data.count || 0
                    }))}
                    category="value"
                    index="name"
                    colors={["cyan", "blue", "purple", "pink", "orange"]}
                    showLabel={true}
                  />
                ) : (
                  <Text color="gray.500" textAlign="center" py={8}>
                    No asset distribution data available
                  </Text>
                )}
              </Card.Body>
            </Card.Root>

            {/* Premium Trend */}
            <Card.Root bg="white" borderRadius="xl" boxShadow="lg">
              <Card.Header>
                <Heading size="md">Premium Trend</Heading>
                <Text fontSize="sm" color="gray.600">Monthly premium payments</Text>
              </Card.Header>
              <Card.Body>
                {analytics.monthly_premiums && analytics.monthly_premiums.length > 0 ? (
                  <AreaChart
                    data={analytics.monthly_premiums}
                    index="month"
                    categories={["premium"]}
                    colors={["cyan"]}
                    yAxisWidth={60}
                    showLegend={false}
                  />
                ) : (
                  <Text color="gray.500" textAlign="center" py={8}>
                    No premium data available
                  </Text>
                )}
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};