import React, { useState, useRef, useEffect } from 'react';
import { User, View } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import { AIIcon, SparklesIcon } from './ui/icons/Icon';
import { MANAGER_NUDGES } from '../constants';

interface AIAssistantProps {
  user: User;
  setActiveView?: (view: View) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ user, setActiveView: _setActiveView }) => {
  const { config } = useIndustry();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name.split(' ')[0]}! I'm your AI assistant. I can help you with questions about HR policies, benefits, onboarding, performance reviews, and more. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    'How do I request time off?',
    'What are my current goals?',
    'Explain my benefits package',
    'What training is available?',
    'How do performance reviews work?',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'time off': `To request time off, navigate to the "Time Off" section in the sidebar. Click "New Request" and select your dates, type of leave, and add any notes. Your request will be sent to your manager for approval. You currently have 15 vacation days and 5 sick days available.`,
        goals: `Your current goals can be found in the "Goals" section. You have 3 active goals this quarter. Based on your progress, you're on track to complete 2 of them. Would you like me to show you specific recommendations to help you achieve your goals?`,
        benefits: `Your benefits package includes: Health insurance (PPO plan with $500 deductible), dental and vision coverage, 401(k) with 4% company match, $50,000 life insurance, and access to our Employee Assistance Program. Open enrollment is coming up in March.`,
        training: `Based on your role and career path, I recommend these training modules: "Advanced ${config.terminology.workspace} Skills", "Leadership Fundamentals", and "${config.complianceModules[0]}". You have 2 required trainings due this month.`,
        performance: `Performance reviews at our company are conducted quarterly. Your next review is scheduled for March 15th. I recommend preparing by updating your goal progress, gathering feedback from peers, and documenting your key achievements.`,
      };

      let response = "I'd be happy to help with that! ";
      const inputLower = input.toLowerCase();

      for (const [key, value] of Object.entries(responses)) {
        if (inputLower.includes(key)) {
          response = value;
          break;
        }
      }

      if (response === "I'd be happy to help with that! ") {
        response += `That's a great question. Based on our ${config.terminology.workspace} policies and your role as ${user.title}, I can provide guidance on that. Would you like me to connect you with HR for more detailed information, or would you prefer to explore the relevant documentation in the Document Management section?`;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  // Inline AI insights data
  const aiInsights = [
    {
      id: '1',
      title: 'Complete Your Profile',
      description: 'Adding skills and bio can improve recommendation accuracy',
      priority: 'low',
      actionLabel: 'Update Profile',
    },
    {
      id: '2',
      title: 'Upcoming Training Due',
      description: 'You have 2 mandatory trainings due this month',
      priority: 'medium',
      actionLabel: 'View Trainings',
    },
    {
      id: '3',
      title: 'Goal Progress Update',
      description: 'Your Q1 goals are 75% complete - great work!',
      priority: 'low',
      actionLabel: 'Review Goals',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
              <AIIcon className="w-6 h-6" />
            </div>
            AI Assistant
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Get instant answers and personalized insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="w-4 h-4 text-violet-500" />
                        <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                          Zirtually AI
                        </span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user'
                          ? 'text-white/60'
                          : 'text-gray-400 dark:text-slate-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4 text-violet-500" />
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                  Suggested questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(question)}
                      className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Insights & Nudges Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card variant="glass">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-violet-500" />
              AI Insights
            </h3>
            <div className="space-y-3">
              {aiInsights.slice(0, 3).map(insight => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-xl border ${
                    insight.priority === 'high'
                      ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20'
                      : insight.priority === 'medium'
                        ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    {insight.description}
                  </p>
                  {insight.actionLabel && (
                    <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2 hover:underline">
                      {insight.actionLabel} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Manager Nudges */}
          {(user.role === 'Admin' || user.role === 'Manager') && (
            <Card variant="glass">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Manager Nudges
              </h3>
              <div className="space-y-3">
                {MANAGER_NUDGES.slice(0, 3).map(nudge => (
                  <div
                    key={nudge.id}
                    className="p-3 rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50 dark:bg-violet-900/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {nudge.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          {nudge.suggestion}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          nudge.urgency === 'high'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : nudge.urgency === 'medium'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
                        }`}
                      >
                        {nudge.urgency}
                      </span>
                    </div>
                    <button className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-2 hover:underline">
                      Take action →
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                📋 Generate Report
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                📊 Analyze Team Performance
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                📝 Draft Feedback
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                🎯 Suggest Goals
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
