"use client";

import { useState } from 'react';
import useSWR from 'swr';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';
import { MessageSquare, RefreshCw, Send, Paperclip } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Chat {
  id: number;
  message: string;
  sender: string;
  timestamp: string;
  fileUrl?: string;
}

export default function ChatsPage() {
  const { data: chats, error, isLoading } = useSWR<Chat[]>('/api/chats', fetcher, {
    refreshInterval: 3000 // Poll every 3s for now (until Socket.io)
  });

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Group chats by sender for the sidebar list
  const users = Array.from(new Set(chats?.map(c => c.sender))).filter(u => u !== 'OpenBrain');

  // Filter messages for the active conversation
  const activeChats = selectedUser
    ? chats?.filter(c => c.sender === selectedUser || c.sender === 'OpenBrain').reverse()
    : [];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <Sidebar />

      {/* Chat Sidebar (Contacts) */}
      <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900/50">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-lg">Chats</h2>
          <button className="p-2 hover:bg-gray-800 rounded-full text-gray-400">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="text-center p-4 text-gray-500 text-sm">Cargando chats...</div>
          ) : users.length === 0 ? (
            <div className="text-center p-4 text-gray-500 text-sm">No hay conversaciones recientes.</div>
          ) : (
            users.map(user => (
              <button
                key={user}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${selectedUser === user ? 'bg-blue-600/20 border border-blue-600/30' : 'hover:bg-gray-800'
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                  {user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{user}</h3>
                  <p className="text-xs text-gray-400 truncate">
                    {chats?.find(c => c.sender === user)?.message || 'Click para ver'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950/50">
        {selectedUser ? (
          <>
            {/* Header */}
            <header className="p-4 border-b border-gray-800 flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">
                {selectedUser[0]}
              </div>
              <div>
                <h2 className="font-bold">{selectedUser}</h2>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online (via WhatsApp)
                </span>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChats?.map((chat) => {
                const isMe = chat.sender === 'OpenBrain';
                return (
                  <div key={chat.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none'
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                      <span className="text-[10px] opacity-50 block text-right mt-1">
                        {format(new Date(chat.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area (Read Only for now) */}
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 opacity-50 cursor-not-allowed">
                <Paperclip size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Responder desde OpenBrain (Próximamente)..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-300"
                  disabled
                />
                <button className="p-2 bg-blue-600 rounded-full text-white">
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-center text-gray-600 mt-2">
                Solo lectura. Responde desde WhatsApp para ver tus mensajes aquí.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Selecciona una conversación para empezar</p>
          </div>
        )}
      </div>
    </div>
  );
}
