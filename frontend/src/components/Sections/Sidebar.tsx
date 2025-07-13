'use client'

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Text,
  BoxProps,
  FlexProps,
  Link,
  Image
} from '@chakra-ui/react'
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { Menu } from '@chakra-ui/react'
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { useColorModeValue } from '../ui/color-mode'
import { useState } from 'react'

interface LinkItemProps {
  name: string
  icon: IconType
  href: string
}

interface NavItemProps extends FlexProps {
  icon: IconType
  href: string
  children: React.ReactNode
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/' },
  { name: 'Trending', icon: FiTrendingUp, href: '/trending' },
  { name: 'Explore', icon: FiCompass, href: '/explore' },
  { name: 'Favourites', icon: FiStar, href: '/favourites' },
  { name: 'Settings', icon: FiSettings, href: '/settings' },
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const activeColor = useColorModeValue("cyan.600", "cyan.400");
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
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
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      display="block"
      w="100%">
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        w="calc(100% - 32px)"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const activeColor = useColorModeValue("cyan.600", "cyan.400");
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu">
        <FiMenu />
      </IconButton>

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        
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
      </Text>

      <HStack gap={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu">
          <FiBell />
        </IconButton>
        <Flex alignItems={'center'}>
          <Menu.Root>
            <Menu.Trigger py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar.Root size={'sm'}>
                  <Avatar.Image
                    src={
                      'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                  <Avatar.Fallback>JC</Avatar.Fallback>
                </Avatar.Root>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  gap="1px"
                  ml="2">
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <Menu.Item value="profile">Profile</Menu.Item>
                <Menu.Item value="settings">Settings</Menu.Item>
                <Menu.Item value="billing">Billing</Menu.Item>
                <Menu.Separator />
                <Menu.Item value="signout">Sign out</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Flex>
      </HStack>
    </Flex>
  )
}

const SidebarWithHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <DrawerRoot open={isOpen} onOpenChange={({ open }) => setIsOpen(open)} placement="start" size="full">
        <DrawerBackdrop />
        <DrawerContent w="100%">
          <SidebarContent onClose={onClose} w="100%" />
        </DrawerContent>
      </DrawerRoot>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  )
}

export default SidebarWithHeader