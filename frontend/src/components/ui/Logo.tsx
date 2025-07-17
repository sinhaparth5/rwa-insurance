"use client";

import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "./color-mode";
import Link from "next/link";

interface LogoProps {
  size?: string;
  showText?: boolean;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "compact" | "icon-only";
  animation?: "none" | "float" | "pulse" | "glow" | "spin" | "bounce";
  onLoadAnimation?: "slideInLeft" | "slideInRight" | "bounceIn" | "fadeIn";
}

export const Logo = ({ 
  size = "40px", 
  showText = true, 
  href,
  onClick,
  variant = "default",
  animation = "none",
  onLoadAnimation
}: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const activeColor = useColorModeValue("cyan.600", "cyan.400");
  const textColor = useColorModeValue("cyan.900", "cyan.100");
  const fallbackBg = useColorModeValue("cyan.500", "cyan.600");

  // Determine if text should be shown based on variant
  const shouldShowText = variant !== "icon-only" && showText;
  
  // Determine size based on variant
  const logoSize = variant === "compact" ? "32px" : size;
  const fontSize = variant === "compact" ? "md" : "lg";
  const textSize = variant === "compact" ? { base: "md", md: "lg" } : { base: "lg", md: "xl" };

  // Get animation based on type
  const getAnimation = () => {
    switch (animation) {
      case "float": return "logoFloat";
      case "pulse": return "logoPulse";
      case "glow": return "logoGlow";
      case "spin": return "logoSpin";
      case "bounce": return "quickBounce";
      default: return undefined;
    }
  };

  // Get load animation
  const getLoadAnimation = () => {
    if (!onLoadAnimation || isLoaded) return undefined;
    
    switch (onLoadAnimation) {
      case "slideInLeft": return "slideInLeft";
      case "slideInRight": return "slideInRight";
      case "bounceIn": return "bounceIn";
      case "fadeIn": return "fadeInOut";
      default: return undefined;
    }
  };

  const LogoContent = () => (
    <Flex 
      alignItems="center" 
      gap={shouldShowText ? (variant === "compact" ? 2 : 3) : 0}
      cursor={href || onClick ? "pointer" : "default"}
      _hover={href || onClick ? { 
        transform: "scale(1.05)"
      } : {}}
      transition="all 0.2s ease"
      animation={getLoadAnimation()}
      onAnimationEnd={() => setIsLoaded(true)}
    >
      {/* Logo Image/Fallback */}
      {!imageError ? (
        <Image
          src="/logo.png"
          alt="InsureGenie Logo"
          height={logoSize}
          width={logoSize}
          onError={() => setImageError(true)}
          borderRadius="md"
          transition="all 0.2s ease"
          animation={getAnimation()}
          _hover={{
            animation: animation === "none" ? "quickBounce" : undefined
          }}
        />
      ) : (
        <Box 
          w={logoSize} 
          h={logoSize} 
          bg={fallbackBg}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
          fontSize={fontSize}
          boxShadow="sm"
          transition="all 0.2s ease"
          animation={getAnimation()}
          _hover={{
            animation: animation === "none" ? "quickBounce" : undefined,
            boxShadow: "md"
          }}
        >
          IG
        </Box>
      )}
      
      {/* Logo Text */}
      {shouldShowText && (
        <Text
          fontWeight="bold" 
          fontSize={textSize}
          color={textColor}
          _hover={{ color: activeColor }}
          transition="color 0.2s ease"
          letterSpacing="tight"
        >
          InsureGenie
        </Text>
      )}
    </Flex>
  );

  // Handle click events
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Wrap with Link if href is provided
  if (href) {
    return (
      <Link href={href} onClick={handleClick}>
        <LogoContent />
      </Link>
    );
  }

  // Wrap with clickable Box if onClick is provided
  if (onClick) {
    return (
      <Box onClick={handleClick} role="button" tabIndex={0}>
        <LogoContent />
      </Box>
    );
  }

  // Return plain logo
  return <LogoContent />;
};

// Predefined logo variants
export const LogoDefault = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="default" />
);

export const LogoCompact = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="compact" />
);

export const LogoIcon = (props: Omit<LogoProps, 'variant' | 'showText'>) => (
  <Logo {...props} variant="icon-only" showText={false} />
);

// Animated variants
export const LogoFloating = (props: Omit<LogoProps, 'animation'>) => (
  <Logo {...props} animation="float" />
);

export const LogoPulsing = (props: Omit<LogoProps, 'animation'>) => (
  <Logo {...props} animation="pulse" />
);

export const LogoGlowing = (props: Omit<LogoProps, 'animation'>) => (
  <Logo {...props} animation="glow" />
);

export const LogoSpinning = (props: Omit<LogoProps, 'animation'>) => (
  <Logo {...props} animation="spin" />
);

// Logo with loading state using custom animations
export const LogoWithLoading = ({ 
  isLoading, 
  ...props 
}: LogoProps & { isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <Flex alignItems="center" gap={3}>
        <Box 
          w={props.size || "40px"} 
          h={props.size || "40px"} 
          bg="gray.200"
          borderRadius="md"
          animation="fadeInOut"
        />
        {props.showText !== false && (
          <Box 
            w="120px" 
            h="24px" 
            bg="gray.200" 
            borderRadius="md"
            animation="fadeInOut"
            animationDelay="0.2s"
          />
        )}
      </Flex>
    );
  }

  return <Logo {...props} />;
};

// Interactive logo that changes animation on hover
export const LogoInteractive = ({ ...props }: LogoProps) => {
  const [currentAnimation, setCurrentAnimation] = useState<LogoProps['animation']>('pulse');

  return (
    <Box
      onMouseEnter={() => setCurrentAnimation('bounce')}
      onMouseLeave={() => setCurrentAnimation('pulse')}
    >
      <Logo {...props} animation={currentAnimation} />
    </Box>
  );
};

// Logo for page load with entrance animation
export const LogoPageLoad = (props: Omit<LogoProps, 'onLoadAnimation'>) => (
  <Logo {...props} onLoadAnimation="bounceIn" />
);

// Logo for sidebar entrance
export const LogoSidebarEntrance = (props: Omit<LogoProps, 'onLoadAnimation'>) => (
  <Logo {...props} onLoadAnimation="slideInLeft" />
);

export default Logo;