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
import { useState, useRef, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { FiSend, FiUser, FiTrendingUp, FiShield } from "react-icons/fi";
import { LiaRobotSolid } from "react-icons/lia";

// Fake chatbot API service
const fakeChatbotAPI = {
  async chat(message: string, walletAddress: string, context: any) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      "hello": {
        message: "Hello! I'm your AI insurance assistant. I can help you analyze your assets, calculate premiums, and guide you through creating policies. What would you like to know?",
        action: "info",
        suggestions: ["Analyze my assets", "Get insurance quote", "File a claim"]
      },
      "analyze": {
        message: "I can see you own a 1965 Aston Martin DB5 worth £50,000. Based on its location in London and classic car status, I calculate a risk score of 78/100. The estimated monthly premium is £156. Would you like me to create a detailed policy quote?",
        action: "analyze_asset",
        suggestions: ["Create policy quote", "View risk factors", "Compare coverage options"]
      },
      "premium": {
        message: "For your Aston Martin DB5, the premium breakdown is: Base rate £85 + Location risk £35 + Age factor £20 + Value premium £16 = £156/month. This includes comprehensive coverage for theft, damage, and total loss.",
        action: "quote",
        suggestions: ["Create policy", "Adjust coverage", "See payment options"]
      },
      "claim": {
        message: "I can help you file a claim. I'll need: 1) Police report number (for theft), 2) Photos of damage, 3) Repair estimates. Do you have your policy number ready?",
        action: "file_claim",
        suggestions: ["Upload documents", "Check claim status", "Contact assessor"]
      },
      "default": {
        message: "I understand you're asking about insurance for your tokenized assets. I can help with risk assessment, premium calculations, policy creation, and claims. What specific aspect interests you?",
        action: "info",
        suggestions: ["Risk assessment", "Premium quote", "Policy creation"]
      }
    };

    // Simple keyword matching
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      response = responses.hello;
    } else if (lowerMessage.includes("analyze") || lowerMessage.includes("asset")) {
      response = responses.analyze;
    } else if (lowerMessage.includes("premium") || lowerMessage.includes("cost") || lowerMessage.includes("price")) {
      response = responses.premium;
    } else if (lowerMessage.includes("claim") || lowerMessage.includes("stolen") || lowerMessage.includes("damage")) {
      response = responses.claim;
    }

    return response;
  }
};

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  action?: string;
  suggestions?: string[];
}

export const ChatbotInterface = () => {
  const { address, isConnected } = useWallet();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm your AI insurance assistant. I can help you with asset analysis, premium calculations, and policy management. How can I assist you today?",
      timestamp: new Date(),
      suggestions: ["Analyze my assets", "Get insurance quote", "Check my policies"]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || !isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Replace with real API call
      const response = await fakeChatbotAPI.chat(messageContent, address!, {
        assets: [{ name: "1965 Aston Martin DB5", token_id: 456 }],
        policies: []
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.message,
        timestamp: new Date(),
        action: response.action,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Sorry, I'm experiencing technical difficulties. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: "Analyze Assets", icon: FiTrendingUp, message: "Analyze my tokenized assets for insurance" },
    { label: "Get Quote", icon: FiShield, message: "Get an insurance premium quote" },
    { label: "File Claim", icon: FiUser, message: "I need to file an insurance claim" }
  ];

  if (!isConnected) {
    return (
      <Box maxW="4xl" mx="auto" p={6}>
        <Card.Root>
          <Card.Body textAlign="center" py={12}>
            <VStack gap={4}>
              <LiaRobotSolid size={48} />
              <Heading size="lg">AI Insurance Assistant</Heading>
              <Text color="gray.600">Connect your wallet to start chatting with our AI assistant</Text>
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
          <Heading size="xl" mb={2}>AI Insurance Assistant</Heading>
          <Text color="gray.600">Get instant help with asset analysis, premium quotes, and policy management</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          
          {/* Chat Interface */}
          <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
            <Card.Root height="600px" display="flex" flexDirection="column">
              
              {/* Chat Header */}
              <Card.Header borderBottom="1px solid" borderColor="gray.200">
                <HStack>
                  <Avatar.Root size="sm">
                    <Avatar.Image />
                    <Avatar.Fallback><LiaRobotSolid /></Avatar.Fallback>
                  </Avatar.Root>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="semibold">AI Assistant</Text>
                    <Text fontSize="sm" color="gray.600">Online • Powered by OpenAI</Text>
                  </VStack>
                  <Badge colorScheme="green" ml="auto">Active</Badge>
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
                            <Text fontSize="sm" color="gray.600">AI is thinking...</Text>
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
                    placeholder="Ask me about insurance, risk assessment, or claims..."
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

          {/* Sidebar - Quick Actions & Stats */}
          <VStack gap={6} align="stretch">
            
            {/* Quick Actions */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Quick Actions</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={3} align="stretch">
                  {quickActions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      justifyContent="flex-start"
                      onClick={() => sendMessage(action.message)}
                    >
                      <action.icon style={{ marginRight: '8px' }} />
                      {action.label}
                    </Button>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Chat Stats */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Chat Statistics</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Messages</Text>
                    <Badge>{messages.length}</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Session Time</Text>
                    <Badge>5 min</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Queries Resolved</Text>
                    <Badge colorScheme="green">3</Badge>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* AI Capabilities */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">AI Capabilities</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={2} align="stretch" fontSize="sm">
                  <Text>✅ Asset Risk Analysis</Text>
                  <Text>✅ Premium Calculation</Text>
                  <Text>✅ Policy Creation Guide</Text>
                  <Text>✅ Claims Processing</Text>
                  <Text>✅ Market Insights</Text>
                  <Text>✅ Document Analysis</Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Help */}
            <Card.Root bg="cyan.50">
              <Card.Body>
                <VStack gap={2} align="start">
                  <Text fontSize="sm" fontWeight="semibold">Need help?</Text>
                  <Text fontSize="xs" color="gray.600">
                    Ask me anything about your tokenized assets, insurance coverage, or claims process.
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};