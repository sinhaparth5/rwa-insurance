// @TODO Need to fix this file

"use client";

import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  Heading,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { useState } from "react";
import { useAssetRegistry } from "@/hooks/useContracts";
import { useWallet } from "@/hooks/useWallet";

export const RegisterAsset = () => {
  const { address, isConnected } = useWallet();
  const { registerAsset, isLoading } = useAssetRegistry();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    assetType: "",
    description: "",
    estimatedValue: "",
    documentHash: "",
    metadataURI: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        status: "error",
        duration: 5000,
        isClosable: true,
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
      
      toast({
        title: "Asset Registered Successfully!",
        description: "Your asset has been added to the registry",
        status: "success",
        duration: 5000,
        isClosable: true,
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
      toast({
        title: "Registration Failed",
        description: error?.message || "Failed to register asset",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!isConnected) {
    return (
      <Card.Root>
        <Card.Body>
          <Alert status="warning">
            <AlertIcon />
            Please connect your wallet to register assets
          </Alert>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">Register New Asset</Heading>
        <Text color="gray.600">Add your real-world asset to the registry</Text>
      </Card.Header>
      
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <VStack gap={4}>
            <FormControl isRequired>
              <FormLabel>Asset Type</FormLabel>
              <Select
                value={formData.assetType}
                onChange={(e) => setFormData({...formData, assetType: e.target.value})}
                placeholder="Select asset type"
              >
                <option value="real_estate">Real Estate</option>
                <option value="vehicle">Vehicle</option>
                <option value="artwork">Artwork</option>
                <option value="jewelry">Jewelry</option>
                <option value="electronics">Electronics</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your asset in detail..."
                rows={3}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Estimated Value (BDAG)</FormLabel>
              <Input
                type="number"
                step="0.001"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                placeholder="0.000"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Document Hash (IPFS)</FormLabel>
              <Input
                value={formData.documentHash}
                onChange={(e) => setFormData({...formData, documentHash: e.target.value})}
                placeholder="QmXxx... (optional)"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Metadata URI</FormLabel>
              <Input
                value={formData.metadataURI}
                onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
                placeholder="https://... (optional)"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="cyan"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Registering Asset..."
              isDisabled={!formData.assetType || !formData.description || !formData.estimatedValue}
            >
              Register Asset
            </Button>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
};
