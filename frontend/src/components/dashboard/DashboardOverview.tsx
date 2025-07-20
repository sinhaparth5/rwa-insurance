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
  Avatar,
  Spinner,
  IconButton,
  Progress
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
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
  Grid,
  Col
} from "@tremor/react";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiShield, 
  FiAlertCircle,
  FiDollarSign,
  FiUsers,
  FiActivity,
  FiRefreshCw,
  FiEye,
  FiFileText,
  FiPlus
} from "react-icons/fi";

// Enhanced fake data service
const dashboardAPI = {
  async getDashboardData(walletAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      // Wallet & Portfolio Overview
      wallet: {
        address: walletAddress,
        balance: 15.47,
        totalAssetValue: 125000,
        insuranceValue: 85000,
        riskScore: 68,
        premiumsPaid: 2340,
        claimsReceived: 0
      },
      
      // Portfolio Statistics
      portfolio: {
        totalAssets: 3,
        insuredAssets: 2,
        pendingVerification: 1,
        totalCoverage: 85000,
        monthlyPremiums: 287,
        averageRisk: 68,
        portfolioGrowth: 12.5
      },
      
      // Recent Activity
      recentActivity: [
        { type: 'policy_created', asset: 'Aston Martin DB5', amount: 50000, date: '2025-01-18', status: 'success' },
        { type: 'premium_paid', asset: 'Ferrari F8', amount: 156, date: '2025-01-15', status: 'success' },
        { type: 'asset_verified', asset: 'Rolex Submariner', amount: 15000, date: '2025-01-12', status: 'success' },
        { type: 'risk_updated', asset: 'Aston Martin DB5', amount: 0, date: '2025-01-10', status: 'warning' }
      ],

      // Charts Data
      charts: {
        portfolioValue: [
          { month: "Jul 24", value: 95000, insurance: 60000 },
          { month: "Aug 24", value: 98000, insurance: 65000 },
          { month: "Sep 24", value: 105000, insurance: 70000 },
          { month: "Oct 24", value: 110000, insurance: 75000 },
          { month: "Nov 24", value: 118000, insurance: 80000 },
          { month: "Dec 24", value: 125000, insurance: 85000 },
        ],
        
        premiumTrend: [
          { month: "Jul", paid: 280, projected: 275 },
          { month: "Aug", paid: 285, projected: 280 },
          { month: "Sep", paid: 282, projected: 285 },
          { month: "Oct", paid: 287, projected: 290 },
          { month: "Nov", paid: 290, projected: 295 },
          { month: "Dec", paid: 287, projected: 285 },
        ],

        riskDistribution: [
          { category: "Low Risk", count: 8, percentage: 40, color: "#10b981" },
          { category: "Medium Risk", count: 7, percentage: 35, color: "#f59e0b" },
          { category: "High Risk", count: 5, percentage: 25, color: "#ef4444" }
        ],

        claimsAnalysis: [
          { type: "Vehicle", approved: 15, pending: 3, rejected: 2 },
          { type: "Property", approved: 8, pending: 1, rejected: 1 },
          { type: "Art", approved: 5, pending: 2, rejected: 0 },
          { type: "Jewelry", approved: 12, pending: 1, rejected: 1 }
        ],

        coverageBreakdown: [
          { name: "Comprehensive", value: 65, color: "#0891b2" },
          { name: "Third Party", value: 25, color: "#06b6d4" },
          { name: "Basic", value: 10, color: "#67e8f9" }
        ]
      },

      // Market Insights
      marketData: {
        avgPremiumRate: 2.8,
        marketGrowth: 15.2,
        claimsRatio: 0.12,
        customerSatisfaction: 94.5
      }
    };
  }
};

