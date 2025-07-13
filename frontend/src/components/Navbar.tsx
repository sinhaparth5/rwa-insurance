"use client";

import { 
  Box, 
  Flex, 
  Button, 
  HStack, 
  IconButton,
  VStack,
  Text
} from "@chakra-ui/react";
import { Drawer } from "@chakra-ui/react";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Image } from "@chakra-ui/react";

const Navbar: FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const activeColor = useColorModeValue("cyan.600", "cyan.400");
  const hoverBg = useColorModeValue("cyan.50", "cyan.900");

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }
  ];

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Box
        as="nav"
        position="fixed"
        top="16px"
        left="50%"
        transform="translateX(-50%)"
        width={{ base: "95%", md: "90%" }}
        maxWidth="1200px"
        rounded="3xl"
        shadow="2xl"
        border="1px"
        borderColor={useColorModeValue("cyan.100", "cyan.800")}
        py={{ base: 3, md: 4 }}
        px={{ base: 4, md: 6 }}
        zIndex={1000}
        backdropFilter="blur(20px)"
        overflow="hidden"
        style={{
          backgroundColor: useColorModeValue("rgba(255, 255, 255, 0.95)", "rgba(31, 41, 55, 0.95)"),
        }}
      >
        {/* Decorative circles */}
        <Box
          position="absolute"
          rounded="full"
          border="1px solid"
          borderColor={useColorModeValue("cyan.200", "cyan.700")}
          w="200px"
          h="200px"
          top="100px"
          right="24px"
          transform="translate(50%, -50%)"
          opacity={0.3}
        />
        <Box
          position="absolute"
          rounded="full"
          border="1px solid"
          borderColor={useColorModeValue("cyan.200", "cyan.700")}
          w="120px"
          h="120px"
          top="0"
          right="24px"
          transform="translate(50%, -50%)"
          opacity={0.3}
        />
        <Box
          position="absolute"
          rounded="full"
          border="1px solid"
          borderColor={useColorModeValue("cyan.200", "cyan.700")}
          w="80px"
          h="80px"
          top="100px"
          left="24px"
          transform="translate(-50%, -50%)"
          opacity={0.2}
        />

        <Flex align="center" justify="space-between" position="relative" zIndex={1}>
          {/* Logo */}
          <Box>
            <Link href="/">
              <span className="flex items-center flex-column">
                <Image
                  src="/logo.png"
                  alt="InsureGenie Logo"
                  height="40px"
                />
                <Text
                  fontWeight="bold" 
                  fontSize={{ base: "lg", md: "xl" }}
                  color={useColorModeValue("cyan.900", "cyan.100")}
                  _hover={{ color: activeColor }}
                  transition="color 0.2s"
                >
                InsureGenie
                </Text>
              </span>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <HStack gap={1} display={{ base: "none", md: "flex" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link href={item.href} key={item.name}>
                  <Button
                    variant="ghost"
                    size="md"
                    px={6}
                    py={2}
                    rounded="2xl"
                    fontWeight="medium"
                    fontSize="md"
                    color={isActive ? activeColor : textColor}
                    bg={isActive ? hoverBg : "transparent"}
                    _hover={{
                      bg: hoverBg,
                      color: activeColor,
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                    _after={isActive ? {
                      content: '""',
                      position: "absolute",
                      bottom: "6px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "6px",
                      height: "6px",
                      bg: "cyan.500",
                      rounded: "full",
                    } : {}}
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Open menu"
            onClick={onOpen}
            variant="ghost"
            size="md"
            color={textColor}
            rounded="xl"
            _hover={{
              bg: hoverBg,
              color: activeColor,
            }}
          >
            <HiMenu />
          </IconButton>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)} placement="end" size="xs">
        <Drawer.Backdrop backdropFilter="blur(8px)" />
        <Drawer.Positioner>
          <Drawer.Content
            bg={bgColor}
            rounded="3xl"
            m={4}
            maxH="calc(100vh - 32px)"
            overflow="hidden"
            style={{
              backgroundColor: useColorModeValue("rgba(255, 255, 255, 0.98)", "rgba(31, 41, 55, 0.98)"),
            }}
          >
            {/* Decorative circles for mobile drawer */}
            <Box
              position="absolute"
              rounded="full"
              border="1px solid"
              borderColor={useColorModeValue("cyan.200", "cyan.700")}
              w="150px"
              h="150px"
              top="0"
              right="0"
              transform="translate(50%, -50%)"
              opacity={0.2}
            />
            <Box
              position="absolute"
              rounded="full"
              border="1px solid"
              borderColor={useColorModeValue("cyan.200", "cyan.700")}
              w="100px"
              h="100px"
              bottom="0"
              left="0"
              transform="translate(-50%, 50%)"
              opacity={0.2}
            />

            <Drawer.Header 
              pb={0}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              zIndex={1}
            >
              <Drawer.Title>
                <Text
                  fontWeight="bold" 
                  fontSize="xl" 
                  color={useColorModeValue("cyan.900", "cyan.100")}
                >
                  MyApp
                </Text>
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <IconButton
                  aria-label="Close menu"
                  variant="ghost"
                  size="sm"
                  rounded="xl"
                  _hover={{
                    bg: hoverBg,
                    color: activeColor,
                  }}
                >
                  <HiX />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>
            
            <Drawer.Body pt={8} zIndex={1}>
              <VStack gap={2} align="stretch">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link href={item.href} key={item.name} onClick={onClose}>
                      <Button
                        variant="ghost"
                        size="lg"
                        justifyContent="flex-start"
                        w="full"
                        rounded="2xl"
                        fontWeight="medium"
                        fontSize="lg"
                        py={6}
                        color={isActive ? activeColor : textColor}
                        bg={isActive ? hoverBg : "transparent"}
                        _hover={{
                          bg: hoverBg,
                          color: activeColor,
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        _before={isActive ? {
                          content: '""',
                          position: "absolute",
                          left: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "4px",
                          height: "4px",
                          bg: "cyan.500",
                          rounded: "full",
                        } : {}}
                        pl={isActive ? 8 : 4}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
};

export default Navbar;