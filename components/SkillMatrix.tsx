import React, { useState, useMemo } from 'react';
import { User, UserRole, Skill, EmployeeSkill, ProficiencyLevel } from '../types';
import { MOCK_USERS, MOCK_SKILLS, MOCK_EMPLOYEE_SKILLS } from '../constants';
import Card from './ui/Card';

interface SkillMatrixProps {
  user: User;
}

const ProficiencyDot: React.FC<{ level: ProficiencyLevel }> = ({ level }) => {
    const levelInfo = {
        1: { color: 'bg-red-400', label: 'Novice' },
        2: { color: 'bg-yellow-400', label: 'Beginner' },
        3: { color: 'bg-blue-400', label: 'Competent' },
        4: { color: 'bg-green-400', label: 'Proficient' },
        5: { color: 'bg-purple-500', label: 'Expert' },
    };
    return (
        <div className="flex justify-center items-center h-full">
            <span 
                className={`h-4 w-4 rounded-full ${levelInfo[level].color}`} 
                title={`${levelInfo[level].label} (Level ${level})`}
            ></span>
        </div>
    );
}

const SkillMatrix: React.FC<SkillMatrixProps> = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const staffMembers = useMemo(() => MOCK_USERS.filter(u => u.role === UserRole.STAFF), []);
  const skillCategories = useMemo(() => ['All', ...Array.from(new Set(MOCK_SKILLS.map(s => s.category)))], []);
  
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return MOCK_SKILLS;
    return MOCK_SKILLS.filter(skill => skill.category === activeCategory);
  }, [activeCategory]);
  
  const employeeSkillData = useMemo(() => {
    return staffMembers.map(employee => {
        const skillsMap = new Map<string, ProficiencyLevel>();
        MOCK_EMPLOYEE_SKILLS
            .filter(es => es.employeeId === employee.id)
            .forEach(es => skillsMap.set(es.skillId, es.proficiency));
        return {
            ...employee,
            skills: skillsMap
        };
    });
  }, [staffMembers]);
  
  if (user.role !== UserRole.MANAGER) {
      return (
          <Card title="Access Denied">
              <p>The Skill Matrix is only available to users with the Manager role.</p>
          </Card>
      );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Team Skill Matrix</h2>
      <Card>
        <div className="flex justify-between items-center mb-4">
            <div>
                 <h3 className="text-xl font-semibold text-brand-dark dark:text-dark-text">Skills Overview</h3>
                 <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Visualize team proficiency across key skills to identify strengths and development opportunities.</p>
            </div>
             <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Filter by category:</span>
                {skillCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${activeCategory === cat ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-dark-text dark:hover:bg-gray-500'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border border dark:border-dark-border">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="sticky left-0 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                            Employee
                        </th>
                        {filteredSkills.map(skill => (
                            <th key={skill.id} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                                {skill.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                    {employeeSkillData.map(employee => (
                        <tr key={employee.id}>
                            <td className="sticky left-0 bg-white dark:bg-dark-card px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="h-10 w-10 rounded-full" src={employee.avatarUrl} alt="" />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text">{employee.name}</div>
                                    </div>
                                </div>
                            </td>
                            {filteredSkills.map(skill => (
                                <td key={skill.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employee.skills.has(skill.id) ? (
                                        <ProficiencyDot level={employee.skills.get(skill.id)!} />
                                    ) : (
                                        <div className="flex justify-center items-center h-full">
                                            <span className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-600" title="Not Rated"></span>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-6 flex justify-center items-center space-x-6 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
            <span className="text-sm font-semibold text-gray-700 dark:text-dark-text">Legend:</span>
            {[
                { level: 1, color: 'bg-red-400', label: 'Novice' },
                { level: 2, color: 'bg-yellow-400', label: 'Beginner' },
                { level: 3, color: 'bg-blue-400', label: 'Competent' },
                { level: 4, color: 'bg-green-400', label: 'Proficient' },
                { level: 5, color: 'bg-purple-500', label: 'Expert' },
            ].map(item => (
                <div key={item.level} className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${item.color}`}></span>
                    <span className="text-xs text-gray-600 dark:text-dark-text-secondary">{item.label}</span>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default SkillMatrix;