export const DashboardOverview = () => {
  const { address, isConnected } = useWallet();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadDashboardData();
    }
  }, [isConnected, address]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await dashboardAPI.getDashboardData(address!);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (!isConnected) {
    return (
      <Box p={6} textAlign="center">
        <VStack gap={6}>
          <Heading size="xl">Welcome to RWA Insurance</Heading>
          <Text color="gray.600" fontSize="lg">
            Connect your wallet to access your personalized insurance dashboard
          </Text>
        </VStack>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={6}>
        <Flex justify="center" align="center" minH="50vh">
          <VStack gap={4}>
            <Spinner size="xl" />
            <Text>Loading your dashboard...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box p={6}>
        <Text>Failed to load dashboard data</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack gap={8} align="stretch">
        
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading size="xl">Insurance Dashboard</Heading>
            <Text color="gray.600">
              Comprehensive overview of your tokenized asset insurance portfolio
            </Text>
          </VStack>
          <HStack>
            <IconButton
              aria-label="Refresh data"
              onClick={refreshData}
              loading={refreshing}
              variant="outline"
            >
              <FiRefreshCw />
            </IconButton>
            <Button colorScheme="cyan" variant="outline">
              <FiEye />
              Portfolio Report
            </Button>
          </HStack>
        </Flex>

        {/* Key Metrics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          <TremorCard>
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Total Portfolio Value</TremorText>
                <Metric>£{dashboardData.wallet.totalAssetValue.toLocaleString()}</Metric>
              </div>
              <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true}>
                +{dashboardData.portfolio.portfolioGrowth}%
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>Insured: £{dashboardData.wallet.insuranceValue.toLocaleString()}</TremorText>
              <TremorText className="text-right">
                {Math.round((dashboardData.wallet.insuranceValue / dashboardData.wallet.totalAssetValue) * 100)}% Coverage
              </TremorText>
            </TremorFlex>
          </TremorCard>

          <TremorCard>
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Monthly Premiums</TremorText>
                <Metric>£{dashboardData.portfolio.monthlyPremiums}</Metric>
              </div>
              <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={false}>
                +2.1%
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>Annual: £{(dashboardData.portfolio.monthlyPremiums * 12).toLocaleString()}</TremorText>
              <TremorText className="text-right">
                {((dashboardData.portfolio.monthlyPremiums * 12) / dashboardData.wallet.insuranceValue * 100).toFixed(1)}% Rate
              </TremorText>
            </TremorFlex>
          </TremorCard>

          <TremorCard>
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Risk Score</TremorText>
                <Metric>{dashboardData.portfolio.averageRisk}/100</Metric>
              </div>
              <BadgeDelta deltaType="unchanged" isIncreasePositive={true}>
                0%
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>
                {dashboardData.portfolio.averageRisk < 40 ? "Low Risk" : 
                 dashboardData.portfolio.averageRisk < 70 ? "Medium Risk" : "High Risk"}
              </TremorText>
              <TremorText className="text-right">Portfolio Avg</TremorText>
            </TremorFlex>
          </TremorCard>

          <TremorCard>
            <TremorFlex alignItems="start">
              <div>
                <TremorText>Active Policies</TremorText>
                <Metric>{dashboardData.portfolio.insuredAssets}</Metric>
              </div>
              <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true}>
                +1
              </BadgeDelta>
            </TremorFlex>
            <TremorFlex className="mt-4">
              <TremorText>Total Assets: {dashboardData.portfolio.totalAssets}</TremorText>
              <TremorText className="text-right">
                {Math.round((dashboardData.portfolio.insuredAssets / dashboardData.portfolio.totalAssets) * 100)}% Insured
              </TremorText>
            </TremorFlex>
          </TremorCard>
        </SimpleGrid>

        {/* Charts Row 1 */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          
          {/* Portfolio Value Trend */}
          <Card.Root>
            <Card.Header>
              <HStack justify="space-between">
                <VStack align="start" gap={1}>
                  <Heading size="md">Portfolio Value Trend</Heading>
                  <Text fontSize="sm" color="gray.600">Asset value vs Insurance coverage over time</Text>
                </VStack>
                <Badge colorScheme="green">6M Growth: +31.6%</Badge>
              </HStack>
            </Card.Header>
            <Card.Body>
              <AreaChart
                data={dashboardData.charts.portfolioValue}
                index="month"
                categories={["value", "insurance"]}
                colors={["cyan", "blue"]}
                yAxisWidth={60}
                showLegend={true}
                showGridLines={true}
                curveType="linear"
              />
            </Card.Body>
          </Card.Root>

          {/* Premium Analysis */}
          <Card.Root>
            <Card.Header>
              <VStack align="start" gap={1}>
                <Heading size="md">Premium Analysis</Heading>
                <Text fontSize="sm" color="gray.600">Actual vs projected premium payments</Text>
              </VStack>
            </Card.Header>
            <Card.Body>
              <LineChart
                data={dashboardData.charts.premiumTrend}
                index="month"
                categories={["paid", "projected"]}
                colors={["emerald", "gray"]}
                yAxisWidth={50}
                showLegend={true}
                showGridLines={true}
              />
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Charts Row 2 */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          
          {/* Risk Distribution */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Risk Distribution</Heading>
              <Text fontSize="sm" color="gray.600">Portfolio risk breakdown</Text>
            </Card.Header>
            <Card.Body>
              <DonutChart
                data={dashboardData.charts.riskDistribution}
                category="percentage"
                index="category"
                colors={["emerald", "yellow", "red"]}
                showLabel={true}
                showAnimation={true}
              />
              <VStack gap={2} mt={4}>
                {dashboardData.charts.riskDistribution.map((item: any, idx: number) => (
                  <HStack key={idx} justify="space-between" w="full" fontSize="sm">
                    <HStack>
                      <Box w={3} h={3} bg={item.color} borderRadius="full" />
                      <Text>{item.category}</Text>
                    </HStack>
                    <Text fontWeight="semibold">{item.count} assets</Text>
                  </HStack>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Claims Analysis */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Claims by Category</Heading>
              <Text fontSize="sm" color="gray.600">Approval rates by asset type</Text>
            </Card.Header>
            <Card.Body>
              <BarChart
                data={dashboardData.charts.claimsAnalysis}
                index="type"
                categories={["approved", "pending", "rejected"]}
                colors={["emerald", "yellow", "red"]}
                yAxisWidth={40}
                showLegend={true}
                stack={true}
              />
            </Card.Body>
          </Card.Root>

          {/* Coverage Types */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Coverage Distribution</Heading>
              <Text fontSize="sm" color="gray.600">Types of coverage in portfolio</Text>
            </Card.Header>
            <Card.Body>
              <DonutChart
                data={dashboardData.charts.coverageBreakdown}
                category="value"
                index="name"
                colors={["cyan", "blue", "sky"]}
                showLabel={true}
              />
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Activity & Insights Row */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          
          {/* Recent Activity - spans 2 columns */}
          <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
            <Card.Root>
              <Card.Header>
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <Heading size="md">Recent Activity</Heading>
                    <Text fontSize="sm" color="gray.600">Latest updates on your portfolio</Text>
                  </VStack>
                  <Button size="sm" variant="outline">
                    <FiFileText />
                    View All
                  </Button>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  {dashboardData.recentActivity.map((activity: any, idx: number) => (
                    <Flex key={idx} justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                      <HStack gap={3}>
                        <Box
                          w={10}
                          h={10}
                          bg={activity.status === 'success' ? 'green.100' : 'orange.100'}
                          color={activity.status === 'success' ? 'green.600' : 'orange.600'}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {activity.type === 'policy_created' ? <FiShield /> :
                           activity.type === 'premium_paid' ? <FiDollarSign /> :
                           activity.type === 'asset_verified' ? <FiUsers /> : <FiActivity />}
                        </Box>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="semibold" fontSize="sm">
                            {activity.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {activity.asset} {activity.amount > 0 && `- £${activity.amount.toLocaleString()}`}
                          </Text>
                        </VStack>
                      </HStack>
                      <VStack align="end" gap={0}>
                        <Badge 
                          size="sm" 
                          colorScheme={activity.status === 'success' ? 'green' : 'orange'}
                        >
                          {activity.status}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">{activity.date}</Text>
                      </VStack>
                    </Flex>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>
          </Box>

          {/* Market Insights */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Market Insights</Heading>
              <Text fontSize="sm" color="gray.600">Industry benchmarks</Text>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm">Avg Premium Rate</Text>
                    <Text fontSize="sm" fontWeight="semibold">{dashboardData.marketData.avgPremiumRate}%</Text>
                  </HStack>
                  <Progress.Root value={Math.min(dashboardData.marketData.avgPremiumRate * 20, 100)} colorScheme="cyan">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Box>
                
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm">Market Growth</Text>
                    <HStack>
                      <FiTrendingUp color="green" />
                      <Text fontSize="sm" fontWeight="semibold" color="green.600">
                        +{dashboardData.marketData.marketGrowth}%
                      </Text>
                    </HStack>
                  </HStack>
                  <Progress.Root value={Math.min(dashboardData.marketData.marketGrowth * 6.67, 100)} colorScheme="green">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Box>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm">Claims Ratio</Text>
                    <Text fontSize="sm" fontWeight="semibold">{(dashboardData.marketData.claimsRatio * 100).toFixed(1)}%</Text>
                  </HStack>
                  <Progress.Root value={Math.min(dashboardData.marketData.claimsRatio * 100 * 5, 100)} colorScheme="orange">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Box>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm">Satisfaction</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="green.600">
                      {dashboardData.marketData.customerSatisfaction}%
                    </Text>
                  </HStack>
                  <Progress.Root value={Math.min(dashboardData.marketData.customerSatisfaction, 100)} colorScheme="green">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Quick Actions */}
        <Card.Root bg="gradient-to-r from-cyan.50 to-blue.50">
          <Card.Body>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
              <VStack>
                <Text fontSize="sm" fontWeight="semibold">Quick Actions</Text>
              </VStack>
              <Button colorScheme="cyan">
                <FiPlus />
                New Policy
              </Button>
              <Button variant="outline">
                <FiFileText />
                File Claim
              </Button>
              <Button variant="outline">
                <FiActivity />
                Risk Assessment
              </Button>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
};