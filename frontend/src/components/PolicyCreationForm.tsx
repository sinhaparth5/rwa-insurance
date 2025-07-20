"use client";

import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Badge,
  SimpleGrid,
  Flex,
  Spinner
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAssetRegistry, useInsuranceManager } from "@/hooks/useContracts";
import { formatEther, parseEther } from "viem";
import { LineChart, BarChart, DonutChart } from "@tremor/react";

// Fake API service (replace with real API calls later)
const fakeAPIService = {
  async getRiskAssessment(nftContract: string, tokenId: number, walletAddress: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      vehicle_info: {
        make: "Aston Martin",
        model: "DB5", 
        year: 1965,
        value: 50000
      },
      risk_score: 78.5,
      monthly_premium: 156,
      risk_factors: ["High value classic vehicle", "London location", "Limited security"],
      coverage_recommendation: "comprehensive",
      confidence: 0.92
    };
  },

  async createPolicy(policyData: any) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      policy_id: `POL-${Date.now()}`,
      metadata_uri: "ipfs://QmPolicyHash123...",
      contract_params: {
        assetId: policyData.asset_id,
        coverageAmount: parseEther(policyData.coverage_amount.toString()),
        duration: policyData.duration_months * 30 * 24 * 3600,
        riskLevel: 2
      },
      premium_amount: 156,
      success: true
    };
  }
};

interface RiskAssessment {
  vehicle_info: {
    make: string;
    model: string;
    year: number;
    value: number;
  };
  risk_score: number;
  monthly_premium: number;
  risk_factors: string[];
  coverage_recommendation: string;
  confidence: number;
}

