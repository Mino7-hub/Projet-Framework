'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/solid';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    suggestions?: string[];
};

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your AI literary assistant. How can I help you discover your next favorite book today?",
            sender: 'bot',
            timestamp: new Date(),
            suggestions: ['Recommend a mystery novel', 'Find books by specific author', 'What is trending?']
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Generate random session ID on mount
        setSessionId(crypto.randomUUID());
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            const res = await fetch('https://amine0004.app.n8n.cloud/webhook/recommander', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionId,
                    message: text
                })
            });

            if (!res.ok) throw new Error('Failed to fetch response');

            const data = await res.json();

            let botText = "Sorry, I couldn't process that.";

            // Normalize data: check if 'output' is a stringified JSON array
            let normalizedData = data;

            // Case 1: Root object with output string: { output: "[...]" }
            if (data?.output && typeof data.output === 'string') {
                try {
                    const parsed = JSON.parse(data.output);
                    if (Array.isArray(parsed)) normalizedData = parsed;
                } catch (e) { }
            }
            // Case 2: Array containing object with output string: [{ output: "[...]" }]
            else if (Array.isArray(data) && data.length > 0 && data[0]?.output && typeof data[0].output === 'string') {
                try {
                    const parsed = JSON.parse(data[0].output);
                    if (Array.isArray(parsed)) normalizedData = parsed;
                } catch (e) { }
            }

            if (Array.isArray(normalizedData)) {
                console.log('Webhook response data (normalized):', normalizedData); // Debug

                // Handle nested array case
                const items = (normalizedData.length > 0 && Array.isArray(normalizedData[0])) ? normalizedData[0] : normalizedData;

                // Check if this looks like a list of books (must have 'reason' or similar fields)
                const isRecommendationList = items.length > 0 && items.some((item: any) => item.reason || item.json?.reason);

                if (isRecommendationList) {
                    botText = "Here are some recommendations based on your request:\n\n" +
                        items.map((item: any) => {
                            const reason = item.reason || item.json?.reason;
                            if (reason) return `• ${reason}`;
                            return `• ${typeof item === 'string' ? item : JSON.stringify(item)}`;
                        }).join('\n\n');
                } else if (items.length > 0) {
                    // It's an array but not a recommendation list (e.g. just a text message wrapped in an array)
                    const firstItem = items[0];
                    botText = firstItem.output || firstItem.text || firstItem.message || (typeof firstItem === 'string' ? firstItem : JSON.stringify(firstItem));
                } else {
                    botText = "I checked the library, but I couldn't find any books matching your exact criteria.";
                }
            } else {
                botText = data.output || data.text || data.message || botText;
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botText,
                sender: 'bot',
                timestamp: new Date(),
                suggestions: data.suggestions || []
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the server right now.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputText);
        }
    };

    return (
        <div className="flex flex-col h-[700px] w-full max-w-4xl mx-auto bg-[#1A1A1A] rounded-xl border border-[#333] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#000] p-4 border-b border-[#333] flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37]/10 rounded-full">
                    <SparklesIcon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                    <h2 className="text-[#F5F5F5] font-serif font-bold text-lg">AI Assistant</h2>
                    <p className="text-[#A3A3A3] text-xs">Always here to help you</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[#111]">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex flex-col max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div
                                className={`p-4 rounded-2xl ${message.sender === 'user'
                                    ? 'bg-[#D4AF37] text-black rounded-tr-none'
                                    : 'bg-[#262626] text-[#E5E5E5] border border-[#333] rounded-tl-none'
                                    } shadow-lg backdrop-blur-sm`}
                            >
                                <p className="leading-relaxed">{message.text}</p>
                            </div>
                            <span className="text-[10px] text-[#666] mt-1 px-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                            {/* Suggestions Chips */}
                            {message.suggestions && (
                                <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                                    {message.suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(suggestion)}
                                            className="px-3 py-1.5 text-xs border border-[#D4AF37]/30 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-[#262626] p-4 rounded-2xl rounded-tl-none border border-[#333] flex gap-1 items-center">
                            <span className="w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#000] border-t border-[#333]">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="w-full bg-[#1A1A1A] text-[#F5F5F5] placeholder-[#666] border border-[#333] rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                    <button
                        onClick={() => handleSendMessage(inputText)}
                        disabled={!inputText.trim()}
                        className="absolute right-2 p-2 bg-[#D4AF37] rounded-full hover:bg-[#B5952F] disabled:opacity-50 disabled:hover:bg-[#D4AF37] transition-colors"
                    >
                        <PaperAirplaneIcon className="w-5 h-5 text-black" />
                    </button>
                </div>
            </div>
        </div>
    );
}
