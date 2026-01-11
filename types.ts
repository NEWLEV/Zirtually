export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  STAFF = 'Staff',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  isNewHire: boolean;
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface OnboardingTask {
  id: string;
  title: string;
  category: 'IT' | 'HR' | 'Department';
  status: TaskStatus;
  dueDate: string;
  assignedTo: string; // User ID
  priority: Priority;
  estimatedTime: number; // in hours
}

export interface Policy {
    id: string;
    title: string;
    acknowledged: boolean;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    progress: number; // 0-100
    owner: string; // User ID
    isTeamGoal: boolean;
    priority: Priority;
    estimatedTime: number; // in hours
}

export interface TrainingModule {
    id: string;
    title: string;
    type: 'Mandatory' | 'Optional';
    dueDate?: string;
    completed: boolean;
    url: string;
    points: number;
}

export interface LearningResource {
    id: string;
    title: string;
    type: 'Document' | 'Video' | 'Presentation';
    url: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
}

export interface ValueBadge {
    id: string;
    name: 'Compassion' | 'Innovation' | 'Teamwork';
    color: string;
}

export interface Recognition {
    id: string;
    from: string; // User Name
    to: string; // User Name
    message: string;
    date: string;
    valueId: string;
}

export enum View {
    DASHBOARD = 'Dashboard',
    MY_JOURNEY = 'My Journey',
    ONBOARDING = 'Onboarding',
    GOALS = 'Goals',
    PERFORMANCE_REVIEWS = 'Performance Reviews',
    LEARNING = 'Learning',
    CREDENTIALING = 'Credentialing',
    WELLNESS = 'Wellness',
    SKILL_MATRIX = 'Skill Matrix',
    DOCUMENT_MANAGEMENT = 'Document Management',
    TEAM = 'Team Hub',
    AI_ASSISTANT = 'AI Assistant',
    CLINICAL_SCRIBE = 'Clinical Scribe',
    AUDIT_LOG = 'Audit Log',
    PROFILE = 'User Profile',
    NOTIFICATIONS = 'Notifications',
}

export type ReviewStatus = 'Pending Self-Assessment' | 'Pending Manager Review' | 'Finalizing' | 'Completed';

export interface PerformanceReview {
    id: string;
    employeeId: string;
    managerId: string;
    reviewPeriod: string;
    status: ReviewStatus;
    selfAssessment: string;
    managerAssessment: string;
    goals: { goalId: string; progress: number; comment: string }[];
    dueDate: string;
    completionDate?: string;
}

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category: 'Clinical' | 'Administrative' | 'Technical' | 'Soft Skills';
}

export interface EmployeeSkill {
  employeeId: string;
  skillId: string;
  proficiency: ProficiencyLevel;
}

export interface ManagedDocument {
  id: string;
  name: string;
  type: 'Policy' | 'Procedure' | 'Contract' | 'Form';
  version: string;
  lastUpdated: string;
  status: 'Draft' | 'Active' | 'Archived';
  content: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: { id: string; name: string };
  action: string;
  details: string;
}

export interface JourneyMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: 'promotion' | 'certification' | 'project' | 'start';
}

export type CredentialStatus = 'Active' | 'Expiring Soon' | 'Expired';
export interface Credential {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: CredentialStatus;
  credentialId: string;
}

export interface WellnessResource {
    id: string;
    title: string;
    description: string;
    category: 'Mental Health' | 'Stress Management' | 'Physical Well-being';
    url: string;
}