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
  Input,
  Textarea,
  Dialog,
  IconButton,
  Progress
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { 
  AreaChart, 
  BarChart, 
  DonutChart,
  Card as TremorCard,
  Metric,
  Text as TremorText,
  BadgeDelta,
  Flex as TremorFlex
} from "@tremor/react";
import { 
  FiFileText, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiUpload,
  FiEye,
  FiPlus,
  FiFilter,
  FiDownload
} from "react-icons/fi";

// Fake Claims API
const claimsAPI = {
  async getClaims(walletAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      overview: {
        totalClaims: 12,
        pendingClaims: 2,
        approvedClaims: 8,
        rejectedClaims: 2,
        totalPayout: 45000,
        averageProcessTime: 5.2
      },
      
      claims: [
        {
          claim_id: "CLM-2025-001",
          policy_id: "POL-456-001",
          asset_name: "1965 Aston Martin DB5",
          claim_type: "Theft",
          claim_amount: 15000,
          status: "pending",
          submitted_date: "2025-01-18",
          description: "Vehicle stolen from secured garage",
          evidence_files: ["police_report.pdf", "garage_security.mp4"],
          assessor: "John Smith",
          estimated_payout: 15000
        },
        {
          claim_id: "CLM-2025-002", 
          policy_id: "POL-789-001",
          asset_name: "2020 Ferrari F8",
          claim_type: "Accident Damage",
          claim_amount: 8500,
          status: "approved",
          submitted_date: "2025-01-10",
          processed_date: "2025-01-15",
          description: "Front end collision damage",
          evidence_files: ["damage_photos.jpg", "repair_estimate.pdf"],
          assessor: "Sarah Wilson",
          actual_payout: 8500
        },
        {
          claim_id: "CLM-2024-058",
          policy_id: "POL-123-001", 
          asset_name: "Rolex Submariner",
          claim_type: "Theft",
          claim_amount: 12000,
          status: "approved",
          submitted_date: "2024-12-20",
          processed_date: "2024-12-28",
          description: "Watch stolen during home burglary", 
          evidence_files: ["police_report.pdf"],
          assessor: "Mike Johnson",
          actual_payout: 11500
        },
        {
          claim_id: "CLM-2024-045",
          policy_id: "POL-456-001",
          asset_name: "1965 Aston Martin DB5", 
          claim_type: "Minor Damage",
          claim_amount: 3200,
          status: "rejected",
          submitted_date: "2024-11-15",
          processed_date: "2024-11-22",
          description: "Scratch on passenger door",
          evidence_files: ["damage_photo.jpg"],
          assessor: "John Smith",
          rejection_reason: "Damage below deductible threshold"
        }
      ],

      analytics: {
        claimsByMonth: [
          { month: "Jul", claims: 2, payouts: 8500 },
          { month: "Aug", claims: 1, payouts: 12000 },
          { month: "Sep", claims: 3, payouts: 15600 },
          { month: "Oct", claims: 2, payouts: 9800 },
          { month: "Nov", claims: 1, payouts: 0 },
          { month: "Dec", claims: 2, payouts: 23500 },
        ],

        claimsByType: [
          { type: "Theft", count: 5, total_payout: 38500 },
          { type: "Accident", count: 4, total_payout: 22000 },
          { type: "Damage", count: 2, total_payout: 5500 },
          { type: "Loss", count: 1, total_payout: 8000 }
        ],

        statusDistribution: [
          { name: "Approved", value: 67, color: "#10b981" },
          { name: "Pending", value: 17, color: "#f59e0b" },
          { name: "Rejected", value: 16, color: "#ef4444" }
        ]
      }
    };
  },

  async submitClaim(claimData: any) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      claim_id: `CLM-${Date.now()}`,
      status: "submitted",
      estimated_process_time: "5-7 business days"
    };
  }
};

