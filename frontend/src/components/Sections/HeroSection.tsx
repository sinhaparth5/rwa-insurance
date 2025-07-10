"use client";

import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Circle,
    Card
} from "@chakra-ui/react";
import { 
  FiArrowRight, 
  FiPlay, 
  FiShield, 
  FiZap, 
  FiCpu 
} from "react-icons/fi";
import { useColorModeValue } from "@/components/ui/color-mode"
import Link from "next/link";
import ConnectButton from "../ConnectButton";
import { GradientText } from "../animate-ui/text/gradient";

export const HeroSection = () => {
    const bgGradient = useColorModeValue(
        "linear(to-br, cyan.50, cyan.100, white, cyan.50)",
        "linear(to-br, cyan.900, gray.900, gray.800, cyan.800)"
    );

    const textColor = useColorModeValue("cyan.900", "cyan.50");
    const subtitleColor = useColorModeValue("gray.600", "gray.300");
    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorderColor = useColorModeValue("cyan.200", "cyan.700");
    const featureBorderColor = useColorModeValue("cyan.100", "cyan.800");
    const buttonHoverBg = useColorModeValue("cyan.50", "cyan.900");
    const buttonTextColor = useColorModeValue("cyan.700", "cyan.300");
    const badgeTextColor = useColorModeValue("gray.700", "gray.300");

    const features = [
        { icon: FiShield, text: "Blockchain Secured" },
        { icon: FiCpu, text: "AI-Powered" },
        { icon: FiZap, text: "Instant Claims" }
    ];

    return (
        <Box
            as="section"
            minH="90vh"
            bgGradient={bgGradient}
            display="flex"
            alignItems="center"
            py={16}
            pt={24}
            position="relative"
            overflow="hidden"
        >
            {/* Background decorative elements */}
            <Box
                position="absolute"
                top="10%"
                right="5%"
                width="300px"
                height="300px"
                bg="cyan.400"
                opacity={0.3}
                rounded="full"
                filter="blur(100px)"
                animation="float 8s ease-in-out infinite"
                zIndex={0}
            />
            <Box
                position="absolute"
                bottom="20%"
                left="10%"
                width="200px"
                height="200px"
                bg="cyan.500"
                opacity={0.4}
                rounded="full"
                filter="blur(80px)"
                animation="float 6s ease-in-out infinite reverse"
                zIndex={0}
            />

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
                <Circle
                    key={i}
                    position="absolute"
                    size={`${6 + (i % 3) * 3}px`}
                    bg="cyan.400"
                    opacity={0.6}
                    top={`${15 + i * 10}%`}
                    left={`${10 + i * 12}%`}
                    animation={`float ${4 + i}s ease-in-out infinite`}
                    animationDelay={`${i * 0.7}s`}
                    zIndex={1}
                />
            ))}

            <Container maxW="container.xl" position="relative" zIndex={2}>
                <VStack gap={8} textAlign="center">
                    {/* Badge */}
                    <Card.Root
                        bg={cardBg}
                        shadow="lg"
                        rounded="full"
                        border="1px"
                        borderColor={cardBorderColor}
                        _hover={{
                            transform: "translateY(-2px)",
                            shadow: "xl",
                        }}
                        transition="all 0.3s"
                    >
                        <Card.Body px={6} py={3}>
                            <HStack gap={2}>
                                <Circle size="8px" bg="green.400" />
                                <Text 
                                    fontSize="sm" 
                                    fontWeight="medium"
                                    color={badgeTextColor}
                                >
                                    🚀 Now Live on BlockDAG Mainnet
                                </Text>
                            </HStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Main heading */}
                    <VStack gap={4}>
                        <Heading 
                            as="h1"
                            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                            color={textColor}
                            maxW="6xl"
                            lineHeight="shorter"
                            fontWeight="bold"
                        >
                            <GradientText text="AI-Powered RWA Insurance Protocol" />
                        </Heading>
                        
                        <Text
                            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                            color={subtitleColor}
                            maxW="4xl"
                            lineHeight="tall"
                            fontWeight="medium"
                        >
                            Revolutionary insurance platform for tokenized real-world assets. 
                            Protect your vehicles, properties, and art with AI risk assessment, 
                            smart contracts, and automated claims.
                        </Text>
                    </VStack>

                    {/* Feature highlights */}
                    <HStack 
                        gap={4} 
                        justify="center" 
                        flexWrap="wrap"
                    >
                        {features.map((feature, index) => (
                            <Card.Root
                                key={index}
                                bg={cardBg}
                                shadow="md"
                                rounded="2xl"
                                border="1px"
                                borderColor={featureBorderColor}
                                _hover={{
                                    transform: "translateY(-4px)",
                                    shadow: "lg",
                                }}
                                transition="all 0.3s"
                            >
                                <Card.Body p={4}>
                                    <HStack gap={3}>
                                        <Circle
                                            size="32px"
                                            bg="cyan.100"
                                            color="cyan.600"
                                        >
                                            <feature.icon size={16} />
                                        </Circle>
                                        <Text 
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color={textColor}
                                        >
                                            {feature.text}
                                        </Text>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </HStack>

                    {/* CTA Buttons */}
                    <HStack 
                        gap={6} 
                        flexWrap="wrap" 
                        justify="center"
                        pt={2}
                    >
                        <ConnectButton />
                        
                        <Link href="/features">
                            <Button
                                variant="outline"
                                size="lg"
                                px={8}
                                py={7}
                                fontSize="lg"
                                fontWeight="semibold"
                                border="2px"
                                borderColor="cyan.400"
                                color={buttonTextColor}
                                bg="transparent"
                                rounded="2xl"
                                _hover={{
                                    bg: buttonHoverBg,
                                    borderColor: "cyan.500",
                                    transform: "translateY(-2px)",
                                    shadow: "lg",
                                }}
                                _active={{
                                    transform: "translateY(0)",
                                }}
                                transition="all 0.3s"
                            >
                                Explore Features
                                <FiPlay style={{ marginLeft: '8px' }} />
                            </Button>
                        </Link>
                    </HStack>

                    {/* Trust indicators */}
                    <VStack gap={3} pt={4}>
                        <Text 
                            fontSize="sm" 
                            color={subtitleColor}
                            opacity={0.8}
                        >
                            Trusted by 10,000+ users worldwide
                        </Text>
                        
                        <HStack gap={8} opacity={0.6}>
                            <Text fontSize="xs" color={subtitleColor}>
                                🔒 Audited Smart Contracts
                            </Text>
                            <Text fontSize="xs" color={subtitleColor}>
                                🛡️ $50M+ Assets Protected
                            </Text>
                            <Text fontSize="xs" color={subtitleColor}>
                                ⚡ 99.9% Uptime
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>
            </Container>

            {/* CSS animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>
        </Box>
    )
};