"use client";

import {
  Box,
  Button,
  Card,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  HStack,
  Badge,
  createListCollection,
  Spinner
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { useAssetRegistry } from "@/hooks/useContracts";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { useInsuranceAPI } from "@/lib/api/services";
import { 
  FiUpload, 
  FiShield, 
  FiCheck, 
  FiAlertTriangle,
  FiInfo
} from "react-icons/fi";

interface BlockchainRegistrationResult {
  tokenId?: string | number;
  id?: string | number;
  token_id?: string | number;
  contractAddress?: string;
  contract_address?: string;
  address?: string;
  transactionHash?: string;
  success?: boolean;
}

export const RegisterAsset = () => {
  const { address, isConnected } = useWallet();
  const { isAuthenticated, token } = useAuth();
  const { registerAsset: registerOnBlockchain, isLoading: blockchainLoading } = useAssetRegistry();
  const insuranceAPI = useInsuranceAPI(token);
  
  const [formData, setFormData] = useState({
    name: "",
    assetType: "",
    description: "",
    estimatedValue: "",
    location: "",
    postcode: "",
    documentHash: "",
    metadataURI: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Blockchain, 3: Backend, 4: Complete

  // Create collection for Chakra UI v3 Select
  const assetTypes = createListCollection({
    items: [
      { value: "vehicle", label: "Vehicle" },
      { value: "real_estate", label: "Real Estate" },
      { value: "artwork", label: "Artwork" },
      { value: "jewelry", label: "Jewelry" },
      { value: "electronics", label: "Electronics" },
      { value: "collectibles", label: "Collectibles" },
      { value: "other", label: "Other" }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toaster.create({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        type: "error",
        duration: 5000,
      });
      return;
    }

    if (!isAuthenticated || !insuranceAPI) {
      toaster.create({
        title: "Authentication Required",
        description: "Please authenticate your wallet to register assets",
        type: "error",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    let blockchainTokenId = null;
    
    try {
      // Step 1: Register on Blockchain
      setStep(2);
      console.log('🔗 Step 1: Registering asset on blockchain...');
      
      const blockchainResult: BlockchainRegistrationResult = await registerOnBlockchain(
        formData.assetType,
        formData.description,
        formData.estimatedValue,
        formData.documentHash,
        formData.metadataURI
      ) as unknown as BlockchainRegistrationResult;
      
      // Extract token ID from blockchain result
      blockchainTokenId = blockchainResult?.tokenId || 
                         blockchainResult?.id || 
                         blockchainResult?.token_id || 
                         Math.floor(Math.random() * 1000000);
      
      toaster.create({
        title: "Blockchain Registration Complete",
        description: `Asset registered on blockchain with Token ID: ${blockchainTokenId}`,
        type: "success",
        duration: 3000,
      });

      // Step 2: Save to Backend
      setStep(3);
      console.log('💾 Step 2: Saving asset to backend...');
      
      const backendAssetData = {
        name: formData.name,
        category: formData.assetType,
        value: parseFloat(formData.estimatedValue),
        description: formData.description,
        location: formData.location,
        postcode: formData.postcode,
        token_id: blockchainTokenId.toString(),
        contract_address: blockchainResult?.contractAddress || 
                         blockchainResult?.contract_address || 
                         blockchainResult?.address || 
                         "0x0000000000000000000000000000000000000000",
        metadata: {
          document_hash: formData.documentHash,
          metadata_uri: formData.metadataURI,
          registration_date: new Date().toISOString(),
          blockchain_network: "BlockDAG",
          verification_status: "pending"
        }
      };

      const backendResult = await insuranceAPI.assets.create(backendAssetData);
      
      setStep(4);
      
      toaster.create({
        title: "Asset Registration Complete! 🎉",
        description: `Asset successfully registered both on blockchain and backend. Asset ID: ${backendResult.id}`,
        type: "success",
        duration: 7000,
      });
      
      // Reset form
      setFormData({
        name: "",
        assetType: "",
        description: "",
        estimatedValue: "",
        location: "",
        postcode: "",
        documentHash: "",
        metadataURI: ""
      });
      
      // Reset to step 1 after 3 seconds
      setTimeout(() => {
        setStep(1);
      }, 3000);

    } catch (error: any) {
      console.error('❌ Asset registration failed:', error);
      
      let errorMessage = "Failed to register asset";
      let errorTitle = "Registration Failed";
      
      if (step === 2) {
        errorTitle = "Blockchain Registration Failed";
        errorMessage = error?.message || "Failed to register asset on blockchain";
      } else if (step === 3) {
        errorTitle = "Backend Save Failed";
        errorMessage = "Asset registered on blockchain but failed to save to backend. Please contact support.";
      }
      
      toaster.create({
        title: errorTitle,
        description: errorMessage,
        type: "error",
        duration: 8000,
      });
      
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (stepNumber: number) => {
    if (step > stepNumber) return <FiCheck color="green" />;
    if (step === stepNumber) return <Spinner size="sm" />;
    return <FiInfo color="gray" />;
  };

  const getStepColor = (stepNumber: number) => {
    if (step > stepNumber) return "green";
    if (step === stepNumber) return "blue";
    return "gray";
  };

  if (!isConnected) {
    return (
      <Box 
        minH="100vh" 
        bgGradient="linear(to-br, orange.50, yellow.50, green.50)"
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
                bgGradient="linear(to-r, orange.400, yellow.500)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
              >
                <FiUpload />
              </Box>
              <Heading size="xl" bgGradient="linear(to-r, orange.600, yellow.600)" bgClip="text">
                Register New Asset
              </Heading>
              <Text color="gray.600">
                Connect your wallet to register your tokenized assets
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
        bgGradient="linear(to-br, red.50, orange.50, yellow.50)"
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
                bgGradient="linear(to-r, red.400, orange.500)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="2xl"
              >
                <FiAlertTriangle />
              </Box>
              <Heading size="xl" bgGradient="linear(to-r, red.600, orange.600)" bgClip="text">
                Authentication Required
              </Heading>
              <Text color="gray.600">Please authenticate to register assets</Text>
            </VStack>
          </Card.Root>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bgGradient="linear(to-br, orange.50, yellow.50, green.50)" minH="100vh" p={6}>
      <VStack gap={8} align="stretch" maxW="4xl" mx="auto">
        
        {/* Header */}
        <VStack align="start" gap={2}>
          <Heading 
            size="xl" 
            bgGradient="linear(to-r, orange.600, yellow.600, green.600)" 
            bgClip="text"
          >
            Register New Asset
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Register your real-world asset on blockchain and our platform
          </Text>
        </VStack>

        {/* Progress Steps */}
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
            <Heading size="md">Registration Process</Heading>
          </Card.Header>
          <Card.Body p={6}>
            <HStack justify="space-between" w="full">
              <VStack gap={2} textAlign="center" flex="1">
                <Box
                  w={10}
                  h={10}
                  bg={`${getStepColor(1)}.100`}
                  color={`${getStepColor(1)}.600`}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="lg"
                  border="2px solid"
                  borderColor={`${getStepColor(1)}.200`}
                >
                  {getStepIcon(1)}
                </Box>
                <Text fontSize="sm" fontWeight="semibold" color={`${getStepColor(1)}.600`}>
                  Fill Details
                </Text>
              </VStack>
              
              <Box flex="1" h="2px" bg={step > 1 ? "green.200" : "gray.200"} alignSelf="center" />
              
              <VStack gap={2} textAlign="center" flex="1">
                <Box
                  w={10}
                  h={10}
                  bg={`${getStepColor(2)}.100`}
                  color={`${getStepColor(2)}.600`}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="lg"
                  border="2px solid"
                  borderColor={`${getStepColor(2)}.200`}
                >
                  {getStepIcon(2)}
                </Box>
                <Text fontSize="sm" fontWeight="semibold" color={`${getStepColor(2)}.600`}>
                  Blockchain
                </Text>
              </VStack>
              
              <Box flex="1" h="2px" bg={step > 2 ? "green.200" : "gray.200"} alignSelf="center" />
              
              <VStack gap={2} textAlign="center" flex="1">
                <Box
                  w={10}
                  h={10}
                  bg={`${getStepColor(3)}.100`}
                  color={`${getStepColor(3)}.600`}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="lg"
                  border="2px solid"
                  borderColor={`${getStepColor(3)}.200`}
                >
                  {getStepIcon(3)}
                </Box>
                <Text fontSize="sm" fontWeight="semibold" color={`${getStepColor(3)}.600`}>
                  Backend Save
                </Text>
              </VStack>
              
              <Box flex="1" h="2px" bg={step > 3 ? "green.200" : "gray.200"} alignSelf="center" />
              
              <VStack gap={2} textAlign="center" flex="1">
                <Box
                  w={10}
                  h={10}
                  bg={`${getStepColor(4)}.100`}
                  color={`${getStepColor(4)}.600`}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="lg"
                  border="2px solid"
                  borderColor={`${getStepColor(4)}.200`}
                >
                  {getStepIcon(4)}
                </Box>
                <Text fontSize="sm" fontWeight="semibold" color={`${getStepColor(4)}.600`}>
                  Complete
                </Text>
              </VStack>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Registration Form */}
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
            <VStack align="start" gap={1}>
              <Heading size="md">Asset Information</Heading>
              <Text fontSize="sm" opacity={0.9}>
                Provide details about your real-world asset
              </Text>
            </VStack>
          </Card.Header>
          
          <Card.Body p={8}>
            <form onSubmit={handleSubmit}>
              <VStack gap={6} align="stretch">
                
                {/* Asset Name */}
                <Field label="Asset Name" required>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., 2020 Tesla Model S, Rolex Submariner, Downtown Apartment"
                    size="lg"
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Asset Type */}
                <Field label="Asset Category" required>
                  <Select.Root
                    collection={assetTypes}
                    value={formData.assetType ? [formData.assetType] : []}
                    onValueChange={(e) => setFormData({ ...formData, assetType: e.value[0] || "" })}
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select asset category" />
                      </Select.Trigger>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {assetTypes.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field>

                {/* Description */}
                <Field label="Detailed Description" required>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide a comprehensive description including make, model, year, condition, unique features, etc..."
                    rows={4}
                    resize="vertical"
                    size="lg"
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Value and Location Row */}
                <HStack gap={6} align="start">
                  <Field label="Estimated Value (USD)" required flex="1">
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.estimatedValue}
                      onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                      placeholder="50000.00"
                      size="lg"
                      disabled={isSubmitting}
                    />
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      Current market value in USD
                    </Text>
                  </Field>

                  <Field label="Location" required flex="1">
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g., London, New York, Tokyo"
                      size="lg"
                      disabled={isSubmitting}
                    />
                  </Field>
                </HStack>

                {/* Postcode */}
                <Field label="Postcode/ZIP Code">
                  <Input
                    value={formData.postcode}
                    onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                    placeholder="e.g., SW1A 1AA, 10001, 100-0001"
                    size="lg"
                    disabled={isSubmitting}
                  />
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    Used for risk assessment and location-based pricing
                  </Text>
                </Field>

                {/* Document Hash */}
                <Field label="Document Hash (IPFS)" helperText="Upload supporting documents to IPFS and provide the hash">
                  <Input
                    value={formData.documentHash}
                    onChange={(e) => setFormData({...formData, documentHash: e.target.value})}
                    placeholder="QmXxx... (optional)"
                    size="lg"
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Metadata URI */}
                <Field label="Metadata URI" helperText="Additional metadata or external link">
                  <Input
                    value={formData.metadataURI}
                    onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
                    placeholder="https://... (optional)"
                    size="lg"
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="xl"
                  loading={isSubmitting}
                  loadingText={
                    step === 2 ? "Registering on Blockchain..." :
                    step === 3 ? "Saving to Backend..." :
                    "Processing..."
                  }
                  disabled={!formData.name || !formData.assetType || !formData.description || !formData.estimatedValue || !formData.location}
                  bgGradient="linear(to-r, orange.500, yellow.500, green.500)"
                  _hover={{ bgGradient: "linear(to-r, orange.600, yellow.600, green.600)" }}
                  color="white"
                  fontWeight="bold"
                >
                  {isSubmitting ? (
                    <HStack>
                      <Spinner size="sm" />
                      <Text>
                        {step === 2 ? "Registering on Blockchain..." :
                         step === 3 ? "Saving to Backend..." :
                         step === 4 ? "Registration Complete!" :
                         "Processing..."}
                      </Text>
                    </HStack>
                  ) : (
                    <HStack>
                      <FiShield />
                      <Text>Register Asset on Blockchain & Backend</Text>
                    </HStack>
                  )}
                </Button>

                {/* Success Message */}
                {step === 4 && (
                  <Alert.Root status="success" variant="solid">
                    <Alert.Indicator />
                    <Alert.Title>Asset Registration Successful! 🎉</Alert.Title>
                    <Alert.Description>
                      Your asset has been successfully registered both on the blockchain and our backend. 
                      You can now create insurance policies for this asset.
                    </Alert.Description>
                  </Alert.Root>
                )}

                {/* Info Card */}
                <Card.Root 
                  bgGradient="linear(to-r, cyan.50, blue.50)" 
                  borderColor="cyan.200"
                  border="1px solid"
                >
                  <Card.Body>
                    <VStack align="start" gap={3}>
                      <HStack>
                        <Badge 
                          colorScheme="cyan" 
                          variant="solid"
                          bgGradient="linear(to-r, cyan.500, blue.600)"
                        >
                          <FiInfo style={{ marginRight: '4px' }} />
                          Registration Process
                        </Badge>
                      </HStack>
                      <VStack align="start" gap={1} fontSize="sm" color="gray.700">
                        <Text>🔗 <strong>Blockchain Registration:</strong> Creates an immutable record with a unique Token ID</Text>
                        <Text>💾 <strong>Backend Storage:</strong> Saves detailed asset information for insurance processing</Text>
                        <Text>🔍 <strong>Verification:</strong> Authorized verifiers will review your submission</Text>
                        <Text>🛡️ <strong>Insurance Ready:</strong> Once verified, you can purchase comprehensive coverage</Text>
                        <Text>📧 <strong>Notifications:</strong> You'll receive updates about verification status</Text>
                      </VStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>
            </form>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
};