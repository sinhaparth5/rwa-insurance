"use client";

import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Badge,
  Avatar,
  Flex,
  SimpleGrid,
  Spinner
} from "@chakra-ui/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { FiSend, FiUser, FiTrendingUp, FiShield, FiRefreshCw } from "react-icons/fi";
import { LiaRobotSolid } from "react-icons/lia";
import { chatAPI, assetsAPI, policiesAPI, claimsAPI, riskAPI } from "@/lib/api/services";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  action?: string;
  suggestions?: string[];
  metadata?: any;
}

export const ChatbotInterface = () => {
  const { address, isConnected } = useWallet();
  const { isAuthenticated, token } = useAuth();
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm your full-featured AI insurance assistant. I can help you create policies, manage assets, submit claims, and more. How can I assist you today?",
      timestamp: new Date(),
      suggestions: ["Show my assets", "Get insurance quote", "Check my policies", "File a claim"]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userAssets, setUserAssets] = useState([]);
  const [userPolicies, setUserPolicies] = useState([]);
  const [userClaims, setUserClaims] = useState([]);
  const [stats, setStats] = useState({
    totalMessages: 1,
    sessionTime: 0,
    queriesResolved: 0
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FIXED: Only load data on manual trigger, not automatically
  const loadUserData = useCallback(async () => {
    if (!token || isLoadingData) return;

    setIsLoadingData(true);
    try {
      console.log('📊 Loading user data manually...');
      
      const [assets, policies, claims] = await Promise.all([
        assetsAPI.getAssets(token),
        policiesAPI.getPolicies(token),
        claimsAPI.getClaims(token)
      ]);
      
      setUserAssets(assets);
      setUserPolicies(policies);
      setUserClaims(claims);
      
      console.log('✅ User data loaded:', { 
        assets: assets.length, 
        policies: policies.length, 
        claims: claims.length 
      });

      addSystemMessage(`📊 Data refreshed: ${assets.length} assets, ${policies.length} policies, ${claims.length} claims`);
      
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
      addSystemMessage("❌ Failed to load your data. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  }, [token, isLoadingData]);

  // Update session time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({ ...prev, sessionTime: prev.sessionTime + 1 }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || !isAuthenticated || !token) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStats(prev => ({ ...prev, totalMessages: prev.totalMessages + 1 }));

    try {
      console.log('💬 Sending message to backend:', messageContent);
      
      const response = await chatAPI.sendMessage(messageContent, sessionId, token);
      
      console.log('🤖 AI Response:', response);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.response || response.message || "I received your message and I'm here to help with your insurance needs.",
        timestamp: new Date(),
        action: response.action,
        suggestions: response.suggestions,
        metadata: response.metadata
      };

      setMessages(prev => [...prev, botMessage]);
      setStats(prev => ({ ...prev, queriesResolved: prev.queriesResolved + 1 }));

      // Handle AI actions
      if (response.action) {
        await handleAIAction(response.action, response.metadata);
      }

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Sorry, I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        suggestions: ["Try again", "Refresh data", "Get help"]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAIAction = async (action: string, metadata: any) => {
    if (!token) return;

    try {
      console.log('🎯 Handling AI action:', action, metadata);

      switch (action) {
        case 'create_asset':
          if (metadata?.asset_data) {
            const asset = await assetsAPI.createAsset(metadata.asset_data, token);
            addSystemMessage(`✅ Asset created successfully! Asset ID: ${asset.id}`);
          }
          break;

        case 'create_policy':
          if (metadata?.policy_data) {
            const policy = await policiesAPI.createPolicy(metadata.policy_data, token);
            addSystemMessage(`✅ Insurance policy created successfully! Policy ID: ${policy.id}`);
          }
          break;

        case 'submit_claim':
          if (metadata?.claim_data) {
            const claim = await claimsAPI.submitClaim(metadata.claim_data, token);
            addSystemMessage(`✅ Claim submitted successfully! Claim ID: ${claim.id}`);
          }
          break;

        case 'assess_risk':
          if (metadata?.asset_id) {
            const riskAssessment = await riskAPI.assessRisk(metadata.asset_id, token);
            addSystemMessage(`📊 Risk Assessment: Score ${riskAssessment.risk_score}/100, Premium: $${riskAssessment.estimated_premium || 'TBD'}/month`);
          }
          break;

        case 'show_assets':
          const assets = await assetsAPI.getAssets(token);
          setUserAssets(assets);
          const assetList = assets.map((asset: any) => `• ${asset.name} (${asset.category}) - $${asset.value}`).join('\n');
          addSystemMessage(`📋 Your Assets:\n${assetList || 'No assets found'}`);
          break;

        case 'show_policies':
          const policies = await policiesAPI.getPolicies(token);
          setUserPolicies(policies);
          const policyList = policies.map((policy: any) => `• Policy #${policy.id} - ${policy.status} ($${policy.premium_amount}/month)`).join('\n');
          addSystemMessage(`📋 Your Policies:\n${policyList || 'No policies found'}`);
          break;

        case 'show_claims':
          const claims = await claimsAPI.getClaims(token);
          setUserClaims(claims);
          const claimList = claims.map((claim: any) => `• Claim #${claim.id} - ${claim.status} ($${claim.claim_amount})`).join('\n');
          addSystemMessage(`📋 Your Claims:\n${claimList || 'No claims found'}`);
          break;

        case 'pay_premium':
          if (metadata?.policy_id) {
            const result = await policiesAPI.payPremium(metadata.policy_id, token);
            addSystemMessage(`✅ Premium payment processed! Amount: $${result.amount}`);
          }
          break;

        case 'get_risk_history':
          if (metadata?.asset_id) {
            const history = await riskAPI.getRiskHistory(metadata.asset_id, token);
            addSystemMessage(`📈 Risk History: ${history.assessments.length} assessments found`);
          }
          break;

        default:
          console.log('🤷 Unknown action:', action);
      }
    } catch (error) {
      console.error('❌ Failed to handle AI action:', error);
      addSystemMessage("❌ Failed to complete the requested action. Please try again.");
    }
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'bot',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: "Refresh Data", icon: FiRefreshCw, action: () => loadUserData() },
    { label: "Show Assets", icon: FiTrendingUp, message: "Show me all my tokenized assets" },
    { label: "Get Quote", icon: FiShield, message: "I want to get an insurance quote" },
    { label: "File Claim", icon: FiUser, message: "I need to file an insurance claim" }
  ];

  if (!isConnected) {
    return (
      <Box maxW="4xl" mx="auto" p={6}>
        <Card.Root>
          <Card.Body textAlign="center" py={12}>
            <VStack gap={4}>
              <LiaRobotSolid size={48} />
              <Heading size="lg">Full AI Insurance Assistant</Heading>
              <Text color="gray.600">Connect your wallet to access all features</Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box maxW="4xl" mx="auto" p={6}>
        <Card.Root>
          <Card.Body textAlign="center" py={12}>
            <VStack gap={4}>
              <LiaRobotSolid size={48} />
              <Heading size="lg">Full AI Insurance Assistant</Heading>
              <Text color="gray.600">Please authenticate your wallet to access all features</Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack gap={6} align="stretch">
        
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>Full AI Insurance Assistant</Heading>
          <Text color="gray.600">Complete insurance management with AI assistance</Text>
          <HStack gap={2} mt={2}>
            <Badge colorScheme="green">Full Features</Badge>
            <Badge colorScheme="blue">API Connected</Badge>
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          
          {/* Chat Interface */}
          <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
            <Card.Root height="600px" display="flex" flexDirection="column">
              
              {/* Chat Header */}
              <Card.Header borderBottom="1px solid" borderColor="gray.200">
                <HStack>
                  <Avatar.Root size="sm">
                    <Avatar.Fallback><LiaRobotSolid /></Avatar.Fallback>
                  </Avatar.Root>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="semibold">Full AI Assistant</Text>
                    <Text fontSize="sm" color="gray.600">Create • Manage • Analyze</Text>
                  </VStack>
                  <Badge colorScheme="green" ml="auto">Ready</Badge>
                </HStack>
              </Card.Header>

              {/* Messages */}
              <Card.Body flex="1" overflowY="auto" p={4}>
                <VStack gap={4} align="stretch">
                  {messages.map((message) => (
                    <Flex
                      key={message.id}
                      justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      <Box maxW="80%">
                        <HStack mb={2} justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                          {message.role === 'bot' && (
                            <Avatar.Root size="xs">
                              <Avatar.Fallback><LiaRobotSolid /></Avatar.Fallback>
                            </Avatar.Root>
                          )}
                          <Text fontSize="xs" color="gray.500">
                            {message.timestamp.toLocaleTimeString()}
                          </Text>
                          {message.role === 'user' && (
                            <Avatar.Root size="xs">
                              <Avatar.Fallback><FiUser /></Avatar.Fallback>
                            </Avatar.Root>
                          )}
                        </HStack>
                        
                        <Box
                          bg={message.role === 'user' ? 'cyan.500' : 'gray.100'}
                          color={message.role === 'user' ? 'white' : 'gray.900'}
                          px={4}
                          py={3}
                          borderRadius="lg"
                          borderBottomRightRadius={message.role === 'user' ? "sm" : "lg"}
                          borderBottomLeftRadius={message.role === 'bot' ? "sm" : "lg"}
                        >
                          <Text whiteSpace="pre-wrap">{message.content}</Text>
                        </Box>

                        {/* Suggestions */}
                        {message.role === 'bot' && message.suggestions && (
                          <HStack mt={2} wrap="wrap" gap={2}>
                            {message.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                size="xs"
                                variant="outline"
                                colorScheme="cyan"
                                onClick={() => sendMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </HStack>
                        )}
                      </Box>
                    </Flex>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <Flex justify="flex-start">
                      <HStack>
                        <Avatar.Root size="xs">
                          <Avatar.Fallback><LiaRobotSolid /></Avatar.Fallback>
                        </Avatar.Root>
                        <Box bg="gray.100" px={4} py={3} borderRadius="lg">
                          <HStack gap={1}>
                            <Spinner size="xs" />
                            <Text fontSize="sm" color="gray.600">AI is working...</Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Flex>
                  )}
                  
                  <div ref={messagesEndRef} />
                </VStack>
              </Card.Body>

              {/* Input */}
              <Card.Footer borderTop="1px solid" borderColor="gray.200" p={4}>
                <HStack>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me to create policies, manage assets, assess risk..."
                    flex="1"
                  />
                  <Button
                    colorScheme="cyan"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isTyping}
                    loading={isTyping}
                  >
                    <FiSend />
                  </Button>
                </HStack>
              </Card.Footer>
            </Card.Root>
          </Box>

          {/* Sidebar */}
          <VStack gap={6} align="stretch">
            
            {/* Quick Actions */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Actions</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={3} align="stretch">
                  {quickActions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      justifyContent="flex-start"
                      onClick={action.action || (() => sendMessage(action.message))}
                      loading={action.label === "Refresh Data" && isLoadingData}
                    >
                      <action.icon style={{ marginRight: '8px' }} />
                      {action.label}
                    </Button>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Current Data */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Your Data</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Assets</Text>
                    <Badge colorScheme="blue">{userAssets.length}</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Policies</Text>
                    <Badge colorScheme="green">{userPolicies.length}</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Claims</Text>
                    <Badge colorScheme="orange">{userClaims.length}</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Messages</Text>
                    <Badge>{stats.totalMessages}</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Session</Text>
                    <Badge>{stats.sessionTime}m</Badge>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Capabilities */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">AI Capabilities</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={2} align="stretch" fontSize="sm">
                  <Text>✅ Create Assets & Policies</Text>
                  <Text>✅ Submit & Track Claims</Text>
                  <Text>✅ Risk Assessment</Text>
                  <Text>✅ Premium Calculation</Text>
                  <Text>✅ Payment Processing</Text>
                  <Text>✅ Portfolio Analysis</Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};