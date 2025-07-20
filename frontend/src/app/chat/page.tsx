import { ChatbotInterface } from "@/components/ChatbotInterface";
import { generateRWAMetadata } from "@/utils/seo";

export async function generateMetadata() {
    return generateRWAMetadata({
        page: "chat",
        data: {
            title: "AI Insurance Chatbot",
            description: "Chat with our AI assistant to get personalized insurance advice and risk assessments for your digital assets.",
            image: "/images/chatbot.png"
        }
    });
}

export default function ChatPage() {
    return <ChatbotInterface />;
}
