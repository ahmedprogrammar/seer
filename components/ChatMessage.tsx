
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isHost = message.role === 'host';

  return (
    <div className={`flex w-full mb-4 ${isHost ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-lg border border-white/10 ${
          isHost 
            ? 'host-bubble rounded-tr-none text-white' 
            : 'user-bubble rounded-tl-none text-white'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">
            {isHost ? '🎙️ المقدم المرح' : '👤 أنت'}
          </span>
        </div>
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className="text-[10px] mt-2 text-right opacity-50">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
