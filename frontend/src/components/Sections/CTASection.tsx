"use client";

import { 
  Box, 
  Container, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Button,
  SimpleGrid
} from "@chakra-ui/react";
import { 
  FiArrowRight, 
  FiShield, 
  FiUsers, 
  FiTrendingUp,
  FiCheck
} from "react-icons/fi";
import Link from "next/link";
import ConnectButton from '@/components/ConnectButton';
import { useColorModeValue } from "@/components/ui/color-mode";

export const CTASection = () => {
  const bgGradient = useColorModeValue(
    "linear(to-br, cyan.25, white, cyan.25)",
    "linear(to-br, gray.900, gray.800, gray.900)"
  );
  const headingColor = useColorModeValue("cyan.900", "cyan.100");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const stats = [
    { 
      icon: FiUsers, 
      value: "10K+", 
      label: "Active Users",
      bgColor: "rgb(34, 208, 238)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60"
    },
    { 
      icon: FiShield, 
      value: "99.9%", 
      label: "Uptime",
      bgColor: "rgb(6, 182, 212)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60"
    },
    { 
      icon: FiTrendingUp, 
      value: "$50M+", 
      label: "Assets Protected",
      bgColor: "rgb(103, 232, 249)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const benefits = [
    "Instant policy creation",
    "AI-powered risk assessment", 
    "Automated claims processing",
    "Blockchain security"
  ];

  return (
    <Box
      as="section"
      py={16}
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack gap={12} textAlign="center">
          {/* Main heading */}
          <VStack gap={4}>
            <Heading 
              as="h2" 
              size="4xl" 
              color={headingColor}
              maxW="4xl"
              lineHeight="shorter"
              fontWeight="bold"
            >
              Ready to Protect Your Assets?
            </Heading>
            
            <Text 
              fontSize="xl" 
              color={textColor}
              maxW="2xl"
              lineHeight="tall"
            >
              Join thousands of users who trust our RWA Insurance Protocol to protect 
              their tokenized assets with cutting-edge AI and blockchain technology
            </Text>
          </VStack>

          {/* Stats cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="full" maxW="4xl">
            {stats.map((stat, index) => (
              <Box
                key={index}
                position="relative"
                overflow="hidden"
                rounded="3xl"
                shadow="xl"
                h="200px"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "2xl",
                }}
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                style={{
                  backgroundColor: stat.bgColor,
                }}
              >
                {/* Decorative circles */}
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="180px"
                  h="180px"
                  top="200px"
                  right="32px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="180px"
                  h="180px"
                  top="0"
                  right="32px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="100px"
                  h="100px"
                  top="200px"
                  right="32px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="100px"
                  h="100px"
                  top="0"
                  right="32px"
                  transform="translate(50%, -50%)"
                />

                {/* Content */}
                <Box p={6} position="relative" zIndex={1} h="full" display="flex" alignItems="center">
                  <VStack gap={3} w="full">
                    <Box
                      w="48px"
                      h="48px"
                      rounded="xl"
                      bg="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      shadow="lg"
                    >
                      <stat.icon size={24} color={stat.textColor} />
                    </Box>

                    <Text
                      fontSize="3xl"
                      fontWeight="bold"
                      color={stat.textColor}
                      lineHeight="none"
                    >
                      {stat.value}
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="semibold"
                      color={stat.textColor}
                      opacity={0.8}
                    >
                      {stat.label}
                    </Text>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>

          {/* Benefits and CTA section */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} w="full" maxW="5xl" alignItems="center">
            {/* Benefits card */}
            <Box
              position="relative"
              overflow="hidden"
              rounded="3xl"
              shadow="xl"
              h="300px"
              style={{
                backgroundColor: "rgb(34, 208, 238)",
              }}
            >
              {/* Decorative circles */}
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(6, 182, 212)"
                w="200px"
                h="200px"
                top="300px"
                right="24px"
                transform="translate(50%, -50%)"
              />
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(6, 182, 212)"
                w="200px"
                h="200px"
                top="0"
                right="24px"
                transform="translate(50%, -50%)"
              />
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(6, 182, 212)"
                w="120px"
                h="120px"
                top="300px"
                right="24px"
                transform="translate(50%, -50%)"
              />
              <Box
                position="absolute"
                rounded="full"
                border="1px solid rgb(6, 182, 212)"
                w="120px"
                h="120px"
                top="0"
                right="24px"
                transform="translate(50%, -50%)"
              />

              <Box p={8} position="relative" zIndex={1} h="full" display="flex" flexDirection="column" justifyContent="center">
                <VStack gap={6} align="start">
                  <Text 
                    fontSize="2xl" 
                    fontWeight="bold" 
                    color="rgb(8, 59, 68)"
                  >
                    What you get:
                  </Text>
                  <VStack gap={3} align="start" w="full">
                    {benefits.map((benefit, index) => (
                      <HStack key={index} gap={3} w="full">
                        <Box
                          w="24px"
                          h="24px"
                          rounded="full"
                          bg="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <FiCheck size={14} color="rgb(8, 59, 68)" />
                        </Box>
                        <Text color="rgb(8, 59, 68)" fontSize="md" fontWeight="medium">
                          {benefit}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </Box>
            </Box>

            {/* CTA Section */}
            <VStack gap={6} textAlign="center">
              <VStack gap={4}>
                <Heading 
                  as="h3" 
                  size="2xl" 
                  color={headingColor}
                >
                  Start Protecting Today
                </Heading>
                <Text color={textColor} fontSize="lg">
                  Get started in minutes with our AI-powered insurance platform
                </Text>
              </VStack>
              
              <VStack gap={4} w="full">
                <ConnectButton />
                <Link href="/create-policy">
                  <Button
                    bg="rgb(6, 182, 212)"
                    color="white"
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    rounded="xl"
                    w="full"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "xl",
                      bg: "rgb(34, 208, 238)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.3s"
                    shadow="lg"
                  >
                    Create First Policy
                    <FiArrowRight style={{ marginLeft: '8px' }} />
                  </Button>
                </Link>
              </VStack>

              {/* Trust indicator */}
              <Text 
                fontSize="sm" 
                color={textColor}
                opacity={0.8}
                mt={4}
              >
                🔒 Secured by blockchain • ⚡ Powered by AI • 🏆 Trusted worldwide
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};