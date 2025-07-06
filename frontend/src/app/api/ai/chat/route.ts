import { NextRequest, NextResponse } from 'next/server';

// Define interface for metadata
interface Metadata {
  action: string;
  data: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const { message, walletAddress, context } = await request.json();
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple AI response logic for demo
    const lowerMessage = message.toLowerCase();
    
    let aiResponse = {
      message: "",
      metadata: null as Metadata | null // Updated type
    };
    
    if (lowerMessage.includes('insure') || lowerMessage.includes('policy')) {
      aiResponse.message = "I can help you create an insurance policy! What type of asset would you like to insure? I support vehicles, properties, and art pieces.";
    } else if (lowerMessage.includes('claim')) {
      aiResponse.message = "I can help you submit a claim. Do you need to report theft, damage, or total loss? Please provide details about what happened.";
      aiResponse.metadata = {
        action: 'submit_claim',
        data: { type: 'damage' }
      };
    } else if (lowerMessage.includes('quote') || lowerMessage.includes('price')) {
      aiResponse.message = "I can provide you with an instant quote! What's the estimated value of your asset and where is it located?";
      aiResponse.metadata = {
        action: 'check_quote',
        data: {}
      };
    } else if (lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
      aiResponse.message = "Great! I can help insure your vehicle. I'll need some details:\n\n1. Vehicle make and model\n2. Year of manufacture\n3. Estimated value\n4. Location\n\nBased on these details, my AI will assess the risk and provide you with a premium quote. Do you have your vehicle's NFT token ID?";
      aiResponse.metadata = {
        action: 'create_policy',
        data: { assetType: 'vehicle' }
      };
    } else if (lowerMessage.includes('aston martin') || lowerMessage.includes('db5')) {
      aiResponse.message = "Excellent choice! The 1965 Aston Martin DB5 is a classic. Based on similar vehicles, I estimate:\n\n• Risk Score: 70/100 (classic car, well-maintained)\n• Estimated Premium: £125/month\n• Recommended Coverage: £50,000\n\nWould you like me to create a policy for this vehicle?";
      aiResponse.metadata = {
        action: 'create_policy',
        data: { 
          assetType: 'vehicle',
          make: 'Aston Martin',
          model: 'DB5',
          year: 1965,
          estimatedValue: 50000,
          premium: 125
        }
      };
    } else {
      aiResponse.message = "Hello! I'm your AI insurance assistant. I can help you:\n\n• Create insurance policies for tokenized assets\n• Submit claims for damages or theft\n• Get instant quotes for your assets\n• Explain coverage options\n\nWhat would you like to do today?";
    }
    
    return NextResponse.json(aiResponse);
  } catch (error) {
    return NextResponse.json({ 
      message: "Sorry, I'm experiencing technical difficulties. Please try again later.",
      metadata: null 
    }, { status: 500 });
  }
}