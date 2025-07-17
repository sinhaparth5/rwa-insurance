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
  createListCollection
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { useAssetRegistry } from "@/hooks/useContracts";
import { useWallet } from "@/hooks/useWallet";

export const RegisterAsset = () => {
  const { address, isConnected } = useWallet();
  const { registerAsset, isLoading } = useAssetRegistry();
  
  const [formData, setFormData] = useState({
    assetType: "",
    description: "",
    estimatedValue: "",
    documentHash: "",
    metadataURI: ""
  });

  // Create collection for Chakra UI v3 Select
  const assetTypes = createListCollection({
    items: [
      { value: "real_estate", label: "Real Estate" },
      { value: "vehicle", label: "Vehicle" },
      { value: "artwork", label: "Artwork" },
      { value: "jewelry", label: "Jewelry" },
      { value: "electronics", label: "Electronics" }
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

    try {
      await registerAsset(
        formData.assetType,
        formData.description,
        formData.estimatedValue,
        formData.documentHash,
        formData.metadataURI
      );
      
      toaster.create({
        title: "Asset Registered Successfully!",
        description: "Your asset has been added to the registry",
        type: "success",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        assetType: "",
        description: "",
        estimatedValue: "",
        documentHash: "",
        metadataURI: ""
      });
    } catch (error: any) {
      toaster.create({
        title: "Registration Failed",
        description: error?.message || "Failed to register asset",
        type: "error",
        duration: 5000,
      });
    }
  };

  if (!isConnected) {
    return (
      <Box>
        <Heading size="lg" mb={6}>Register New Asset</Heading>
        <Card.Root>
          <Card.Body>
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Alert.Title>Please connect your wallet to register assets</Alert.Title>
            </Alert.Root>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>Register New Asset</Heading>
      
      <Card.Root maxW="2xl">
        <Card.Header>
          <VStack align="start" gap={2}>
            <Heading size="md">Add Your Real-World Asset</Heading>
            <Text color="gray.600">
              Register your asset to make it eligible for blockchain insurance coverage
            </Text>
          </VStack>
        </Card.Header>
        
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <VStack gap={6} align="stretch">
              
              {/* Asset Type */}
              <Field label="Asset Type" required>
                <Select.Root
                  collection={assetTypes}
                  value={formData.assetType ? [formData.assetType] : []}
                  onValueChange={(e) => setFormData({ ...formData, assetType: e.value[0] || "" })}
                  size="md"
                >
                  <Select.Label>Asset Type</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select asset type" />
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
              <Field label="Description" required>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide a detailed description of your asset..."
                  rows={4}
                  resize="vertical"
                />
              </Field>

              {/* Estimated Value */}
              <Field label="Estimated Value" required>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                  placeholder="0.000"
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Value in BDAG tokens
                </Text>
              </Field>

              {/* Document Hash */}
              <Field label="Document Hash (IPFS)" helperText="Upload supporting documents to IPFS and provide the hash">
                <Input
                  value={formData.documentHash}
                  onChange={(e) => setFormData({...formData, documentHash: e.target.value})}
                  placeholder="QmXxx... (optional)"
                />
              </Field>

              {/* Metadata URI */}
              <Field label="Metadata URI" helperText="Additional metadata or external link">
                <Input
                  value={formData.metadataURI}
                  onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
                  placeholder="https://... (optional)"
                />
              </Field>

              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="cyan"
                size="lg"
                loading={isLoading}
                loadingText="Registering Asset..."
                disabled={!formData.assetType || !formData.description || !formData.estimatedValue}
              >
                Register Asset
              </Button>

              {/* Info Card */}
              <Card.Root bg="cyan.50" borderColor="cyan.200">
                <Card.Body>
                  <VStack align="start" gap={3}>
                    <HStack>
                      <Badge colorScheme="cyan">Info</Badge>
                      <Text fontWeight="semibold" fontSize="sm">What happens next?</Text>
                    </HStack>
                    <VStack align="start" gap={1} fontSize="sm" color="gray.700">
                      <Text>• Your asset will be submitted for verification</Text>
                      <Text>• Authorized verifiers will review your submission</Text>
                      <Text>• Once verified, you can purchase insurance coverage</Text>
                      <Text>• You'll receive notifications about the verification status</Text>
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};