"use client";

import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Text,
  Card,
  HStack,
  Circle
} from "@chakra-ui/react";
import { 
  FiMessageCircle, 
  FiZap, 
  FiCpu,
  FiHeadphones
} from "react-icons/fi";
import { InsuranceChatbot } from '@/components/insurance/InsuranceChatbot';
import { useColorModeValue } from "@/components/ui/color-mode";

export const ChatbotSection = () => {
  const bgColor = useColorModeValue("cyan.25", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("cyan.900", "cyan.100");
  const textColor = useColorModeValue("cyan.700", "cyan.200");
  const cardBorderColor = useColorModeValue("cyan.100", "cyan.800");

  const chatFeatures = [
    {
      icon: FiZap,
      title: "Instant Responses",
      description: "Get answers in seconds"
    },
    {
      icon: FiCpu,
      title: "AI-Powered",
      description: "Smart contextual understanding"
    },
    {
      icon: FiHeadphones,
      title: "24/7 Available",
      description: "Always here to help"
    }
  ];

  return (
    <Box as="section" py={20} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack gap={16}>
          <VStack gap={6} textAlign="center">
            <Circle
              size="80px"
              bg="cyan.500"
              color="white"
              shadow="xl"
              mb={4}
            >
              <FiMessageCircle size={32} />
            </Circle>
            
            <Heading 
              as="h2" 
              size="3xl" 
              color={headingColor}
            >
              Chat with Our AI Assistant
            </Heading>
            
            <Text 
              fontSize="xl" 
              color={textColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Get instant help with policy creation, claims processing, and coverage questions. 
              Our AI assistant is trained on insurance expertise and blockchain technology.
            </Text>
            
            {/* Feature highlights */}
            <HStack 
              gap={8} 
              justify="center" 
              flexWrap="wrap" 
              pt={6}
            >
              {chatFeatures.map((feature, index) => (
                <Card.Root
                  key={index}
                  bg={cardBg}
                  shadow="md"
                  rounded="2xl"
                  border="1px"
                  borderColor={cardBorderColor}
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                  transition="all 0.2s"
                >
                  <Card.Body p={6} textAlign="center">
                    <VStack gap={3}>
                      <Circle
                        size="48px"
                        bg="cyan.100"
                        color="cyan.600"
                      >
                        <feature.icon size={20} />
                      </Circle>
                      <VStack gap={1}>
                        <Text 
                          fontWeight="semibold" 
                          color={headingColor}
                          fontSize="sm"
                        >
                          {feature.title}
                        </Text>
                        <Text 
                          fontSize="xs" 
                          color={textColor}
                          opacity={0.8}
                        >
                          {feature.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </HStack>
          </VStack>
          
          {/* Chatbot container with enhanced styling */}
          <Box
            w="full"
            maxW="5xl"
            mx="auto"
            position="relative"
            overflow="hidden"
            rounded="3xl"
            shadow="2xl"
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
              top="100%"
              right="48px"
              transform="translate(50%, -50%)"
              opacity={0.3}
            />
            <Box
              position="absolute"
              rounded="full"
              border="1px solid rgb(34, 208, 238)"
              w="400px"
              h="400px"
              top="0"
              right="48px"
              transform="translate(50%, -50%)"
              opacity={0.3}
            />
            <Box
              position="absolute"
              rounded="full"
              border="1px solid rgb(34, 208, 238)"
              w="240px"
              h="240px"
              top="100%"
              right="48px"
              transform="translate(50%, -50%)"
              opacity={0.4}
            />
            <Box
              position="absolute"
              rounded="full"
              border="1px solid rgb(34, 208, 238)"
              w="240px"
              h="240px"
              top="0"
              right="48px"
              transform="translate(50%, -50%)"
              opacity={0.4}
            />
            <Box
              position="absolute"
              rounded="full"
              border="1px solid rgb(34, 208, 238)"
              w="120px"
              h="120px"
              top="100%"
              left="48px"
              transform="translate(-50%, -50%)"
              opacity={0.2}
            />
            <Box
              position="absolute"
              rounded="full"
              border="1px solid rgb(34, 208, 238)"
              w="120px"
              h="120px"
              top="0"
              left="48px"
              transform="translate(-50%, -50%)"
              opacity={0.2}
            />

            {/* Content wrapper */}
            <Box
              position="relative"
              zIndex={1}
              bg="white"
              m={4}
              rounded="2xl"
              shadow="xl"
              overflow="hidden"
            >
              <InsuranceChatbot />
            </Box>
          </Box>
          
          {/* Additional info */}
          <Text 
            fontSize="sm" 
            color={textColor}
            textAlign="center"
            opacity={0.8}
          >
            💡 Try asking: "How do I create a policy?" or "What's covered under vehicle insurance?"
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};