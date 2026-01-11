import React, { useState } from 'react';
import { User } from '../types';
import { AI_INSIGHTS } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';

interface AIAssistantProps {
  user: User;
}

type InsightKey = keyof typeof AI_INSIGHTS;

const AIAssistant: React.FC<AIAssistantProps> = ({ user }) => {
  const [selectedTopic, setSelectedTopic] = useState<InsightKey>('Task Completion Efficiency');
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<{title: string, content: string, recommendations: string[]} | null>(null);

  const handleGenerate = () => {
    setIsLoading(true);
    setInsight(null);
    setTimeout(() => {
      setInsight(AI_INSIGHTS[selectedTopic]);
      setIsLoading(false);
    }, 1500); // Simulate API call latency
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">AI-Powered Workflow Assistant</h2>
      
      <div className="bg-blue-50 border-l-4 border-brand-primary p-4 rounded-r-lg dark:bg-blue-900/50 dark:border-blue-500">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-bold">HIPAA Compliance Commitment:</span> This tool analyzes <span className="font-semibold">anonymized, non-PHI operational data</span> (like task completion times and project durations) to identify patterns and suggest efficiency improvements. No patient information is ever accessed or processed by the AI.
            </p>
          </div>
        </div>
      </div>
      
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Select an area for analysis:</label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value as InsightKey)}
              className="bg-gray-100 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
            >
              <option value="Task Completion Efficiency">Task Completion Efficiency</option>
              <option value="Team Collaboration Patterns">Team Collaboration Patterns</option>
            </select>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="self-end">
            {isLoading ? 'Analyzing...' : 'Generate Insights'}
          </Button>
        </div>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-dark-text-secondary">Analyzing anonymized data...</p>
        </div>
      )}

      {insight && (
        <Card title={insight.title}>
            <div className="prose dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-dark-text-secondary prose-h4:dark:text-dark-text">
                <p>{insight.content}</p>
                <h4 className="font-semibold mt-4">Recommendations:</h4>
                <ul>
                    {insight.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </div>
        </Card>
      )}

    </div>
  );
};

export default AIAssistant;