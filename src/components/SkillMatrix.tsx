import React, { useState, useMemo } from 'react';
import { User, SkillGap, TeamMemberSkill } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Icon } from './ui/icons/Icon';
import { MOCK_SKILLS, MOCK_TEAM_SKILLS } from '../constants';
import Breadcrumbs from './ui/Breadcrumbs';
import { View } from '../types';

interface SkillMatrixProps {
  user: User;
  setActiveView: (view: View) => void;
}

export const SkillMatrix: React.FC<SkillMatrixProps> = ({ user, setActiveView }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'gaps' | 'development'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMemberSkill | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'list'>('heatmap');

  // Check if user has manager access
  const hasAccess = user.role === 'Admin' || user.role === 'Manager';

  const categories = useMemo(() => ['all', ...new Set(MOCK_SKILLS.map(s => s.category))], []);

  const filteredSkills = useMemo(
    () =>
      selectedCategory === 'all'
        ? MOCK_SKILLS
        : MOCK_SKILLS.filter(s => s.category === selectedCategory),
    [selectedCategory]
  );

  const getProficiencyColor = (level: number) => {
    if (level === 0) return 'bg-bg-secondary dark:bg-dark-card border border-border-light';
    if (level === 1) return 'bg-status-error/10 border border-status-error/20';
    if (level === 2) return 'bg-status-warning/10 border border-status-warning/20';
    if (level === 3) return 'bg-status-info/10 border border-status-info/20';
    if (level === 4) return 'bg-action-secondary/10 border border-action-secondary/20';
    return 'bg-status-success/10 border border-status-success/20';
  };

  const getProficiencyLabel = (level: number) => {
    const labels = ['None', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level] || 'Unknown';
  };

  const getTeamAverage = (skillId: string) => {
    const skillLevels = MOCK_TEAM_SKILLS.map(
      m => m.skills.find(s => s.skillId === skillId)?.proficiency || 0
    );
    return skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length;
  };

  const skillGaps = useMemo((): SkillGap[] => {
    const criticalSkills = MOCK_SKILLS.filter(s => s.criticalLevel === 'critical');
    const gaps: SkillGap[] = [];

    criticalSkills.forEach(skill => {
      const requiredLevel = 4; // Required level for critical skills
      const teamAvg = getTeamAverage(skill.id);
      const gap = requiredLevel - teamAvg;

      if (gap > 0.5) {
        const affectedMembers = MOCK_TEAM_SKILLS.filter(m => {
          const memberSkill = m.skills.find(s => s.skillId === skill.id);
          return !memberSkill || memberSkill.proficiency < requiredLevel;
        }).map(m => m.memberName);

        gaps.push({
          skillId: skill.id,
          skillName: skill.name,
          requiredLevel,
          teamAverage: parseFloat(teamAvg.toFixed(1)),
          gap: parseFloat(gap.toFixed(1)),
          affectedMembers,
        });
      }
    });

    return gaps.sort((a, b) => b.gap - a.gap);
  }, []);

  const overallStats = useMemo(() => {
    let totalProficiency = 0;
    let totalSkills = 0;
    let verified = 0;
    let total = 0;

    MOCK_TEAM_SKILLS.forEach(member => {
      member.skills.forEach(skill => {
        totalProficiency += skill.proficiency;
        totalSkills++;
        if (skill.proficiency > 0) {
          total++;
          if (skill.verified) verified++;
        }
      });
    });

    return {
      proficiency: ((totalProficiency / totalSkills) * 20).toFixed(0), // Convert to percentage
      verified,
      total,
    };
  }, []);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card variant="bordered" className="p-8 text-center max-w-md">
          <Icon name="lock" size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Skill Matrix is only available to managers and administrators.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Team' }, { label: 'Skill Matrix' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-action-primary via-action-secondary to-focus-ring p-8 text-text-inverse shadow-lg">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="grid-3x3" size={32} />
            <h1 className="text-2xl font-bold">Team Skill Matrix</h1>
          </div>
          <p className="text-white/80 mb-6">
            Visualize and manage your team&apos;s skills and competencies
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{MOCK_TEAM_SKILLS.length}</div>
              <div className="text-sm text-white/80">Team Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{MOCK_SKILLS.length}</div>
              <div className="text-sm text-white/80">Skills Tracked</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{overallStats.proficiency}%</div>
              <div className="text-sm text-white/80">Team Proficiency</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{skillGaps.length}</div>
              <div className="text-sm text-white/80">Skill Gaps</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'matrix', label: 'Skill Matrix', icon: 'grid-3x3' },
          { id: 'gaps', label: 'Skill Gaps', icon: 'alert-triangle' },
          { id: 'development', label: 'Development Plans', icon: 'trending-up' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-action-primary text-action-primary'
                : 'border-transparent text-text-tertiary hover:text-text-primary dark:text-dark-text-secondary'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-action-primary/10 text-action-primary border border-action-primary/20'
                      : 'bg-bg-secondary text-text-secondary hover:bg-border-light dark:bg-dark-card dark:text-dark-text-secondary'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'heatmap' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('heatmap')}
              >
                <Icon name="grid-3x3" size={16} className="mr-1" />
                Heatmap
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <Icon name="list" size={16} className="mr-1" />
                List
              </Button>
            </div>
          </div>

          {/* Heatmap View */}
          {viewMode === 'heatmap' && (
            <Card variant="bordered" className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-900 z-10">
                      Team Member
                    </th>
                    {filteredSkills.map(skill => (
                      <th
                        key={skill.id}
                        className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                        title={skill.description}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{skill.name}</span>
                          {skill.criticalLevel === 'critical' && (
                            <span
                              className="w-2 h-2 rounded-full bg-red-500"
                              title="Critical skill"
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TEAM_SKILLS.map(member => (
                    <tr
                      key={member.memberId}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="p-3 sticky left-0 bg-white dark:bg-gray-900 z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-action-primary to-action-secondary flex items-center justify-center text-text-inverse text-sm font-medium">
                            {member.memberName
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {member.memberName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {member.memberTitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      {filteredSkills.map(skill => {
                        const memberSkill = member.skills.find(s => s.skillId === skill.id);
                        const proficiency = memberSkill?.proficiency || 0;

                        return (
                          <td key={skill.id} className="p-2 text-center">
                            <div
                              className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center ${getProficiencyColor(proficiency)} transition-colors`}
                              title={`${skill.name}: ${getProficiencyLabel(proficiency)}`}
                            >
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {proficiency}
                              </span>
                              {memberSkill?.verified && (
                                <Icon
                                  name="check-circle"
                                  size={10}
                                  className="absolute -top-1 -right-1 text-green-500"
                                />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Team Average Row */}
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-3 sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-10">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        Team Average
                      </p>
                    </td>
                    {filteredSkills.map(skill => {
                      const avg = getTeamAverage(skill.id);
                      return (
                        <td key={skill.id} className="p-2 text-center">
                          <div
                            className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center ${getProficiencyColor(Math.round(avg))} transition-colors`}
                          >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {avg.toFixed(1)}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </Card>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_TEAM_SKILLS.map(member => (
                <Card
                  key={member.memberId}
                  variant="bordered"
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-action-primary to-action-secondary flex items-center justify-center text-text-inverse font-medium">
                      {member.memberName
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {member.memberName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {member.memberTitle}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Top Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.skills
                        .filter(s => s.proficiency >= 4)
                        .slice(0, 5)
                        .map(skill => {
                          const skillDef = MOCK_SKILLS.find(d => d.id === skill.skillId);
                          return (
                            <span
                              key={skill.skillId}
                              className="px-2 py-1 bg-action-primary/10 text-action-primary dark:text-action-primary rounded text-xs border border-action-primary/20"
                            >
                              {skillDef?.name}
                            </span>
                          );
                        })}
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{member.skills.filter(s => s.verified).length} verified skills</span>
                        <span>
                          Avg:{' '}
                          {(
                            member.skills.reduce((a, b) => a + b.proficiency, 0) /
                            member.skills.length
                          ).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Legend */}
          <Card variant="bordered" className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Proficiency Legend
            </h3>
            <div className="flex flex-wrap gap-4">
              {[0, 1, 2, 3, 4, 5].map(level => (
                <div key={level} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded ${getProficiencyColor(level)}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {level} - {getProficiencyLabel(level)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Skill Gaps Tab */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          {/* Gap Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="bordered" className="p-4 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Icon name="alert-circle" size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {skillGaps.filter(g => g.gap > 2).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Critical Gaps</p>
                </div>
              </div>
            </Card>
            <Card variant="bordered" className="p-4 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Icon name="alert-triangle" size={20} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {skillGaps.filter(g => g.gap > 1 && g.gap <= 2).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Moderate Gaps</p>
                </div>
              </div>
            </Card>
            <Card variant="bordered" className="p-4 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Icon name="check-circle" size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overallStats.verified}/{overallStats.total}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Verified Skills</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Gap Details */}
          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Critical Skill Gaps
            </h2>
            {skillGaps.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Icon name="check-circle" size={48} className="mx-auto mb-2 text-green-500" />
                <p>No critical skill gaps identified!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {skillGaps.map(gap => (
                  <div key={gap.skillId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {gap.skillName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {gap.affectedMembers.length} team member(s) below required level
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gap.gap > 2
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        Gap: {gap.gap}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Team Average: {gap.teamAverage}</span>
                          <span>Required: {gap.requiredLevel}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${(gap.teamAverage / gap.requiredLevel) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {gap.affectedMembers.map(member => (
                        <span
                          key={member}
                          className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recommendations */}
          <Card
            variant="bordered"
            className="p-6 bg-gradient-to-r from-bg-secondary to-bg-primary dark:from-dark-card dark:to-dark-bg"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-action-secondary/10 dark:bg-action-secondary/20 flex items-center justify-center">
                <Icon name="lightbulb" size={20} className="text-action-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  AI Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>
                    • Consider enrolling Maria Garcia and James Wilson in AWS certification training
                  </li>
                  <li>• System Design mentorship program would benefit 3 team members</li>
                  <li>
                    • Cross-training between Emily Chen (DevOps) and frontend team could close
                    multiple gaps
                  </li>
                </ul>
                <Button variant="secondary" size="sm" className="mt-4">
                  <Icon name="sparkles" size={16} className="mr-2" />
                  Generate Development Plan
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Development Plans Tab */}
      {activeTab === 'development' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Development Plans
            </h2>
            <Button>
              <Icon name="plus" size={18} className="mr-2" />
              Create Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_TEAM_SKILLS.slice(0, 4).map(member => (
              <Card key={member.memberId} variant="bordered" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-action-primary to-action-secondary flex items-center justify-center text-text-inverse font-medium">
                    {member.memberName
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {member.memberName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.memberTitle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Current Focus
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">AWS Fundamentals</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Next Milestone
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        System Design Workshop
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Mar 2024</span>
                  </div>
                </div>

                <Button variant="secondary" className="w-full mt-4">
                  View Full Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMember(null)}
          title={selectedMember.memberName}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium">
                {selectedMember.memberName
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedMember.memberName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedMember.memberTitle}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Skills Assessment</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedMember.skills
                  .sort((a, b) => b.proficiency - a.proficiency)
                  .map(skill => {
                    const skillDef = MOCK_SKILLS.find(d => d.id === skill.skillId);
                    return (
                      <div
                        key={skill.skillId}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {skillDef?.name}
                          </span>
                          {skill.verified && (
                            <Icon name="check-circle" size={14} className="text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(level => (
                              <div
                                key={level}
                                className={`w-4 h-4 rounded ${
                                  level <= skill.proficiency
                                    ? 'bg-violet-500'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 w-20">
                            {getProficiencyLabel(skill.proficiency)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary" className="flex-1">
                <Icon name="edit" size={16} className="mr-2" />
                Edit Skills
              </Button>
              <Button className="flex-1">
                <Icon name="file-text" size={16} className="mr-2" />
                Development Plan
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SkillMatrix;
