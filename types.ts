// ============================================
// ZIRTUALLY - Multi-Industry Employee Lifecycle Platform
// Type Definitions
// ============================================

// Industry Configuration
export type Industry = 
  | 'healthcare'
  | 'technology'
  | 'finance'
  | 'retail'
  | 'manufacturing'
  | 'hospitality'
  | 'education'
  | 'professional_services';

export interface IndustryConfig {
  id: Industry;
  name: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  terminology: IndustryTerminology;
  complianceModules: string[];
  defaultDepartments: string[];
  features: IndustryFeatures;
}

export interface IndustryTerminology {
  employee: string;
  employees: string;
  manager: string;
  department: string;
  client: string;
  workspace: string;
}

export interface IndustryFeatures {
  credentialing: boolean;
  clinicalScribe: boolean;
  shiftScheduling: boolean;
  inventoryAccess: boolean;
  projectTracking: boolean;
  clientManagement: boolean;
  complianceTracking: boolean;
}

// User & Organization
export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  STAFF = 'Staff',
}

export interface Organization {
  id: string;
  name: string;
  industry: Industry;
  logo?: string;
  settings: OrganizationSettings;
  createdAt: string;
}

export interface OrganizationSettings {
  timeOffPolicy: TimeOffPolicy;
  workingDays: number[];
  timezone: string;
  fiscalYearStart: string;
  probationPeriodDays: number;
}

export interface TimeOffPolicy {
  ptoPerYear: number;
  sickDaysPerYear: number;
  carryOverLimit: number;
  requiresApproval: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  isNewHire: boolean;
  department?: string;
  title?: string;
  startDate?: string;
  managerId?: string;
  location?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  timeOffBalance?: TimeOffBalance;
  employmentType?: 'full-time' | 'part-time' | 'contractor';
}

export interface TimeOffBalance {
  pto: number;
  sick: number;
  personal: number;
  used: {
    pto: number;
    sick: number;
    personal: number;
  };
}

// Onboarding & Tasks
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  BLOCKED = 'Blocked',
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  assignedBy?: string;
  priority: Priority;
  estimatedTime: number;
  completedAt?: string;
  dependencies?: string[];
  attachments?: string[];
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  industry: Industry;
  department?: string;
  tasks: Omit<OnboardingTask, 'id' | 'assignedTo' | 'status'>[];
  duration: number; // days
}

export interface Policy {
  id: string;
  title: string;
  content?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  required: boolean;
  version: string;
}

// Performance & Goals
export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  owner: string;
  isTeamGoal: boolean;
  priority: Priority;
  estimatedTime: number;
  startDate?: string;
  targetDate?: string;
  keyResults?: KeyResult[];
  category?: string;
}

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
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
  rating?: number;
  strengths?: string[];
  areasForImprovement?: string[];
}

// Learning & Development
export interface TrainingModule {
  id: string;
  title: string;
  description?: string;
  type: 'Mandatory' | 'Optional' | 'Recommended';
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  url: string;
  points: number;
  duration?: number; // minutes
  category?: string;
  industry?: Industry[];
}

export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  type: 'Document' | 'Video' | 'Presentation' | 'Course' | 'Article';
  url: string;
  duration?: number;
  tags?: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: string[];
  estimatedDuration: number;
  targetRole?: string;
}

// Skills & Competencies
export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface EmployeeSkill {
  employeeId: string;
  skillId: string;
  proficiency: ProficiencyLevel;
  endorsements?: string[];
  lastAssessed?: string;
}

// Time Off Management
export type TimeOffType = 'pto' | 'sick' | 'personal' | 'bereavement' | 'jury_duty' | 'parental' | 'unpaid';
export type TimeOffStatus = 'pending' | 'approved' | 'denied' | 'cancelled';

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: TimeOffStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  observed?: string;
}

// Surveys & Engagement
export type SurveyType = 'pulse' | 'engagement' | 'onboarding' | 'exit' | 'custom';

