import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_ANNOUNCEMENTS, MOCK_RECOGNITIONS, MOCK_VALUES, MOCK_USERS } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import { CompassionIcon, InnovationIcon, TeamworkIcon } from './ui/icons/Icon';

interface TeamProps {
  user: User;
}

const ValueIcon: React.FC<{ valueName: string; className: string }> = ({ valueName, className }) => {
    switch(valueName) {
        case 'Compassion': return <CompassionIcon className={className} />;
        case 'Innovation': return <InnovationIcon className={className} />;
        case 'Teamwork': return <TeamworkIcon className={className} />;
        default: return null;
    }
}


const Team: React.FC<TeamProps> = ({ user }) => {
  const [recognitions, setRecognitions] = useState(MOCK_RECOGNITIONS);

  const handleSubmitRecognition = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const to = formData.get('to') as string;
      const valueId = formData.get('value') as string;
      const message = formData.get('message') as string;
      
      if (!to || !valueId || !message) {
          alert("Please complete all fields for recognition.");
          return;
      }

      const newRecognition = {
          id: `r-${new Date().getTime()}`,
          from: user.name,
          to: MOCK_USERS.find(u => u.id === to)?.name || 'Unknown',
          message,
          date: new Date().toISOString().split('T')[0],
          valueId
      };
      setRecognitions(prev => [newRecognition, ...prev]);
      e.currentTarget.reset();
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Team Hub</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card title="Recognition Feed">
                <ul className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {recognitions.map(rec => {
                        const value = MOCK_VALUES.find(v => v.id === rec.valueId);
                        const valueColor = value?.color || 'gray';
                        
                        const bgClass = { blue: 'bg-blue-50 dark:bg-blue-900/50', purple: 'bg-purple-50 dark:bg-purple-900/50', green: 'bg-green-50 dark:bg-green-900/50', gray: 'bg-gray-50 dark:bg-gray-700'}[valueColor];
                        const borderClass = { blue: 'border-blue-500', purple: 'border-purple-500', green: 'border-green-500', gray: 'border-gray-500'}[valueColor];
                        const iconBgClass = { blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', gray: 'bg-gray-500'}[valueColor];
                        const textClass = { blue: 'text-blue-600 dark:text-blue-300', purple: 'text-purple-600 dark:text-purple-300', green: 'text-green-600 dark:text-green-300', gray: 'text-gray-600'}[valueColor];

                        return (
                            <li key={rec.id} className={`p-4 rounded-lg border-l-4 ${borderClass} ${bgClass}`}>
                                <div className="flex items-start space-x-3">
                                    <div className={`flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center ${iconBgClass} text-white`}>
                                        {value && <ValueIcon valueName={value.name} className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-brand-dark dark:text-dark-text">
                                            {rec.from} recognized {rec.to} for <span className={`font-bold ${textClass}`}>{value?.name}</span>
                                        </p>
                                        <p className="mt-1 text-gray-700 dark:text-dark-text-secondary">"{rec.message}"</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{rec.date}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </Card>
            <Card title="Announcements">
                <ul className="space-y-5">
                    {MOCK_ANNOUNCEMENTS.map(ann => (
                        <li key={ann.id}>
                            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{ann.date} - {ann.author}</p>
                            <p className="font-semibold text-lg text-brand-dark dark:text-dark-text mt-1">{ann.title}</p>
                            <p className="text-gray-600 dark:text-dark-text-secondary mt-1">{ann.content}</p>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
        <div className="space-y-8">
            <Card title="Give Recognition">
                <form className="space-y-4" onSubmit={handleSubmitRecognition}>
                    <div>
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Recognize (To)</label>
                        <select id="to" name="to" className="bg-gray-100 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                            {MOCK_USERS.filter(u => u.id !== user.id).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">For (Value)</label>
                        <select id="value" name="value" className="bg-gray-100 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                           {MOCK_VALUES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Message</label>
                        <textarea id="message" name="message" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"></textarea>
                    </div>
                    <Button type="submit" className="w-full">Submit Kudos</Button>
                </form>
            </Card>
            <Card title="Suggestion Box">
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">Have an idea to improve our practice? Share it here. Submissions can be anonymous.</p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 dark:bg-yellow-900/50 dark:border-yellow-600">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <span className="font-bold">Important:</span> Do not include any Patient Health Information (PHI) in your suggestions.
                    </p>
                </div>
                <form className="space-y-4">
                    <textarea 
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
                        placeholder="Describe your suggestion..."
                    ></textarea>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input id="anonymous" type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900 dark:text-dark-text">Submit Anonymously</label>
                        </div>
                        <Button type="submit">Submit Idea</Button>
                    </div>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Team;
