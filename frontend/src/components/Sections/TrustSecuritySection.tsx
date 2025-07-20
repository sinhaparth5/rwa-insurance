"use client";

import { 
  Box, 
  Container, 
  SimpleGrid, 
  VStack, 
  Heading, 
  Text, 
  HStack
} from "@chakra-ui/react";
import { 
  FiShield, 
  FiClock, 
  FiLayers, 
  FiZap,
  FiCheck,
  FiStar
} from "react-icons/fi";
import { useColorModeValue } from "@/components/ui/color-mode";

export const TrustSecuritySection = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("cyan.900", "cyan.100");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const trustFeatures = [
    {
      icon: FiShield,
      title: "Blockchain Security",
      description: "Immutable smart contracts ensure transparent and secure policy management with military-grade encryption.",
      stat: "99.99%",
      statLabel: "Uptime",
      bgColor: "rgb(34, 208, 238)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: FiClock,
      title: "Verified Claims", 
      description: "Oracle-based verification ensures legitimate claims are processed quickly with automated validation systems.",
      stat: "< 2 hrs",
      statLabel: "Avg. Processing",
      bgColor: "rgb(6, 182, 212)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: FiLayers,
      title: "Transparent Pricing",
      description: "AI-calculated premiums with clear breakdown of all factors and fees. No hidden costs or surprise charges.",
      stat: "100%",
      statLabel: "Transparency",
      bgColor: "rgb(103, 232, 249)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: FiZap,
      title: "Instant Payouts",
      description: "Automated claims processing with immediate stablecoin payouts directly to your wallet upon approval.",
      stat: "< 5 min",
      statLabel: "Payout Time",
      bgColor: "rgb(14, 165, 233)",
      textColor: "rgb(8, 59, 68)",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const trustBadges = [
    { icon: FiCheck, text: "Licensed & Regulated" },
    { icon: FiStar, text: "A+ Security Rating" },
    { icon: FiShield, text: "ISO 27001 Certified" }
  ];

  return (
    <Box as="section" py={20} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack gap={16}>
          <VStack gap={6} textAlign="center">
            <Heading 
              as="h2" 
              size="4xl" 
              color={headingColor}
              maxW="4xl"
            >
              Built on Trust & Security
            </Heading>
            <Text 
              fontSize="2xl" 
              color={textColor}
              maxW="3xl"
              fontWeight="medium"
            >
              Enterprise-grade security meets cutting-edge blockchain technology
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={8} w="full">
            {trustFeatures.map((feature, index) => (
              <Box
                key={index}
                position="relative"
                overflow="hidden"
                rounded="3xl"
                shadow="xl"
                h="400px"
                _hover={{
                  transform: "translateY(-8px)",
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
                  w="320px"
                  h="320px"
                  top="400px"
                  right="48px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="320px"
                  h="320px"
                  top="0"
                  right="48px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="200px"
                  h="200px"
                  top="400px"
                  right="48px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="200px"
                  h="200px"
                  top="0"
                  right="48px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="80px"
                  h="80px"
                  top="400px"
                  right="48px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="80px"
                  h="80px"
                  top="0"
                  right="48px"
                  transform="translate(50%, -50%)"
                />

                {/* Content */}
                <Box p={6} position="relative" zIndex={1} h="full" display="flex" flexDirection="column">
                  {/* Icon and Stats */}
                  <VStack gap={4} mb={6}>
                    <Box
                      w="64px"
                      h="64px"
                      rounded="xl"
                      bg="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      shadow="lg"
                    >
                      <feature.icon size={28} color={feature.textColor} />
                    </Box>
                    
                    {/* Stat display */}
                    <VStack gap={1}>
                      <Text 
                        fontSize="3xl" 
                        fontWeight="bold" 
                        color={feature.textColor}
                        lineHeight="none"
                      >
                        {feature.stat}
                      </Text>
                      <Text 
                        fontSize="sm" 
                        color={feature.textColor}
                        opacity={0.8}
                        fontWeight="medium"
                      >
                        {feature.statLabel}
                      </Text>
                    </VStack>
                  </VStack>

                  {/* Image area */}
                  <Box
                    bgImage={`url(${feature.image})`}
                    bgSize="cover"
                    position="center"
                    h="160px"
                    rounded="xl"
                    mb={6}
                    shadow="md"
                  />

                  {/* Title */}
                  <Box flex={1} display="flex" alignItems="end">
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={feature.textColor}
                      lineHeight="tight"
                    >
                      {feature.title}
                    </Text>
                  </Box>
                </Box>

                {/* Hover overlay with description */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="blackAlpha.900"
                  color="white"
                  p={6}
                  opacity={0}
                  _hover={{ opacity: 1 }}
                  transition="opacity 0.3s"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  zIndex={10}
                >
                  <VStack gap={4} textAlign="center">
                    <feature.icon size={40} color="cyan.400" />
                    <Heading size="lg" color="white">
                      {feature.title}
                    </Heading>
                    <Text fontSize="md" color="gray.300" lineHeight="tall">
                      {feature.description}
                    </Text>
                    <Box
                      mt={4}
                      p={3}
                      bg="whiteAlpha.200"
                      rounded="lg"
                      w="full"
                      textAlign="center"
                    >
                      <Text fontSize="lg" fontWeight="bold" color="cyan.200">
                        {feature.stat} {feature.statLabel}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          
          {/* Trust badges */}
          <VStack gap={8} pt={8}>
            <Text 
              fontSize="lg" 
              color={textColor}
              opacity={0.8}
              textAlign="center"
              fontWeight="medium"
            >
              Trusted by thousands of users worldwide
            </Text>
            
            <HStack 
              gap={8} 
              justify="center" 
              flexWrap="wrap"
            >
              {trustBadges.map((badge, index) => (
                <Box
                  key={index}
                  position="relative"
                  overflow="hidden"
                  rounded="2xl"
                  shadow="lg"
                  _hover={{
                    transform: "translateY(-4px)",
                    shadow: "xl",
                  }}
                  transition="all 0.3s"
                  style={{
                    backgroundColor: "rgb(103, 232, 249)",
                  }}
                >
                  <Box p={4} position="relative" zIndex={1}>
                    <HStack gap={3}>
                      <Box
                        w="32px"
                        h="32px"
                        rounded="lg"
                        bg="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <badge.icon size={16} color="rgb(8, 59, 68)" />
                      </Box>
                      <Text 
                        fontSize="md" 
                        color="rgb(8, 59, 68)"
                        fontWeight="bold"
                      >
                        {badge.text}
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};