export interface Survey {
  id: string;
  title: string;
  type: SurveyType;
  description: string;
  questions: SurveyQuestion[];
  startDate: string;
  endDate: string;
  anonymous: boolean;
  status: 'draft' | 'active' | 'closed';
  responseRate?: number;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'yes_no';
  options?: string[];
  required: boolean;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  employeeId?: string;
  submittedAt: string;
  answers: { questionId: string; value: string | number }[];
}

// Documents
export interface ManagedDocument {
  id: string;
  name: string;
  type: 'Policy' | 'Procedure' | 'Contract' | 'Form' | 'Template' | 'Handbook';
  version: string;
  lastUpdated: string;
  status: 'Draft' | 'Active' | 'Archived';
  content: string;
  department?: string;
  requiresSignature?: boolean;
  signedBy?: string[];
}

// Credentials & Compliance
export type CredentialStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Pending Verification';

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: CredentialStatus;
  credentialId: string;
  documentUrl?: string;
  reminderDays?: number;
}

// Team & Recognition
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  date: string;
  priority?: 'normal' | 'important' | 'urgent';
  pinned?: boolean;
  departments?: string[];
}

export interface ValueBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Recognition {
  id: string;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  message: string;
  date: string;
  valueId: string;
  reactions?: { emoji: string; count: number }[];
}

// Wellness
export interface WellnessResource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon?: string;
}

// Journey & Milestones
export interface JourneyMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: 'promotion' | 'certification' | 'project' | 'start' | 'anniversary' | 'award';
  employeeId?: string;
}

// Audit & Analytics
export interface AuditLog {
  id: string;
  timestamp: string;
  user: { id: string; name: string };
  action: string;
  details: string;
  ipAddress?: string;
  resource?: string;
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  category: string;
}

// Offboarding
export type OffboardingStatus = 'scheduled' | 'in_progress' | 'completed';

export interface OffboardingProcess {
  id: string;
  employeeId: string;
  lastDay: string;
  reason: 'resignation' | 'termination' | 'layoff' | 'retirement' | 'contract_end';
  status: OffboardingStatus;
  tasks: OffboardingTask[];
  exitInterviewScheduled?: boolean;
  exitInterviewCompleted?: boolean;
}

export interface OffboardingTask {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
  completedAt?: string;
  category: 'IT' | 'HR' | 'Finance' | 'Manager' | 'Employee';
}

// Benefits
export interface BenefitPlan {
  id: string;
  name: string;
  type: 'health' | 'dental' | 'vision' | '401k' | 'life' | 'disability' | 'other';
  provider: string;
  description: string;
  enrollmentStatus: 'enrolled' | 'eligible' | 'waived' | 'pending';
  coverageLevel?: string;
  monthlyCost?: number;
  employerContribution?: number;
}

// Navigation
export enum View {
  DASHBOARD = 'Dashboard',
  MY_JOURNEY = 'My Journey',
  ONBOARDING = 'Onboarding',
  OFFBOARDING = 'Offboarding',
  GOALS = 'Goals',
  PERFORMANCE_REVIEWS = 'Reviews',
  LEARNING = 'Learning',
  CREDENTIALING = 'Credentials',
  WELLNESS = 'Wellness',
  SKILL_MATRIX = 'Skills',
  DOCUMENT_MANAGEMENT = 'Documents',
  TEAM = 'Team Hub',
  DIRECTORY = 'Directory',
  ORG_CHART = 'Org Chart',
  TIME_OFF = 'Time Off',
  BENEFITS = 'Benefits',
  SURVEYS = 'Surveys',
  AI_ASSISTANT = 'AI Assistant',
  ANALYTICS = 'Analytics',
  AUDIT_LOG = 'Audit Log',
  PROFILE = 'Profile',
  NOTIFICATIONS = 'Notifications',
  SETTINGS = 'Settings',
}

// Integrations
export interface Integration {
  id: string;
  name: string;
  category: 'payroll' | 'communication' | 'calendar' | 'ats' | 'productivity' | 'identity';
  icon: string;
  connected: boolean;
  status?: 'active' | 'error' | 'pending';
  lastSync?: string;
}