export const PolicyCreationForm = () => {
  const { address, isConnected } = useWallet();
  const { useUserAssets } = useAssetRegistry();
  const { purchasePolicy } = useInsuranceManager();
  
  const { data: userAssets, isLoading: assetsLoading } = useUserAssets(address);
  
  const [selectedAsset, setSelectedAsset] = useState<bigint | null>(null);
  const [coverageAmount, setCoverageAmount] = useState("");
  const [duration, setDuration] = useState(12);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fake chart data for risk visualization
  const riskTrendData = [
    { month: "Jan", risk: 65 },
    { month: "Feb", risk: 70 },
    { month: "Mar", risk: 68 },
    { month: "Apr", risk: 72 },
    { month: "May", risk: 75 },
    { month: "Jun", risk: 78 }
  ];

  const premiumBreakdown = [
    { category: "Base Premium", amount: 85 },
    { category: "Location Risk", amount: 35 },
    { category: "Vehicle Age", amount: 20 },
    { category: "Value Premium", amount: 16 }
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 25, color: "#10b981" },
    { name: "Medium Risk", value: 45, color: "#f59e0b" }, 
    { name: "High Risk", value: 30, color: "#ef4444" }
  ];

  const analyzeAsset = async () => {
    if (!selectedAsset || !address) return;
    
    setIsAnalyzing(true);
    try {
      // Replace with real API call: await api.getRiskAssessment(contractAddress, selectedAsset, address)
      const assessment = await fakeAPIService.getRiskAssessment("0x123...", Number(selectedAsset), address);
      setRiskAssessment(assessment);
    } catch (error) {
      toaster.create({
        title: "Analysis Failed",
        description: "Could not analyze asset risk",
        type: "error"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createPolicy = async () => {
    if (!selectedAsset || !coverageAmount || !riskAssessment) return;
    
    setLoading(true);
    try {
      // Step 1: Create policy metadata via API
      const policyData = await fakeAPIService.createPolicy({
        asset_id: Number(selectedAsset),
        coverage_amount: parseInt(coverageAmount),
        duration_months: duration,
        wallet_address: address
      });

      // Step 2: Call smart contract
      await purchasePolicy(
        selectedAsset,
        coverageAmount,
        duration * 30 * 24 * 3600, // Convert months to seconds
        2 // Risk level
      );

      toaster.create({
        title: "Policy Created Successfully!",
        description: `Policy ID: ${policyData.policy_id}`,
        type: "success"
      });

      // Reset form
      setSelectedAsset(null);
      setCoverageAmount("");
      setRiskAssessment(null);

    } catch (error: any) {
      toaster.create({
        title: "Policy Creation Failed",
        description: error?.message || "Transaction failed",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Box maxW="4xl" mx="auto">
        <Card.Root>
          <Card.Body>
            <Alert.Root status="info">
              <Alert.Indicator />
              <Alert.Title>Connect your wallet to create insurance policies</Alert.Title>
            </Alert.Root>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack gap={8} align="stretch">
        
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>Create Insurance Policy</Heading>
          <Text color="gray.600">Protect your tokenized assets with AI-powered risk assessment</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
          
          {/* Left Column - Form */}
          <VStack gap={6} align="stretch">
            
            {/* Asset Selection */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Select Asset</Heading>
              </Card.Header>
              <Card.Body>
                {assetsLoading ? (
                  <Flex justify="center" py={4}>
                    <Spinner />
                  </Flex>
                ) : Array.isArray(userAssets) && userAssets.length > 0 ? (
                  <VStack gap={3} align="stretch">
                    {userAssets.map((assetId: bigint) => (
                      <Card.Root
                        key={assetId.toString()}
                        cursor="pointer"
                        onClick={() => setSelectedAsset(assetId)}
                        bg={selectedAsset === assetId ? "cyan.50" : "white"}
                        borderColor={selectedAsset === assetId ? "cyan.500" : "gray.200"}
                        borderWidth="2px"
                      >
                        <Card.Body py={3}>
                          <HStack justify="space-between">
                            <VStack align="start" gap={1}>
                              <Text fontWeight="semibold">Asset #{assetId.toString()}</Text>
                              <Text fontSize="sm" color="gray.600">1965 Aston Martin DB5</Text>
                            </VStack>
                            <Badge colorScheme="green">Verified</Badge>
                          </HStack>
                        </Card.Body>
                      </Card.Root>
                    ))}
                  </VStack>
                ) : (
                  <Text>No assets found. Register an asset first.</Text>
                )}
              </Card.Body>
            </Card.Root>

            {/* Risk Analysis */}
            {selectedAsset && (
              <Card.Root>
                <Card.Header>
                  <HStack justify="space-between">
                    <Heading size="md">Risk Analysis</Heading>
                    <Button 
                      size="sm" 
                      colorScheme="cyan"
                      onClick={analyzeAsset}
                      loading={isAnalyzing}
                      loadingText="Analyzing..."
                    >
                      Analyze Risk
                    </Button>
                  </HStack>
                </Card.Header>
                <Card.Body>
                  {isAnalyzing ? (
                    <VStack gap={4} py={6}>
                      <Spinner size="lg" />
                      <Text>AI analyzing asset risk factors...</Text>
                    </VStack>
                  ) : riskAssessment ? (
                    <VStack gap={4} align="stretch">
                      <SimpleGrid columns={2} gap={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600">Risk Score</Text>
                          <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                            {riskAssessment.risk_score}/100
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600">Monthly Premium</Text>
                          <Text fontSize="2xl" fontWeight="bold" color="cyan.600">
                            £{riskAssessment.monthly_premium}
                          </Text>
                        </Box>
                      </SimpleGrid>
                      
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>Risk Factors:</Text>
                        <VStack gap={1} align="stretch">
                          {riskAssessment.risk_factors.map((factor, idx) => (
                            <Text key={idx} fontSize="sm" color="gray.600">• {factor}</Text>
                          ))}
                        </VStack>
                      </Box>

                      <Badge alignSelf="start" colorScheme="green">
                        {Math.round(riskAssessment.confidence * 100)}% Confidence
                      </Badge>
                    </VStack>
                  ) : (
                    <Text color="gray.500">Click "Analyze Risk" to get AI assessment</Text>
                  )}
                </Card.Body>
              </Card.Root>
            )}

            {/* Policy Details */}
            {riskAssessment && (
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Policy Details</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack gap={4} align="stretch">
                    <Field label="Coverage Amount (£)">
                      <Input
                        type="number"
                        value={coverageAmount}
                        onChange={(e) => setCoverageAmount(e.target.value)}
                        placeholder="50000"
                      />
                      <Text fontSize="sm" color="gray.600">
                        Maximum: £{riskAssessment.vehicle_info.value.toLocaleString()}
                      </Text>
                    </Field>

                    <Field label="Duration (months)">
                      <HStack>
                        {[6, 12, 24].map((months) => (
                          <Button
                            key={months}
                            size="sm"
                            variant={duration === months ? "solid" : "outline"}
                            colorScheme="cyan"
                            onClick={() => setDuration(months)}
                          >
                            {months}m
                          </Button>
                        ))}
                      </HStack>
                    </Field>

                    <Button
                      colorScheme="cyan"
                      size="lg"
                      onClick={createPolicy}
                      loading={loading}
                      loadingText="Creating Policy..."
                      disabled={!coverageAmount}
                    >
                      Create Policy - £{riskAssessment.monthly_premium}/month
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )}
          </VStack>

          {/* Right Column - Charts & Analytics */}
          <VStack gap={6} align="stretch">
            
            {/* Risk Trend Chart */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Risk Trend Analysis</Heading>
              </Card.Header>
              <Card.Body>
                <LineChart
                  data={riskTrendData}
                  index="month"
                  categories={["risk"]}
                  colors={["cyan"]}
                  yAxisWidth={48}
                  showLegend={false}
                />
              </Card.Body>
            </Card.Root>

            {/* Premium Breakdown */}
            {riskAssessment && (
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Premium Breakdown</Heading>
                </Card.Header>
                <Card.Body>
                  <BarChart
                    data={premiumBreakdown}
                    index="category"
                    categories={["amount"]}
                    colors={["cyan"]}
                    yAxisWidth={48}
                    showLegend={false}
                  />
                </Card.Body>
              </Card.Root>
            )}

            {/* Risk Distribution */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Portfolio Risk Distribution</Heading>
              </Card.Header>
              <Card.Body>
                <DonutChart
                  data={riskDistribution}
                  category="value"
                  index="name"
                  colors={["emerald", "yellow", "red"]}
                  showLabel={true}
                />
              </Card.Body>
            </Card.Root>

            {/* Quick Stats */}
            <SimpleGrid columns={2} gap={4}>
              <Card.Root>
                <Card.Body textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="cyan.600">2.3%</Text>
                  <Text fontSize="sm" color="gray.600">Average Premium Rate</Text>
                </Card.Body>
              </Card.Root>
              <Card.Root>
                <Card.Body textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">94%</Text>
                  <Text fontSize="sm" color="gray.600">Claims Approved</Text>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};