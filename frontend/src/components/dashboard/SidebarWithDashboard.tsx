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
} from '@chakra-ui/react'
import {
  DrawerBackdrop,
  DrawerContent,
  DrawerRoot,
} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { Menu } from '@chakra-ui/react'
import {
  FiHome,
  FiShield,
  FiFileText,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiPlus,
  FiList
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { useColorModeValue } from '../ui/color-mode'
import { useState } from 'react'
import { RegisterAsset } from './RegisterAsset'
import { MyAssets } from './MyAssets'
import { MyPolicies } from './MyPolicies'
import { Claims } from './Claims'
import { useWallet } from '@/hooks/useWallet'
import ConnectButton from '../ConnectButton'
import { Logo } from '@/components/ui/Logo'
import { LiaRobotSolid } from 'react-icons/lia'
import { ChatbotInterface } from '../ChatbotInterface'
import { DashboardOverview } from './DashboardOverview'

interface LinkItemProps {
  name: string
  icon: IconType
  id: string
}

interface NavItemProps extends FlexProps {
  icon: IconType
  id: string
  children: React.ReactNode
  isActive: boolean
  onClick: () => void
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, id: 'dashboard' },
  { name: 'My Assets', icon: FiList, id: 'assets' },
  { name: 'Register Asset', icon: FiPlus, id: 'register' },
  { name: 'My Policies', icon: FiShield, id: 'policies' },
  { name: 'AI Assitant', icon: LiaRobotSolid, id: 'chat' },
  { name: 'Claims', icon: FiFileText, id: 'claims' },
  { name: 'Settings', icon: FiSettings, id: 'settings' },
]

const SidebarContent = ({ onClose, activeTab, onTabChange, ...rest }: SidebarProps) => {
  // Move all useColorModeValue calls to the top
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      transition="3s ease"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo href="/" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      
      <VStack gap={2} align="stretch" px={4}>
        {LinkItems.map((link) => (
          <NavItem 
            key={link.name} 
            icon={link.icon} 
            id={link.id}
            isActive={activeTab === link.id}
            onClick={() => onTabChange(link.id)}
          >
            {link.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  )
}

const NavItem = ({ icon, id, children, isActive, onClick, ...rest }: NavItemProps) => {
  const hoverBg = useColorModeValue('cyan.50', 'cyan.900');
  const activeBg = useColorModeValue('cyan.100', 'cyan.800');
  const activeColor = useColorModeValue('cyan.700', 'cyan.200');
  
  return (
    <Flex
      align="center"
      p="3"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : 'inherit'}
      _hover={{
        bg: isActive ? activeBg : hoverBg,
        color: isActive ? activeColor : 'cyan.600',
      }}
      onClick={onClick}
      {...rest}>
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
        />
      )}
      {children}
    </Flex>
  )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  // Move all useColorModeValue calls to the top
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isConnected, formattedAddress, disconnectWallet } = useWallet();
  
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu">
        <FiMenu />
      </IconButton>

      <Box display={{ base: 'flex', md: 'none' }}>
        <Logo href="/" />
      </Box>

      <HStack gap={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="notifications">
          <FiBell />
        </IconButton>
        
        {isConnected ? (
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
                    <Avatar.Fallback>{formattedAddress?.slice(0, 2)}</Avatar.Fallback>
                  </Avatar.Root>
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    gap="1px"
                    ml="2">
                    <Text fontSize="sm">{formattedAddress}</Text>
                    <Text fontSize="xs" color="gray.600">
                      Connected
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content
                  bg={bgColor}
                  borderColor={borderColor}>
                  <Menu.Item value="profile">Profile</Menu.Item>
                  <Menu.Item value="settings">Settings</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item value="disconnect" onClick={disconnectWallet}>
                    Disconnect Wallet
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </Flex>
        ) : (
          <ConnectButton />
        )}
      </HStack>
    </Flex>
  )
}

const DashboardContent = ({ activeTab }: { activeTab: string }) => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        minH="50vh"
        flexDirection="column"
        gap={6}
      >
        <Text fontSize="xl" textAlign="center">
          Connect your wallet to access the dashboard
        </Text>
        <ConnectButton />
      </Box>
    );
  }

  switch (activeTab) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'assets':
      return <MyAssets />;
    case 'register':
      return <RegisterAsset />;
    case 'policies':
      return <MyPolicies />;
    case 'chat':
      return <ChatbotInterface />;
    case 'claims':
      return <Claims />;
    case 'settings':
      return <Settings />;
    default:
      return <DashboardOverview />;
  }
};

const Settings = () => (
  <Box>
    <Text fontSize="2xl" fontWeight="bold" mb={6}>Settings</Text>
    <Text>Settings panel coming soon...</Text>
  </Box>
);

const SidebarWithDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Move useColorModeValue to the top
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box minH="100vh" bg={bgColor}>
      <SidebarContent 
        onClose={onClose} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        display={{ base: 'none', md: 'block' }} 
      />
      
      <DrawerRoot 
        open={isOpen} 
        onOpenChange={({ open }) => setIsOpen(open)} 
        placement="start" 
        size="sm"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <SidebarContent 
            onClose={onClose} 
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              onClose();
            }}
            w="100%" 
          />
        </DrawerContent>
      </DrawerRoot>
      
      {/* Mobile nav */}
      <MobileNav onOpen={onOpen} />
      
      {/* Main content */}
      <Box ml={{ base: 0, md: 60 }} p="6">
        <DashboardContent activeTab={activeTab} />
      </Box>
    </Box>
  )
}

export default SidebarWithDashboard