import { useState } from 'react';
import { Search, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { NotificationSystem } from './NotificationSystem';

interface ChatScreenProps {
  selectedChatId?: string | null;
  onBack?: () => void;
}

const mockChats = [
  {
    id: '1',
    name: 'Alex Chen',
    lastMessage: 'See you at the court tomorrow!',
    time: '2m ago',
    unread: 2,
    verified: true,
    type: 'game',
    gameName: 'Morning Basketball',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    lastMessage: 'What time does the game start?',
    time: '15m ago',
    unread: 0,
    verified: true,
    type: 'game',
    gameName: 'Beach Volleyball',
  },
  {
    id: '3',
    name: 'Thunder Squad',
    lastMessage: 'Great game everyone! 🏆',
    time: '1h ago',
    unread: 5,
    verified: false,
    type: 'team',
    gameName: null,
  },
  {
    id: '4',
    name: 'Mike Johnson',
    lastMessage: 'Thanks for joining!',
    time: '2h ago',
    unread: 0,
    verified: false,
    type: 'game',
    gameName: 'Elite Football Match',
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'Alex Chen',
    message: 'Hey! Thanks for joining the game.',
    time: '10:30 AM',
    isMe: false,
  },
  {
    id: '2',
    sender: 'Me',
    message: 'No problem! Looking forward to it.',
    time: '10:32 AM',
    isMe: true,
  },
  {
    id: '3',
    sender: 'Alex Chen',
    message: 'See you at the court tomorrow!',
    time: '10:35 AM',
    isMe: false,
  },
];

export function ChatScreen({ selectedChatId, onBack }: ChatScreenProps) {
  const [activeChat, setActiveChat] = useState<string | null>(selectedChatId || null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChat = mockChats.find(chat => chat.id === activeChat);

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeChat && selectedChat) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setActiveChat(null)}
              className="text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarFallback className="bg-blue-200 text-blue-700">
                {selectedChat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white">{selectedChat.name}</h2>
                {selectedChat.verified && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
              {selectedChat.gameName && (
                <p className="text-white/80 text-xs">{selectedChat.gameName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.isMe
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                {!msg.isMe && (
                  <p className="text-xs opacity-70 mb-1">{msg.sender}</p>
                )}
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.isMe ? 'text-white/70' : 'text-gray-500'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border-gray-300"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  setMessage('');
                }
              }}
            />
            <Button
              size="icon"
              className="rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              onClick={() => {
                if (message.trim()) {
                  setMessage('');
                }
              }}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-2xl">Messages</h1>
          <NotificationSystem unreadCount={3} />
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="pl-12 h-12 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 -mt-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-white rounded-2xl shadow-lg shadow-gray-200/50 h-12 p-1 mb-4">
            <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
            <TabsTrigger value="games" className="rounded-xl">Games</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-xl">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 mt-0">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className="w-full bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 flex items-center gap-3 hover:shadow-xl transition-shadow"
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-200 text-blue-700">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900">{chat.name}</p>
                    {chat.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                    {chat.type === 'team' && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">Team</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">{chat.time}</p>
                  {chat.unread > 0 && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{chat.unread}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="games" className="space-y-2 mt-0">
            {filteredChats.filter(chat => chat.type === 'game').map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className="w-full bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 flex items-center gap-3 hover:shadow-xl transition-shadow"
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-200 text-blue-700">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900">{chat.name}</p>
                    {chat.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{chat.time}</p>
                </div>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="teams" className="space-y-2 mt-0">
            {filteredChats.filter(chat => chat.type === 'team').map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className="w-full bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 flex items-center gap-3 hover:shadow-xl transition-shadow"
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-purple-200 text-purple-700">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900">{chat.name}</p>
                    <Badge className="bg-purple-100 text-purple-700 text-xs">Team</Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">{chat.time}</p>
                  {chat.unread > 0 && (
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{chat.unread}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}