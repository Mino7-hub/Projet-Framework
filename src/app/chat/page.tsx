import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
    return (
        <div className="min-h-[calc(100vh-6rem)] bg-[#0A0A0A] flex items-center justify-center p-6">
            <div className="w-full max-w-7xl animate-fade-in-up">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#F5F5F5] mb-4">
                        Literary <span className="text-[#D4AF37]">Assistant</span>
                    </h1>
                    <p className="text-[#A3A3A3] max-w-2xl mx-auto text-lg">
                        Ask for recommendations, discuss your favorite genres, or find the perfect book for your mood.
                    </p>
                </div>

                <ChatInterface />
            </div>
        </div>
    );
}
