import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Bot,
  Target,
  BarChart2,
  Mail,
  Phone,
  Database,
  MessageSquare,
  Trophy,
  Shield,
  Lightbulb,
  ArrowLeft,
  Send,
  Paperclip,
  Mic,
  MoreVertical,
  Check,
  X,
  RefreshCw,
  Bell,
  Zap
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Tooltip } from '../components/ui/Tooltip';
import { Dropdown, SelectDropdown } from '../components/ui/Dropdown';

import { mockPulseChannels, getChannelById, mockChannelMessages } from '../data/pulse';
import { PulseChannel, ChatMessage } from '../types';
import { formatRelativeTime, formatTime, classNames, generateId } from '../utils';
import { useToast } from '../components/ui/Toast';

const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Target,
  BarChart2,
  Mail,
  Phone,
  Database
};

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Trophy,
  Shield,
  Lightbulb
};

export function PulseChannel() {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showPinnedCard, setShowPinnedCard] = useState(false);
  const [pinnedAction, setPinnedAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channel = getChannelById(channelId || '');
  const isAgent = channel?.type !== 'channel';

  useEffect(() => {
    if (channelId) {
      const channelMessages = mockChannelMessages[channelId] || [];
      setMessages([...channelMessages]);
      scrollToBottom();
    }
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    const message: ChatMessage = {
      id: generateId('msg-'),
      channelId: channelId || '',
      userId: 'you',
      userName: 'You',
      userAvatar: 'Y',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message',
      isAgent: false
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate agent response for agent channels
    if (isAgent) {
      setTimeout(() => {
        const responses: Record<string, string[]> = {
          'channel-001': [
            'I\'ve analyzed that request. Here\'s what I found...',
            'Based on the data, I recommend focusing on...',
            'Let me pull up the latest information for you.'
          ],
          'channel-002': [
            'For that objection, try saying: "I understand budget is tight..."',
            'The key differentiator here is the regulatory reporting automation.',
            'Consider anchoring on the 3-year value rather than monthly cost.'
          ],
          'channel-003': [
            'Pipeline health looks good. Forecast accuracy at 94%.',
            'Risk deals: Greenfield (CFO), Nordic (Feb 15), Quantum (pricing).',
            'Recommended action: Accelerate Summit & Global Insurance closes.'
          ],
          'channel-004': [
            'Draft updated with personalization for the prospect.',
            'Subject line A/B test: "Quick question" vs "Inventory challenges"',
            'Added case study link and calendar booking link.'
          ],
          'channel-005': [
            'Pre-call brief updated with latest news on the prospect.',
            'Technical questions to prepare for: API limits, SSO, migration.',
            'Battle card for Salesforce displacement ready.'
          ],
          'channel-006': [
            'Logged 3 activities today. 2 records enriched with LinkedIn.',
            'Suggested next actions for 3 stale leads.',
            'Updated 5 contact records with new titles.'
          ]
        };
        
        const agentResponses = responses[channelId || ''] || ['Thanks for your message. I\'ll look into that.'];
        const response = agentResponses[Math.floor(Math.random() * agentResponses.length)];
        
        const agentMessage: ChatMessage = {
          id: generateId('msg-'),
          channelId: channelId || '',
          userId: 'agent',
          userName: channel?.name || 'Agent',
          userAvatar: channel?.icon || 'AI',
          content: response,
          timestamp: new Date().toISOString(),
          type: 'message',
          isAgent: true
        };
        
        setMessages(prev => [...prev, agentMessage]);
        setSending(false);
      }, 1000 + Math.random() * 2000);
    } else {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePinnedAction = (action: string) => {
    setPinnedAction(action);
    setShowPinnedCard(false);
    addToast({
      type: 'success',
      title: 'Action Completed',
      message: `Action "${action}" has been executed.`
    });
  };

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Channel not found</h2>
          <p className="text-gray-500 mt-2">The channel you're looking for doesn't exist.</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/pulse')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pulse
          </Button>
        </div>
      </div>
    );
  }

  const Icon = isAgent ? AGENT_ICONS[channel.icon] : CHANNEL_ICONS[channel.icon];
  const pinnedMessage = messages.find(m => m.type === 'pinned');

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Channel Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white">
        <Button variant="ghost" size="icon" onClick={() => navigate('/pulse')} aria-label="Back to Pulse">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: channel.color + '20' }}>
          <span style={{ color: channel.color }}>
            <Icon className="w-5 h-5" />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 truncate">{channel.name}</h1>
          <p className="text-sm text-gray-500 truncate">{channel.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            {channel.members.length} members
          </Badge>
          {channel.unreadCount > 0 && (
            <Badge variant="danger" size="sm">{channel.unreadCount} unread</Badge>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {/* Pinned Message */}
        {pinnedMessage && !showPinnedCard && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 animate-in slide-in-from-top">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Needs your input</h3>
                  <p className="text-sm text-gray-600 mt-1">{pinnedMessage.content}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowPinnedCard(true)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {pinnedMessage.actions && pinnedMessage.actions.length > 0 && (
              <div className="mt-4 flex gap-2">
                {pinnedMessage.actions.map((action, i) => (
                  <Button key={i} variant="primary" size="sm" onClick={() => handlePinnedAction(action.action)}>
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => {
          const isCurrentUser = message.userId === 'you';
          const showAvatar = index === 0 || messages[index - 1]?.userId !== message.userId;
          const showName = !isCurrentUser && (index === 0 || messages[index - 1]?.userId !== message.userId);
          
          return (
            <div
              key={message.id}
              className={classNames(
                'flex gap-3',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!isCurrentUser && showAvatar && (
                <Avatar name={message.userName} size="sm" />
              )}
              {!isCurrentUser && !showAvatar && (
                <div className="w-8" />
              )}
              <div className={classNames(
                'max-w-[70%] flex flex-col',
                isCurrentUser ? 'items-end' : 'items-start'
              )}>
                {showName && !isCurrentUser && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700">{message.userName}</span>
                    {message.isAgent && (
                      <Badge variant="outline" size="sm">AI</Badge>
                    )}
                    <span className="text-xs text-gray-400">{formatRelativeTime(message.timestamp)}</span>
                  </div>
                )}
                <div className={classNames(
                  'px-4 py-2 rounded-2xl',
                  isCurrentUser
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : message.isAgent
                    ? 'bg-purple-50 text-gray-900 rounded-tl-sm border border-purple-100'
                    : 'bg-gray-100 text-gray-900 rounded-tr-sm'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {!showName && (
                  <span className={classNames('text-xs text-gray-400 mt-1', isCurrentUser ? 'mr-1' : 'ml-1')}>
                    {formatTime(message.timestamp)}
                  </span>
                )}
              </div>
              {isCurrentUser && showAvatar && (
                <Avatar name="You" size="sm" />
              )}
              {isCurrentUser && !showAvatar && (
                <div className="w-8" />
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end gap-3">
          <Button variant="ghost" size="icon" aria-label="Attach file">
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAgent ? 'Ask your AI assistant...' : 'Type a message...'}
              rows={1}
              className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
              style={{ minHeight: '44px' }}
            />
          </div>
          <Button
            variant="primary"
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            aria-label="Send message"
          >
            {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          {isAgent ? 'Press Enter to send • Shift+Enter for new line' : 'Press Enter to send • Shift+Enter for new line'}
        </p>
      </div>
    </div>
  );
}

export default PulseChannel;