export const ClaimsManagement = () => {
  const { address, isConnected } = useWallet();
  const [claimsData, setClaimsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [newClaimForm, setNewClaimForm] = useState({
    policy_id: '',
    claim_type: '',
    claim_amount: '',
    description: '',
    evidence_files: [] as string[]
  });

  useEffect(() => {
    if (isConnected && address) {
      loadClaimsData();
    }
  }, [isConnected, address]);

  const loadClaimsData = async () => {
    setLoading(true);
    try {
      const data = await claimsAPI.getClaims(address!);
      setClaimsData(data);
    } catch (error) {
      console.error("Failed to load claims data:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitNewClaim = async () => {
    setSubmittingClaim(true);
    try {
      const result = await claimsAPI.submitClaim({
        ...newClaimForm,
        wallet_address: address
      });
      
      toaster.create({
        title: "Claim Submitted Successfully!",
        description: `Claim ID: ${result.claim_id}. Expected processing time: ${result.estimated_process_time}`,
        type: "success"
      });
      
      setShowNewClaimModal(false);
      setNewClaimForm({
        policy_id: '',
        claim_type: '',
        claim_amount: '',
        description: '',
        evidence_files: []
      });
      
      // Refresh claims data
      loadClaimsData();
      
    } catch (error) {
      toaster.create({
        title: "Claim Submission Failed",
        description: "Please try again later",
        type: "error"
      });
    } finally {
      setSubmittingClaim(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock />;
      case 'approved': return <FiCheckCircle />;
      case 'rejected': return <FiXCircle />;
      default: return <FiFileText />;
    }
  };

  if (!isConnected) {
    return (
      <Box>
        <Heading size="lg" mb={6}>Insurance Claims</Heading>
        <Card.Root>
          <Card.Body>
            <Alert.Root status="info">
              <Alert.Indicator />
              <Alert.Title>Connect your wallet to view and manage your claims</Alert.Title>
            </Alert.Root>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box>
        <Heading size="lg" mb={6}>Insurance Claims</Heading>
        <Flex justify="center" py={12}>
          <VStack gap={4}>
            <Spinner size="lg" />
            <Text>Loading your claims...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <VStack gap={8} align="stretch">
        
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading size="xl">Claims Management</Heading>
            <Text color="gray.600">Track and manage your insurance claims</Text>
          </VStack>
          <HStack>
            <Button variant="outline">
              <FiFilter />
              Filter
            </Button>
            <Button variant="outline">
              <FiDownload />
              Export
            </Button>
            <Button 
              colorScheme="cyan"
              onClick={() => setShowNewClaimModal(true)}
            >
              <FiPlus />
              New Claim
            </Button>
          </HStack>
        </Flex>

        {claimsData && (
          <>
            {/* Overview Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
              <TremorCard>
                <TremorFlex alignItems="start">
                  <div>
                    <TremorText>Total Claims</TremorText>
                    <Metric>{claimsData.overview.totalClaims}</Metric>
                  </div>
                  <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true}>
                    +2
                  </BadgeDelta>
                </TremorFlex>
                <TremorFlex className="mt-4">
                  <TremorText>This year</TremorText>
                  <TremorText className="text-right">All time</TremorText>
                </TremorFlex>
              </TremorCard>

              <TremorCard>
                <TremorFlex alignItems="start">
                  <div>
                    <TremorText>Total Payouts</TremorText>
                    <Metric>£{claimsData.overview.totalPayout.toLocaleString()}</Metric>
                  </div>
                  <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true}>
                    +15%
                  </BadgeDelta>
                </TremorFlex>
                <TremorFlex className="mt-4">
                  <TremorText>Approved claims</TremorText>
                  <TremorText className="text-right">
                    {Math.round((claimsData.overview.approvedClaims / claimsData.overview.totalClaims) * 100)}% rate
                  </TremorText>
                </TremorFlex>
              </TremorCard>

              <TremorCard>
                <TremorFlex alignItems="start">
                  <div>
                    <TremorText>Pending Claims</TremorText>
                    <Metric>{claimsData.overview.pendingClaims}</Metric>
                  </div>
                  <BadgeDelta deltaType="unchanged" isIncreasePositive={true}>
                    0
                  </BadgeDelta>
                </TremorFlex>
                <TremorFlex className="mt-4">
                  <TremorText>Processing</TremorText>
                  <TremorText className="text-right">Avg {claimsData.overview.averageProcessTime} days</TremorText>
                </TremorFlex>
              </TremorCard>

              <TremorCard>
                <TremorFlex alignItems="start">
                  <div>
                    <TremorText>Approval Rate</TremorText>
                    <Metric>{Math.round((claimsData.overview.approvedClaims / claimsData.overview.totalClaims) * 100)}%</Metric>
                  </div>
                  <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true}>
                    +5%
                  </BadgeDelta>
                </TremorFlex>
                <TremorFlex className="mt-4">
                  <TremorText>Industry avg: 72%</TremorText>
                  <TremorText className="text-right">Above average</TremorText>
                </TremorFlex>
              </TremorCard>
            </SimpleGrid>

            {/* Charts */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
              
              {/* Claims Timeline */}
              <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
                <Card.Root>
                  <Card.Header>
                    <Heading size="md">Claims & Payouts Timeline</Heading>
                    <Text fontSize="sm" color="gray.600">Monthly breakdown of claims and payouts</Text>
                  </Card.Header>
                  <Card.Body>
                    <AreaChart
                      data={claimsData.analytics.claimsByMonth}
                      index="month"
                      categories={["claims", "payouts"]}
                      colors={["cyan", "blue"]}
                      yAxisWidth={60}
                      showLegend={true}
                    />
                  </Card.Body>
                </Card.Root>
              </Box>

              {/* Status Distribution */}
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Claims Status</Heading>
                  <Text fontSize="sm" color="gray.600">Distribution by status</Text>
                </Card.Header>
                <Card.Body>
                  <DonutChart
                    data={claimsData.analytics.statusDistribution}
                    category="value"
                    index="name"
                    colors={["emerald", "yellow", "red"]}
                    showLabel={true}
                  />
                </Card.Body>
              </Card.Root>
            </SimpleGrid>

            {/* Claims by Type */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Claims by Type</Heading>
                <Text fontSize="sm" color="gray.600">Breakdown by claim category and total payouts</Text>
              </Card.Header>
              <Card.Body>
                <BarChart
                  data={claimsData.analytics.claimsByType}
                  index="type"
                  categories={["count", "total_payout"]}
                  colors={["cyan", "blue"]}
                  yAxisWidth={60}
                  showLegend={true}
                />
              </Card.Body>
            </Card.Root>

            {/* Claims List */}
            <Card.Root>
              <Card.Header>
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <Heading size="md">Recent Claims</Heading>
                    <Text fontSize="sm" color="gray.600">Your latest claim submissions</Text>
                  </VStack>
                  <Badge colorScheme="cyan">{claimsData.claims.length} Total</Badge>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  {claimsData.claims.map((claim: any, idx: number) => (
                    <Card.Root key={claim.claim_id} variant="outline">
                      <Card.Body>
                        <Flex justify="space-between" align="start">
                          <HStack gap={4} flex="1">
                            <Box
                              w={12}
                              h={12}
                              bg={`${getStatusColor(claim.status)}.100`}
                              color={`${getStatusColor(claim.status)}.600`}
                              borderRadius="lg"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="lg"
                            >
                              {getStatusIcon(claim.status)}
                            </Box>
                            <VStack align="start" gap={1} flex="1">
                              <HStack justify="space-between" w="full">
                                <Text fontWeight="semibold">{claim.claim_id}</Text>
                                <Badge colorScheme={getStatusColor(claim.status)}>
                                  {claim.status.toUpperCase()}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">{claim.asset_name}</Text>
                              <Text fontSize="sm">{claim.description}</Text>
                              <HStack gap={4} fontSize="xs" color="gray.500">
                                <Text>Type: {claim.claim_type}</Text>
                                <Text>Amount: £{claim.claim_amount.toLocaleString()}</Text>
                                <Text>Submitted: {claim.submitted_date}</Text>
                                {claim.assessor && <Text>Assessor: {claim.assessor}</Text>}
                              </HStack>
                            </VStack>
                          </HStack>
                          <VStack gap={2} align="end">
                            <Text fontSize="lg" fontWeight="bold" color="cyan.600">
                              £{(claim.actual_payout || claim.estimated_payout || claim.claim_amount).toLocaleString()}
                            </Text>
                            <HStack>
                              <IconButton
                                aria-label="View details"
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedClaim(claim)}
                              >
                                <FiEye />
                              </IconButton>
                              {claim.evidence_files?.length > 0 && (
                                <IconButton
                                  aria-label="Download evidence"
                                  size="sm"
                                  variant="outline"
                                >
                                  <FiDownload />
                                </IconButton>
                              )}
                            </HStack>
                          </VStack>
                        </Flex>
                      </Card.Body>
                    </Card.Root>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>
          </>
        )}

        {/* New Claim Modal */}
        <Dialog.Root 
          open={showNewClaimModal} 
          onOpenChange={(details) => setShowNewClaimModal(details.open)}
        >
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="2xl">
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>Submit New Claim</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field label="Policy ID">
                    <Input
                      value={newClaimForm.policy_id}
                      onChange={(e) => setNewClaimForm({...newClaimForm, policy_id: e.target.value})}
                      placeholder="POL-456-001"
                    />
                  </Field>
                  
                  <Field label="Claim Type">
                    <Input
                      value={newClaimForm.claim_type}
                      onChange={(e) => setNewClaimForm({...newClaimForm, claim_type: e.target.value})}
                      placeholder="Theft, Damage, Loss, etc."
                    />
                  </Field>
                  
                  <Field label="Claim Amount (£)">
                    <Input
                      type="number"
                      value={newClaimForm.claim_amount}
                      onChange={(e) => setNewClaimForm({...newClaimForm, claim_amount: e.target.value})}
                      placeholder="10000"
                    />
                  </Field>
                  
                  <Field label="Description">
                    <Textarea
                      value={newClaimForm.description}
                      onChange={(e) => setNewClaimForm({...newClaimForm, description: e.target.value})}
                      placeholder="Detailed description of the incident..."
                      rows={4}
                    />
                  </Field>
                  
                  <Field label="Evidence Files">
                    <VStack gap={2} align="stretch">
                      <Button variant="outline" size="sm">
                        <FiUpload />
                        Upload Documents
                      </Button>
                      <Text fontSize="xs" color="gray.600">
                        Upload police reports, photos, receipts, or other supporting documents
                      </Text>
                    </VStack>
                  </Field>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack>
                  <Button variant="outline" onClick={() => setShowNewClaimModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="cyan"
                    onClick={submitNewClaim}
                    loading={submittingClaim}
                    loadingText="Submitting..."
                    disabled={!newClaimForm.policy_id || !newClaimForm.claim_type || !newClaimForm.claim_amount}
                  >
                    Submit Claim
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>

        {/* Claim Details Modal */}
        {selectedClaim && (
          <Dialog.Root 
            open={!!selectedClaim} 
            onOpenChange={(details) => !details.open && setSelectedClaim(null)}
          >
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="3xl">
                <Dialog.CloseTrigger />
                <Dialog.Header>
                  <Dialog.Title>Claim Details - {selectedClaim.claim_id}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <VStack gap={6} align="stretch">
                    <SimpleGrid columns={2} gap={4}>
                      <VStack align="start" gap={2}>
                        <Text fontSize="sm" fontWeight="semibold">Asset</Text>
                        <Text>{selectedClaim.asset_name}</Text>
                      </VStack>
                      <VStack align="start" gap={2}>
                        <Text fontSize="sm" fontWeight="semibold">Status</Text>
                        <Badge colorScheme={getStatusColor(selectedClaim.status)}>
                          {selectedClaim.status.toUpperCase()}
                        </Badge>
                      </VStack>
                      <VStack align="start" gap={2}>
                        <Text fontSize="sm" fontWeight="semibold">Claim Type</Text>
                        <Text>{selectedClaim.claim_type}</Text>
                      </VStack>
                      <VStack align="start" gap={2}>
                        <Text fontSize="sm" fontWeight="semibold">Amount</Text>
                        <Text>£{selectedClaim.claim_amount.toLocaleString()}</Text>
                      </VStack>
                      <VStack align="start" gap={2}>
                        <Text fontSize="sm" fontWeight="semibold">Submitted</Text>
                        <Text>{selectedClaim.submitted_date}</Text>
                      </VStack>
                      {selectedClaim.processed_date && (
                        <VStack align="start" gap={2}>
                          <Text fontSize="sm" fontWeight="semibold">Processed</Text>
                          <Text>{selectedClaim.processed_date}</Text>
                        </VStack>
                      )}
                    </SimpleGrid>
                    
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" fontWeight="semibold">Description</Text>
                      <Text>{selectedClaim.description}</Text>
                    </VStack>
                    
                    {selectedClaim.rejection_reason && (
                      <VStack align="start" gap={2}>
                        <Text fontSize="sm" fontWeight="semibold">Rejection Reason</Text>
                        <Text color="red.600">{selectedClaim.rejection_reason}</Text>
                      </VStack>
                    )}
                    
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" fontWeight="semibold">Evidence Files</Text>
                      <HStack wrap="wrap" gap={2}>
                        {selectedClaim.evidence_files?.map((file: string, idx: number) => (
                          <Badge key={idx} variant="outline">{file}</Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button onClick={() => setSelectedClaim(null)}>Close</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        )}
      </VStack>
    </Box>
  );
};