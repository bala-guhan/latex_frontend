import React, { useState } from 'react';
import axios from 'axios';
//eslint-disable-next-line
import { motion } from 'framer-motion';

const Chat = ({ sessionId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading && sessionId) {
            try {
                setIsLoading(true);
                const response = await axios.post('http://localhost:8000/chat', {
                    message: input,
                    session_id: sessionId
                });
                setMessages([...messages, 
                    { text: input, sender: 'user' }, 
                    { text: response.data.answer, sender: 'bot' }
                ]);
                setInput('');
            } catch (error) {
                console.error('Error sending message:', error);
                setMessages([...messages, 
                    { text: input, sender: 'user' }, 
                    { text: "Sorry, there was an error processing your message.", sender: 'bot' }
                ]);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl h-[70vh] relative">
                {/* Chat messages container */}
                <div className="h-[calc(100%-80px)] overflow-y-auto mb-2 font-fira">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`mb-4 p-4 rounded-lg ${
                                message.sender === 'user' 
                                    ? 'bg-black text-white ml-auto border border-white' 
                                    : 'bg-black-100 text-black'
                            } max-w-[80%] ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                        >
                            {message.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-center items-center mb-4">
                            <motion.div
                                className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    )}
                </div>

                {/* Input form */}
                <form 
                    onSubmit={handleSubmit}
                    className="absolute bottom-0 left-0 right-0 flex justify-center"
                >
                    <div className="w-full max-w-2xl flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={sessionId ? "Type your message..." : "Upload a PDF to start chatting..."}
                            className="w-full p-4 border-2 border-white bg-black text-white rounded-lg font-fira focus:outline-none focus:border-black-500 placeholder-black-400"
                            disabled={isLoading || !sessionId}
                        />
                        <button 
                            type="submit"
                            className={`px-6 py-4 bg-white text-black rounded-lg font-fira transition-colors ${
                                isLoading || !sessionId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black-200'
                            }`}
                            disabled={isLoading || !sessionId}
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Chat;