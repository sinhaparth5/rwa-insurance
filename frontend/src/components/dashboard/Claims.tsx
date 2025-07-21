"use client";

import { useInsuranceAPI } from "@/lib/api/services";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
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
import { 
  FiFileText, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiEye,
  FiPlus,
  FiRefreshCw
} from "react-icons/fi";

export const Claims = () => {
  const { isConnected } = useWallet();
  const { isAuthenticated, token } = useAuth();
  const insuranceAPI = useInsuranceAPI(token);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClaims = useCallback(async () => {
    if (!insuranceAPI) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Loading claims from backend...');
      const claimsData = await insuranceAPI.claims.getAll();
      setClaims(claimsData || []);
      console.log('✅ Claims loaded:', claimsData);
    } catch (error: any) {
      console.error('❌ Failed to load claims:', error);
      setError(error.message || 'Failed to load claims');
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }, [insuranceAPI]);

  useEffect(() => {
    if (isAuthenticated && token && insuranceAPI) {
      loadClaims();
    }
  }, [isAuthenticated, token, loadClaims]);

  const refreshData = async () => {
    setRefreshing(true);
    await loadClaims();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'processing': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FiClock />;
      case 'approved': return <FiCheckCircle />;
      case 'rejected': return <FiXCircle />;
      case 'processing': return <FiFileText />;
      default: return <FiFileText />;
    }
  };

  if (!isConnected) {
    return (
      <Box 
        minH="100vh" 
        bgGradient="linear(to-br, blue.50, purple.50, pink.50)"
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
                bgGradient="linear(to-r, cyan.400, blue.500)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
              >
                <FiFileText />
              </Box>
              <Heading size="xl" bgGradient="linear(to-r, cyan.600, blue.600)" bgClip="text">
                Insurance Claims
              </Heading>
              <Text color="gray.600">
                Connect your wallet to view and manage your claims
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
              <Text color="gray.600">Please authenticate to access your claims</Text>
            </VStack>
          </Card.Root>
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
            <Text color="gray.600">Loading your claims...</Text>
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
                Failed to Load Claims
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
              Insurance Claims
            </Heading>
            <Text color="gray.600">
              Track and manage your insurance claims
            </Text>
          </VStack>
          <HStack>
            <IconButton
              aria-label="Refresh claims"
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
              bg="white"
              color="cyan.600"
              _hover={{ bg: "cyan.50" }}
              border="1px solid"
              borderColor="cyan.200"
            >
              <FiPlus />
              New Claim
            </Button>
          </HStack>
        </Flex>

        {/* Claims Overview */}
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
                  bgGradient="linear(to-r, cyan.400, blue.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                >
                  <FiFileText />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, cyan.600, blue.600)" bgClip="text">
                  {claims.length}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Claims</Text>
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
                  bgGradient="linear(to-r, yellow.400, orange.500)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                >
                  <FiClock />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, yellow.600, orange.600)" bgClip="text">
                  {claims.filter(claim => claim.status?.toLowerCase() === 'pending').length}
                </Text>
                <Text fontSize="sm" color="gray.600">Pending Claims</Text>
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
                  <FiCheckCircle />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, green.600, emerald.600)" bgClip="text">
                  {claims.filter(claim => claim.status?.toLowerCase() === 'approved').length}
                </Text>
                <Text fontSize="sm" color="gray.600">Approved Claims</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Claims List */}
        <Card.Root 
          bg="white" 
          borderRadius="xl" 
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Card.Header 
            bgGradient="linear(to-r, cyan.500, blue.600)" 
            color="white" 
            borderTopRadius="xl"
          >
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Heading size="md">Your Claims</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  {claims.length > 0 ? `${claims.length} claims found` : 'No claims submitted yet'}
                </Text>
              </VStack>
              <Badge variant="solid" bg="whiteAlpha.200">
                {claims.length} Total
              </Badge>
            </HStack>
          </Card.Header>
          <Card.Body p={6}>
            {claims.length > 0 ? (
              <VStack gap={4} align="stretch">
                {claims.map((claim: any, idx: number) => (
                  <Card.Root key={claim.id || idx} variant="outline" borderRadius="lg">
                    <Card.Body p={6}>
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
                              <Text fontWeight="semibold" fontSize="lg">
                                Claim #{claim.id || 'Unknown'}
                              </Text>
                              <Badge colorScheme={getStatusColor(claim.status)} variant="solid">
                                {claim.status?.toUpperCase() || 'UNKNOWN'}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              {claim.claim_type || 'Unknown Type'} • Policy #{claim.policy_id || 'Unknown'}
                            </Text>
                            <Text fontSize="sm" color="gray.700">
                              {claim.description || 'No description available'}
                            </Text>
                            <HStack gap={4} fontSize="xs" color="gray.500" mt={2}>
                              <Text>Amount: ${(claim.claim_amount || 0).toLocaleString()}</Text>
                              <Text>Date: {claim.incident_date || claim.created_at || 'Unknown'}</Text>
                              {claim.supporting_documents?.length > 0 && (
                                <Text>Documents: {claim.supporting_documents.length}</Text>
                              )}
                            </HStack>
                          </VStack>
                        </HStack>
                        <VStack gap={2} align="end">
                          <Text fontSize="lg" fontWeight="bold" color="cyan.600">
                            ${(claim.claim_amount || 0).toLocaleString()}
                          </Text>
                          <IconButton
                            aria-label="View details"
                            size="sm"
                            variant="outline"
                            colorScheme="cyan"
                          >
                            <FiEye />
                          </IconButton>
                        </VStack>
                      </Flex>
                    </Card.Body>
                  </Card.Root>
                ))}
              </VStack>
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
                  <FiFileText />
                </Box>
                <VStack gap={2}>
                  <Heading size="lg" color="gray.600">
                    No Claims Found
                  </Heading>
                  <Text color="gray.500" textAlign="center" maxW="md">
                    You haven't submitted any insurance claims yet. When you need to file a claim, 
                    you can do so through your policy dashboard.
                  </Text>
                </VStack>
                <Button 
                  colorScheme="cyan" 
                  size="lg"
                  bgGradient="linear(to-r, cyan.500, blue.600)"
                  _hover={{ bgGradient: "linear(to-r, cyan.600, blue.700)" }}
                >
                  <FiPlus />
                  File Your First Claim
                </Button>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
};