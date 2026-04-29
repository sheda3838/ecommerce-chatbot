import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, User } from 'lucide-react';

const AdminChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/chats')
      .then(res => res.json())
      .then(data => {
        // Group chats by session token
        const grouped = data.reduce((acc, chat) => {
          if (!acc[chat.session]) {
            acc[chat.session] = {
              token: chat.session,
              messages: [],
              lastActive: chat.timestamp
            };
          }
          acc[chat.session].messages.push(chat);
          return acc;
        }, {});
        
        // Sort sessions by last active
        const sorted = Object.values(grouped).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
        setChats(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500 font-bold">Loading Chat Sessions...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <MessageSquare size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Customer Conversations</h1>
          <p className="text-sm text-gray-500 font-medium">Grouped by session token</p>
        </div>
      </div>

      <div className="space-y-6">
        {chats.map((session) => (
          <div key={session.token} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center px-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-mono text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  SESSION ID: {session.token}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                <Calendar size={14} />
                {new Date(session.lastActive).toLocaleString()}
              </span>
            </div>
            
            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto bg-white/50">
              {session.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                        {msg.role === 'user' ? 'Customer' : 'Mia AI'}
                      </span>
                      <span className="text-[10px] opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {chats.length === 0 && (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-bold">No conversations found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChats;
