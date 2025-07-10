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
  FiTruck, 
  FiHome, 
  FiImage,
  FiShield,
  FiAward,
  FiDollarSign
} from "react-icons/fi";
import { useColorModeValue } from "@/components/ui/color-mode";

export const FeaturesSection = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("cyan.900", "cyan.100");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const features = [
    {
      icon: FiTruck,
      title: "Vehicle Insurance",
      description: "Classic cars, luxury vehicles, motorcycles, and fleet protection with AI-powered risk assessment and instant claims processing.",
      benefits: [
        "Collision & theft coverage",
        "Classic car specialists", 
        "Fleet management",
        "Usage-based premiums"
      ],
      bgColor: "rgb(34, 208, 238)",
      textColor: "rgb(8, 59, 68)",
      stat: "99.8% Claims Approved",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: FiHome, 
      title: "Property Insurance",
      description: "Residential and commercial real estate protection with comprehensive coverage and transparent pricing for all property types.",
      benefits: [
        "Fire & natural disaster",
        "Liability coverage",
        "Rental properties", 
        "Commercial buildings"
      ],
      bgColor: "rgb(6, 182, 212)",
      textColor: "rgb(8, 59, 68)",
      stat: "24/7 Coverage Active",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: FiImage,
      title: "Art & Collectibles", 
      description: "Fine art, collectibles, and luxury items with specialized coverage and expert valuation services from certified professionals.",
      benefits: [
        "Fine art protection",
        "Collectible coverage",
        "Transit insurance",
        "Authentication services"
      ],
      bgColor: "rgb(103, 232, 249)",
      textColor: "rgb(8, 59, 68)",
      stat: "Expert Valuations",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <Box as="section" py={20} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack gap={16}>
          <VStack gap={4} textAlign="center">
            <Heading 
              as="h2" 
              size="3xl" 
              color={headingColor}
              maxW="4xl"
            >
              Comprehensive Asset Protection
            </Heading>
            <Text 
              fontSize="xl" 
              color={textColor}
              maxW="2xl"
            >
              Protect what matters most with our comprehensive insurance solutions
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w="full">
            {features.map((feature, index) => (
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
                  w="352px"
                  h="352px"
                  top="384px"
                  right="96px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="352px"
                  h="352px"
                  top="0"
                  right="96px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="224px"
                  h="224px"
                  top="384px"
                  right="96px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="224px"
                  h="224px"
                  top="0"
                  right="96px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="96px"
                  h="96px"
                  top="384px"
                  right="96px"
                  transform="translate(50%, -50%)"
                />
                <Box
                  position="absolute"
                  rounded="full"
                  border="1px solid rgb(6, 182, 212)"
                  w="96px"
                  h="96px"
                  top="0"
                  right="96px"
                  transform="translate(50%, -50%)"
                />

                {/* Content */}
                <Box p={6} position="relative" zIndex={1} h="full" display="flex" flexDirection="column">
                  {/* Icon */}
                  <Box
                    w="64px"
                    h="64px"
                    rounded="xl"
                    bg="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={6}
                    shadow="lg"
                  >
                    <feature.icon size={28} color={feature.textColor} />
                  </Box>

                  {/* Image area */}
                  <Box
                    bgImage={`url(${feature.image})`}
                    bgSize="cover"
                    position="center"
                    h="200px"
                    rounded="xl"
                    mb={6}
                    shadow="md"
                  />

                  {/* Title */}
                  <Box flex={1}>
                    <Text
                      fontSize="3xl"
                      fontWeight="bold"
                      lineHeight="none"
                      color={feature.textColor}
                      letterSpacing="tight"
                      textShadow="sm"
                    >
                      {feature.title}
                    </Text>
                  </Box>
                </Box>

                {/* Hover overlay with details */}
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
                  <VStack gap={4} align="start">
                    <Heading size="lg" color="white">
                      {feature.title}
                    </Heading>
                    
                    <Text fontSize="sm" color="gray.300" lineHeight="tall">
                      {feature.description}
                    </Text>
                    
                    <VStack gap={2} align="start" w="full">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <HStack key={benefitIndex} gap={2}>
                          <Box w="4px" h="4px" bg="cyan.400" rounded="full" />
                          <Text fontSize="sm" color="cyan.200">
                            {benefit}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                    
                    <Box
                      mt={4}
                      p={3}
                      bg="whiteAlpha.200"
                      rounded="lg"
                      w="full"
                      textAlign="center"
                    >
                      <Text fontSize="sm" fontWeight="semibold" color="cyan.200">
                        {feature.stat}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          
          {/* Additional trust indicators */}
          <HStack 
            gap={12} 
            justify="center" 
            flexWrap="wrap"
            pt={8}
            opacity={0.8}
          >
            <HStack gap={2}>
              <FiShield color="currentColor" />
              <Text fontSize="sm" color={textColor}>Blockchain Secured</Text>
            </HStack>
            <HStack gap={2}>
              <FiAward color="currentColor" />
              <Text fontSize="sm" color={textColor}>A+ Rated</Text>
            </HStack>
            <HStack gap={2}>
              <FiDollarSign color="currentColor" />
              <Text fontSize="sm" color={textColor}>Fair Pricing</Text>
            </HStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};