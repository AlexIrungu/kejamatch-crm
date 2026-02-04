import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, Loader2, User, ArrowLeft } from 'lucide-react';
import clientService from '../../services/clientService';
import { usePusher, useTypingIndicator } from '../../hooks/usePusher';
import { usePusherContext } from '../../contexts/PusherContext';

const MessagesTab = ({ client }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentUserId = client?._id || client?.id;
  const { isConnected } = usePusherContext();

  // Real-time message handler
  const handleNewMessage = useCallback((data) => {
    if (activeConv && data.message.senderId === activeConv.partnerId) {
      setMessages((prev) => [...prev, data.message]);
    }
    // Refresh conversations list for unread count
    fetchConversations();
  }, [activeConv]);

  // Subscribe to real-time messages via Pusher
  usePusher('new_message', handleNewMessage);

  // Typing indicators
  const { startTyping, stopTyping } = useTypingIndicator(activeConv?.partnerId);

  usePusher('user_typing', useCallback((data) => {
    if (activeConv && data.senderId === activeConv.partnerId) {
      setPartnerTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setPartnerTyping(false), 3000);
    }
  }, [activeConv]));

  usePusher('user_stop_typing', useCallback((data) => {
    if (activeConv && data.senderId === activeConv.partnerId) {
      setPartnerTyping(false);
    }
  }, [activeConv]));

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await clientService.getConversations();
      setConversations(res.data || []);

      // If client has an assigned agent, auto-start conversation
      if (client?.assignedAgent && res.data?.length === 0) {
        setActiveConv({
          partnerId: client.assignedAgent,
          partnerName: 'Your Agent',
          partnerType: 'agent'
        });
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setMessages([]);
    try {
      const res = await clientService.getConversation(conv.partnerId);
      setMessages(res.data || []);
      await clientService.markAsRead(conv.partnerId);
      // Update unread count in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.partnerId === conv.partnerId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    setSending(true);
    try {
      const res = await clientService.sendMessage(activeConv.partnerId, newMessage.trim());
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
      stopTyping();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  // No assigned agent and no conversations
  if (!client?.assignedAgent && conversations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages Yet</h3>
        <p className="text-gray-500">
          Once an agent is assigned to you, you can message them here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
      <div className="flex h-full">
        {/* Conversations List */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 ${activeConv ? 'hidden md:block' : ''}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Messages</h3>
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 57px)' }}>
            {conversations.length === 0 && client?.assignedAgent ? (
              <button
                onClick={() =>
                  openConversation({
                    partnerId: client.assignedAgent,
                    partnerName: 'Your Agent',
                    partnerType: 'agent'
                  })
                }
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Your Agent</p>
                    <p className="text-sm text-gray-500">Start a conversation</p>
                  </div>
                </div>
              </button>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.partnerId}
                  onClick={() => openConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    activeConv?.partnerId === conv.partnerId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">{conv.partnerName}</p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-secondary text-white rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden md:flex' : ''}`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => setActiveConv(null)}
                  className="md:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activeConv.partnerName}</p>
                  <p className="text-xs text-gray-500 capitalize">{activeConv.partnerType}</p>
                </div>
                {isConnected && (
                  <span className="ml-auto text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Live
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</p>
                )}
                {messages.map((msg) => {
                  const isOwn = msg.senderId === currentUserId;
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-secondary text-white rounded-br-none'
                            : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-KE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing Indicator */}
              {partnerTyping && (
                <div className="px-4 py-2 text-sm text-gray-500 italic">
                  {activeConv.partnerName} is typing...
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
