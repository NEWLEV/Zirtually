import React from 'react';
import { User } from '../types';
import { MOCK_JOURNEY_MILESTONES } from '../constants';
import Card from './ui/Card';

interface MyJourneyProps {
  user: User;
}

const MilestoneIcon: React.FC<{ icon: string; }> = ({ icon }) => {
    const icons = {
        promotion: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
        certification: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
        project: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
        start: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18" /></svg>,
    };

    const colors = {
        promotion: 'bg-green-500',
        certification: 'bg-blue-500',
        project: 'bg-purple-500',
        start: 'bg-gray-500'
    }

    return (
        <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full ${colors[icon as keyof typeof colors]}`}>
            {icons[icon as keyof typeof icons]}
        </div>
    );
};

const MyJourney: React.FC<MyJourneyProps> = ({ user }) => {
  // In a real app, you would fetch milestones for the current user
  const journeyMilestones = MOCK_JOURNEY_MILESTONES;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">My Journey</h2>
      <Card>
        <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-brand-dark dark:text-dark-text">Career Timeline for {user.name}</h3>
            <p className="text-gray-500 dark:text-dark-text-secondary mt-1">A visual history of your key moments and achievements at the practice.</p>
        </div>
        <div className="relative wrap overflow-hidden p-10 h-full">
          <div className="border-2-2 absolute border-opacity-20 border-gray-700 dark:border-gray-500 h-full border" style={{left: '50%'}}></div>
          
          {journeyMilestones.map((milestone, index) => (
            <div key={milestone.id} className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}>
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white"></h1>
              </div>
              <div className="order-1 bg-white dark:bg-dark-border rounded-lg shadow-xl w-5/12 px-6 py-4">
                 <div className="flex items-center space-x-4">
                    <MilestoneIcon icon={milestone.icon} />
                    <div>
                        <p className="text-sm font-medium text-brand-primary">{new Date(milestone.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <h4 className="font-bold text-gray-800 dark:text-dark-text text-lg">{milestone.title}</h4>
                    </div>
                 </div>
                <p className="text-sm leading-snug tracking-wide text-gray-600 dark:text-dark-text-secondary text-opacity-100 mt-3">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MyJourney;