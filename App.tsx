
import React, { useState, useEffect, useRef } from 'react';
import { GamePhase, Message } from './types';
import { getHostResponse } from './services/geminiService';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.WELCOME);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      const welcome = await getHostResponse([]);
      setMessages([{ role: 'host', text: welcome, timestamp: new Date() }]);
      setIsLoading(false);
    };
    initGame();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: inputText, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    // Format history for Gemini
    const history = updatedMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getHostResponse(history);
    
    setMessages(prev => [...prev, {
      role: 'host',
      text: responseText,
      timestamp: new Date()
    }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl flex flex-col h-[90vh] game-card rounded-3xl overflow-hidden shadow-2xl relative z-10">
        
        {/* Header */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(250,204,21,0.5)] float-anim">
              🕺
            </div>
            <div>
              <h1 className="text-xl font-black text-white">المقدم المرح</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs text-white/60 font-medium">بث مباشر من ستوديو الضحك</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-yellow-400 border border-yellow-400/30">
              {phase === GamePhase.WELCOME ? '✨ البداية' : '🎮 جاري اللعب'}
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="host-bubble p-4 rounded-2xl rounded-tr-none shadow-lg animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-sm font-bold ml-2 italic">المقدم يجهز النكتة القادمة...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Footer / Input */}
        <footer className="p-6 bg-white/5 border-t border-white/10">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب ردك هنا بحماس... 🚀"
              disabled={isLoading}
              className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-4 px-6 pl-16 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-all text-lg"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute left-2 top-2 bottom-2 w-12 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-gray-900 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-white/40">
             لعبة تفاعلية ممتعة - صُنعت بكل حب لزرع الابتسامة ✨
          </p>
        </footer>
      </div>

      {/* Decorative Stage Lights */}
      <div className="hidden lg:block fixed left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400/0 via-yellow-400/20 to-yellow-400/0"></div>
      <div className="hidden lg:block fixed right-10 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400/0 via-yellow-400/20 to-yellow-400/0"></div>
    </div>
  );
};

export default App;
