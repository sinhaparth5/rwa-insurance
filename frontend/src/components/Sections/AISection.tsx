"use client";

import { 
  Box, 
  Container, 
  SimpleGrid, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Button,
  Input,
  Field
} from "@chakra-ui/react";
import { 
  FiCheckCircle, 
  FiCpu, 
  FiShield, 
  FiZap,
  FiTrendingUp,
  FiEye
} from "react-icons/fi";
import { useColorModeValue } from "@/components/ui/color-mode";

export const AISection = () => {
  const bgGradient = useColorModeValue(
    "linear(to-br, cyan.25, white, cyan.25)",
    "linear(to-br, gray.900, gray.800, gray.900)"
  );
  const headingColor = useColorModeValue("cyan.900", "cyan.100");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const aiFeatures = [
    {
      icon: FiTrendingUp,
      title: "Real-time Data Analysis",
      description: "Continuous monitoring of market conditions, weather patterns, and risk factors with instant adjustments.",
      bgColor: "rgb(34, 208, 238)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: FiCpu,
      title: "Predictive Modeling", 
      description: "Advanced algorithms predict potential risks and adjust premiums dynamically for optimal protection.",
      bgColor: "rgb(6, 182, 212)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: FiEye,
      title: "Fraud Prevention",
      description: "AI detects suspicious patterns and prevents fraudulent claims automatically with 99.9% accuracy.",
      bgColor: "rgb(103, 232, 249)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <Box as="section" py={20} bgGradient={bgGradient}>
      <Container maxW="container.xl">
        <VStack gap={16}>
          <VStack gap={4} textAlign="center">
            <Heading 
              as="h2" 
              size="4xl" 
              color={headingColor}
              maxW="4xl"
            >
              AI-Powered Intelligence
            </Heading>
            <Text 
              fontSize="2xl" 
              color={textColor}
              maxW="2xl"
              fontWeight="medium"
            >
              Experience the future of insurance with cutting-edge AI technology
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={16} w="full" alignItems="start">
            {/* Left side - AI Features */}
            <VStack gap={8} align="start">
              <VStack gap={6} align="start">
                <Heading 
                  as="h3" 
                  size="2xl" 
                  color={headingColor}
                >
                  Smart Risk Assessment
                </Heading>
                <Text color={textColor} fontSize="xl" lineHeight="tall">
                  Our AI analyzes thousands of data points to provide the most accurate risk assessment and fair pricing.
                </Text>
              </VStack>
              
              <VStack gap={6} align="start" w="full">
                {aiFeatures.map((feature, index) => (
                  <Box
                    key={index}
                    position="relative"
                    overflow="hidden"
                    rounded="3xl"
                    shadow="xl"
                    h="140px"
                    w="full"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "2xl",
                    }}
                    transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    style={{
                      backgroundColor: feature.bgColor,
                    }}
                  >
                    {/* Decorative circles */}
                    <Box
                      position="absolute"
                      rounded="full"
                      border="1px solid rgb(6, 182, 212)"
                      w="200px"
                      h="200px"
                      top="140px"
                      right="32px"
                      transform="translate(50%, -50%)"
                    />
                    <Box
                      position="absolute"
                      rounded="full"
                      border="1px solid rgb(6, 182, 212)"
                      w="200px"
                      h="200px"
                      top="0"
                      right="32px"
                      transform="translate(50%, -50%)"
                    />
                    <Box
                      position="absolute"
                      rounded="full"
                      border="1px solid rgb(6, 182, 212)"
                      w="120px"
                      h="120px"
                      top="140px"
                      right="32px"
                      transform="translate(50%, -50%)"
                    />
                    <Box
                      position="absolute"
                      rounded="full"
                      border="1px solid rgb(6, 182, 212)"
                      w="120px"
                      h="120px"
                      top="0"
                      right="32px"
                      transform="translate(50%, -50%)"
                    />

                    {/* Content */}
                    <Box p={6} position="relative" zIndex={1} h="full" display="flex" alignItems="center">
                      <HStack gap={4} w="full">
                        <Box
                          w="48px"
                          h="48px"
                          rounded="2xl"
                          bg="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          shadow="lg"
                          flexShrink={0}
                        >
                          <feature.icon size={24} color={feature.textColor} />
                        </Box>
                        
                        <VStack align="start" flex={1} gap={1}>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={feature.textColor}
                            lineHeight="tight"
                          >
                            {feature.title}
                          </Text>
                          <Text
                            fontSize="sm"
                            color={feature.textColor}
                            opacity={0.8}
                            lineHeight="snug"
                          >
                            {feature.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </Box>
                ))}
              </VStack>
            </VStack>
            
            {/* Right side - Quote Form */}
            <Box
              position="relative"
              overflow="hidden"
              rounded="3xl"
              shadow="2xl"
              h="700px"
              style={{
                backgroundColor: "rgb(6, 182, 212)",
              }}
            >
              {/* Decorative circles */}
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(34, 208, 238)"
                w="400px"
                h="400px"
                top="700px"
                right="96px"
                transform="translate(50%, -50%)"
              />
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(34, 208, 238)"
                w="400px"
                h="400px"
                top="0"
                right="96px"
                transform="translate(50%, -50%)"
              />
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(34, 208, 238)"
                w="240px"
                h="240px"
                top="700px"
                right="96px"
                transform="translate(50%, -50%)"
              />
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(34, 208, 238)"
                w="240px"
                h="240px"
                top="0"
                right="96px"
                transform="translate(50%, -50%)"
              />

              {/* Content */}
              <Box p={8} position="relative" zIndex={1} h="full" display="flex" flexDirection="column">
                <VStack gap={6} mb={8}>
                  <Box
                    w="80px"
                    h="80px"
                    rounded="xl"
                    bg="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    shadow="lg"
                  >
                    <FiZap size={32} color="rgb(8, 59, 68)" />
                  </Box>
                  
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    color="rgb(8, 59, 68)"
                    textAlign="center"
                    lineHeight="tight"
                  >
                    Get Instant Quote
                  </Text>
                  
                  <Text 
                    color="rgb(8, 59, 68)"
                    textAlign="center"
                    fontSize="lg"
                    opacity={0.8}
                  >
                    AI-powered instant quotes in seconds
                  </Text>
                </VStack>
                
                <VStack gap={6} w="full" flex={1}>
                  <Field.Root>
                    <Field.Label 
                      color="rgb(8, 59, 68)" 
                      fontSize="md"
                      fontWeight="bold"
                    >
                      Asset Type
                    </Field.Label>
                    <Input
                      placeholder="e.g., 1965 Aston Martin DB5"
                      size="lg"
                      rounded="xl"
                      border="2px"
                      borderColor="white"
                      bg="white"
                      color="gray.800"
                      px={4}
                      py={3}
                      _focus={{ 
                        borderColor: "rgb(34, 208, 238)",
                        shadow: "0 0 0 1px rgb(34, 208, 238)"
                      }}
                      _placeholder={{ color: "gray.500" }}
                    />
                  </Field.Root>
                  
                  <Field.Root>
                    <Field.Label 
                      color="rgb(8, 59, 68)" 
                      fontSize="md"
                      fontWeight="bold"
                    >
                      Estimated Value
                    </Field.Label>
                    <Input
                      placeholder="e.g., £50,000"
                      size="lg"
                      rounded="xl"
                      border="2px"
                      borderColor="white"
                      bg="white"
                      color="gray.800"
                      px={4}
                      py={3}
                      _focus={{ 
                        borderColor: "rgb(34, 208, 238)",
                        shadow: "0 0 0 1px rgb(34, 208, 238)"
                      }}
                      _placeholder={{ color: "gray.500" }}
                    />
                  </Field.Root>
                  
                  <Field.Root>
                    <Field.Label 
                      color="rgb(8, 59, 68)" 
                      fontSize="md"
                      fontWeight="bold"
                    >
                      Location
                    </Field.Label>
                    <Input
                      placeholder="e.g., London, UK"
                      size="lg"
                      rounded="xl"
                      border="2px"
                      borderColor="white"
                      bg="white"
                      color="gray.800"
                      px={4}
                      py={3}
                      _focus={{ 
                        borderColor: "rgb(34, 208, 238)",
                        shadow: "0 0 0 1px rgb(34, 208, 238)"
                      }}
                      _placeholder={{ color: "gray.500" }}
                    />
                  </Field.Root>
                  
                  <Button
                    bg="white"
                    color="rgb(8, 59, 68)"
                    size="lg"
                    w="full"
                    mt={6}
                    rounded="xl"
                    fontWeight="bold"
                    fontSize="lg"
                    h="56px"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "xl",
                      bg: "gray.50",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                  >
                    <FiCheckCircle style={{ marginRight: '8px' }} />
                    Get AI Quote
                  </Button>
                  
                  <Text 
                    fontSize="sm" 
                    color="rgb(8, 59, 68)"
                    textAlign="center"
                    opacity={0.7}
                    mt={4}
                  >
                    ✓ No commitment required • ✓ Instant results
                  </Text>
                </VStack>
              </Box>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};