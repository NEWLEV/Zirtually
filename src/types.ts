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
  EXECUTIVE = 'Executive',
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
  skills?: string[]; // IDs
  employeeSkills?: EmployeeSkill[];
  credentials?: Credential[];
  timeOffBalance?: TimeOffBalance;
  employmentType?: 'full-time' | 'part-time' | 'contractor';
}

export type TeamMember = User;

export interface TimeOffBalance {
  pto: number;
  sick: number;
  personal: number;
  bereavement: number;
  used: {
    pto: number;
    sick: number;
    personal: number;
    bereavement: number;
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
export type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';

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
  dueDate?: string;
  keyResults?: KeyResult[];
  category?: string;
  status: GoalStatus;
  milestones?: GoalMilestone[];
  comments?: GoalComment[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface GoalComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export type ReviewStatus = 'pending' | 'in_progress' | 'completed' | 'scheduled';

export interface AssessmentData {
  performanceRating: number;
  goalsAchievement: number;
  skillsGrowth: number;
  teamwork: number;
  initiative: number;
  achievements: string[];
  feedback?: string;
  growthAreas?: string[];
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  managerId: string;
  period: string;
  status: ReviewStatus;
  selfAssessment?: AssessmentData;
  managerAssessment?: AssessmentData;
  goals?: { goalId: string; progress: number; comment: string }[];
  dueDate: string;
  completedDate?: string;
  rating?: number;
  overallRating?: number;
  strengths?: string;
  areasForImprovement?: string;
  goalsNextPeriod?: string;
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
  criticalLevel?: 'critical' | 'important' | 'nice_to_have';
  userId?: string; // For mock data filtering
}

export interface EmployeeSkill {
  employeeId: string;
  skillId: string;
  proficiency: ProficiencyLevel;
  verified?: boolean;
  lastAssessed?: string;
  endorsements?: string[];
}

export interface TeamMemberSkill {
  memberId: string;
  memberName: string;
  memberTitle: string;
  memberAvatar?: string;
  skills: {
    skillId: string;
    proficiency: number; // 0-5
    verified: boolean;
    lastAssessed?: string;
  }[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  requiredLevel: number;
  teamAverage: number;
  gap: number;
  affectedMembers: string[];
}

// Time Off Management
export type TimeOffType =
  | 'pto'
  | 'sick'
  | 'personal'
  | 'bereavement'
  | 'jury_duty'
  | 'parental'
  | 'unpaid'
  | 'vacation'
  | 'military';
export type TimeOffStatus = 'pending' | 'approved' | 'denied' | 'cancelled' | 'rejected';

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  notes?: string;
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

export type SurveyStatus = 'draft' | 'active' | 'closed' | 'completed';

export interface Survey {
  id: string;
  title: string;
  type: SurveyType;
  description: string;
  questions: SurveyQuestion[];
  startDate: string;
  endDate: string;
  anonymous: boolean;
  isAnonymous?: boolean;
  status: SurveyStatus;
  responseRate?: number;
  estimatedTime?: string;
  dueDate?: string;
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
export type CredentialStatus =
  | 'Active'
  | 'Expiring Soon'
  | 'Expired'
  | 'Pending Verification'
  | 'active'
  | 'expiring_soon'
  | 'expired'
  | 'pending';

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: CredentialStatus;
  type?: string;
  credentialId?: string;
  documentUrl?: string;
  reminderDays?: number;
  userId?: string; // For mock data filtering
  verificationUrl?: string;
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
export interface JourneyMilestoneDetail {
  label: string;
  value: string;
}

export interface JourneyMilestone {
  id: string;
  type:
    | 'onboarding'
    | 'training'
    | 'promotion'
    | 'achievement'
    | 'review'
    | 'certification'
    | 'anniversary'
    | 'project'
    | 'recognition'
    | 'milestone'
    | 'role_change';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  icon: string;
  category: string;
  details?: JourneyMilestoneDetail[];
  employeeId?: string;
}

export interface CareerPath {
  id: string;
  title: string;
  level: number;
  description: string;
  requirements: string[];
  status: 'completed' | 'current' | 'future';
  salary_range?: string;
}

// Audit & Analytics
export interface AuditLog {
  id: string;
  timestamp: string;
  user: { id: string; name: string };
  action: string;
  category: 'user' | 'data' | 'system' | 'security' | 'compliance' | 'hr';
  status: 'success' | 'failure' | 'warning';
  details: string;
  ipAddress?: string;
  resource?: string;
  affectedEntity?: string;
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  changePercent?: number;
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

export type EnrollmentStatus = 'enrolled' | 'eligible' | 'waived' | 'pending' | 'not_eligible';

// Benefits
export interface BenefitPlan {
  id: string;
  name: string;
  type: 'health' | 'dental' | 'vision' | '401k' | 'life' | 'disability' | 'other';
  category: string;
  provider: string;
  description: string;
  enrollmentStatus: EnrollmentStatus;
  coverageLevel?: string;
  monthlyCost?: number;
  employeeCost?: number;
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
