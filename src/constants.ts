// ============================================
// ZIRTUALLY - Multi-Industry Employee Lifecycle Platform
// Constants & Mock Data
// ============================================

import {
  User,
  UserRole,
  OnboardingTask,
  TaskStatus,
  Policy,
  Goal,
  TrainingModule,
  LearningResource,
  Announcement,
  Recognition,
  PerformanceReview,
  Skill,
  EmployeeSkill,
  ManagedDocument,
  AuditLog,
  ValueBadge,
  JourneyMilestone,
  CareerPath,
  Credential,
  WellnessResource,
  Industry,
  IndustryConfig,
  TimeOffRequest,
  Survey,
  BenefitPlan,
  Holiday,
  Integration,
  AnalyticsMetric,
  Organization,
  TeamMemberSkill,
  ProficiencyLevel,
} from './types';

// ============================================
// INDUSTRY CONFIGURATIONS
// ============================================

export const INDUSTRY_CONFIGS: Record<Industry, IndustryConfig> = {
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    primaryColor: '#005A9C',
    secondaryColor: '#009F8C',
    terminology: {
      employee: 'Staff Member',
      employees: 'Staff',
      manager: 'Department Head',
      department: 'Department',
      client: 'Patient',
      workspace: 'Facility',
    },
    complianceModules: [
      'HIPAA Compliance',
      'Patient Safety',
      'Infection Control',
      'Medical Ethics',
    ],
    defaultDepartments: [
      'Nursing',
      'Administration',
      'Emergency',
      'Surgery',
      'Pediatrics',
      'Radiology',
    ],
    features: {
      credentialing: true,
      clinicalScribe: true,
      shiftScheduling: true,
      inventoryAccess: false,
      projectTracking: false,
      clientManagement: true,
      complianceTracking: true,
    },
  },
  technology: {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    primaryColor: '#6366F1',
    secondaryColor: '#10B981',
    terminology: {
      employee: 'Team Member',
      employees: 'Team',
      manager: 'Team Lead',
      department: 'Team',
      client: 'Customer',
      workspace: 'Office',
    },
    complianceModules: ['Data Security', 'Code of Conduct', 'IP Protection', 'Remote Work Policy'],
    defaultDepartments: ['Engineering', 'Product', 'Design', 'Data Science', 'DevOps', 'QA'],
    features: {
      credentialing: false,
      clinicalScribe: false,
      shiftScheduling: false,
      inventoryAccess: false,
      projectTracking: true,
      clientManagement: true,
      complianceTracking: true,
    },
  },
  finance: {
    id: 'finance',
    name: 'Finance & Banking',
    icon: '🏦',
    primaryColor: '#0F766E',
    secondaryColor: '#F59E0B',
    terminology: {
      employee: 'Associate',
      employees: 'Associates',
      manager: 'Director',
      department: 'Division',
      client: 'Client',
      workspace: 'Branch',
    },
    complianceModules: ['AML Training', 'KYC Procedures', 'SEC Compliance', 'Ethics & Integrity'],
    defaultDepartments: [
      'Investment Banking',
      'Wealth Management',
      'Risk',
      'Compliance',
      'Operations',
      'Technology',
    ],
    features: {
      credentialing: true,
      clinicalScribe: false,
      shiftScheduling: false,
      inventoryAccess: false,
      projectTracking: true,
      clientManagement: true,
      complianceTracking: true,
    },
  },
  retail: {
    id: 'retail',
    name: 'Retail',
    icon: '🛍️',
    primaryColor: '#DC2626',
    secondaryColor: '#EA580C',
    terminology: {
      employee: 'Associate',
      employees: 'Associates',
      manager: 'Store Manager',
      department: 'Department',
      client: 'Customer',
      workspace: 'Store',
    },
    complianceModules: [
      'Customer Service Excellence',
      'Loss Prevention',
      'Safety Training',
      'POS Systems',
    ],
    defaultDepartments: [
      'Sales Floor',
      'Inventory',
      'Customer Service',
      'Visual Merchandising',
      'Cashiers',
      'Management',
    ],
    features: {
      credentialing: false,
      clinicalScribe: false,
      shiftScheduling: true,
      inventoryAccess: true,
      projectTracking: false,
      clientManagement: true,
      complianceTracking: false,
    },
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    primaryColor: '#7C3AED',
    secondaryColor: '#2563EB',
    terminology: {
      employee: 'Operator',
      employees: 'Workforce',
      manager: 'Supervisor',
      department: 'Unit',
      client: 'Customer',
      workspace: 'Plant',
    },
    complianceModules: ['OSHA Safety', 'Quality Control', 'Equipment Operation', 'Hazmat Training'],
    defaultDepartments: [
      'Production',
      'Quality Assurance',
      'Maintenance',
      'Logistics',
      'Safety',
      'Engineering',
    ],
    features: {
      credentialing: true,
      clinicalScribe: false,
      shiftScheduling: true,
      inventoryAccess: true,
      projectTracking: true,
      clientManagement: false,
      complianceTracking: true,
    },
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality',
    icon: '🏨',
    primaryColor: '#BE185D',
    secondaryColor: '#7C3AED',
    terminology: {
      employee: 'Team Member',
      employees: 'Team',
      manager: 'General Manager',
      department: 'Department',
      client: 'Guest',
      workspace: 'Property',
    },
    complianceModules: [
      'Guest Service Standards',
      'Food Safety',
      'Emergency Procedures',
      'Brand Standards',
    ],
    defaultDepartments: [
      'Front Desk',
      'Housekeeping',
      'Food & Beverage',
      'Concierge',
      'Maintenance',
      'Events',
    ],
    features: {
      credentialing: true,
      clinicalScribe: false,
      shiftScheduling: true,
      inventoryAccess: true,
      projectTracking: false,
      clientManagement: true,
      complianceTracking: true,
    },
  },
  education: {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    primaryColor: '#0891B2',
    secondaryColor: '#059669',
    terminology: {
      employee: 'Staff',
      employees: 'Staff',
      manager: 'Department Chair',
      department: 'Department',
      client: 'Student',
      workspace: 'Campus',
    },
    complianceModules: [
      'FERPA Compliance',
      'Title IX Training',
      'Mandatory Reporting',
      'Academic Integrity',
    ],
    defaultDepartments: [
      'Faculty',
      'Administration',
      'Student Services',
      'IT',
      'Admissions',
      'Financial Aid',
    ],
    features: {
      credentialing: true,
      clinicalScribe: false,
      shiftScheduling: false,
      inventoryAccess: false,
      projectTracking: true,
      clientManagement: true,
      complianceTracking: true,
    },
  },
  professional_services: {
    id: 'professional_services',
    name: 'Professional Services',
    icon: '💼',
    primaryColor: '#1E40AF',
    secondaryColor: '#9333EA',
    terminology: {
      employee: 'Consultant',
      employees: 'Consultants',
      manager: 'Partner',
      department: 'Practice',
      client: 'Client',
      workspace: 'Office',
    },
    complianceModules: [
      'Client Confidentiality',
      'Professional Ethics',
      'Conflict of Interest',
      'Quality Standards',
    ],
    defaultDepartments: ['Consulting', 'Advisory', 'Tax', 'Audit', 'Legal', 'Human Capital'],
    features: {
      credentialing: true,
      clinicalScribe: false,
      shiftScheduling: false,
      inventoryAccess: false,
      projectTracking: true,
      clientManagement: true,
      complianceTracking: true,
    },
  },
};

// ============================================
// MOCK ORGANIZATION
// ============================================

export const MOCK_ORGANIZATION: Organization = {
  id: 'org-1',
  name: 'Acme Corporation',
  industry: 'technology',
  settings: {
    timeOffPolicy: {
      ptoPerYear: 20,
      sickDaysPerYear: 10,
      carryOverLimit: 5,
      requiresApproval: true,
    },
    workingDays: [1, 2, 3, 4, 5],
    timezone: 'America/New_York',
    fiscalYearStart: '01-01',
    probationPeriodDays: 90,
  },
  createdAt: '2023-01-01',
};

// ============================================
// MOCK USERS
// ============================================

export const MOCK_USERS: User[] = [
  {
    id: 'u0',
    name: 'Samuel Carter',
    email: 's.carter@acme.com',
    role: UserRole.ADMIN,
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isNewHire: false,
    department: 'Executive',
    title: 'CEO',
    startDate: '2020-03-15',
    location: 'New York, NY',
    phone: '+1 (555) 100-0001',
    bio: 'Visionary leader with 20+ years of experience building high-performing teams.',
    employmentType: 'full-time',
    timeOffBalance: {
      pto: 25,
      sick: 10,
      personal: 3,
      bereavement: 5,
      used: { pto: 8, sick: 2, personal: 1, bereavement: 0 },
    },
  },
  {
    id: 'u1',
    name: 'Evelyn Reed',
    email: 'e.reed@acme.com',
    role: UserRole.MANAGER,
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    isNewHire: false,
    department: 'Engineering',
    title: 'VP of Engineering',
    startDate: '2021-06-01',
    managerId: 'u0',
    location: 'San Francisco, CA',
    phone: '+1 (555) 100-0002',
    bio: 'Engineering leader passionate about building scalable systems and growing engineering talent.',
    skills: ['Leadership', 'System Architecture', 'Agile', 'Python', 'Cloud Infrastructure'],
    employmentType: 'full-time',
    timeOffBalance: {
      pto: 20,
      sick: 10,
      personal: 3,
      bereavement: 5,
      used: { pto: 5, sick: 1, personal: 0, bereavement: 0 },
    },
  },
  {
    id: 'u2',
    name: 'Alex Chen',
    email: 'a.chen@acme.com',
    role: UserRole.STAFF,
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isNewHire: true,
    department: 'Engineering',
    title: 'Software Engineer',
    startDate: '2024-07-15',
    managerId: 'u1',
    location: 'San Francisco, CA',
    phone: '+1 (555) 100-0003',
    bio: 'Full-stack developer excited to contribute to innovative products.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    employmentType: 'full-time',
    timeOffBalance: {
      pto: 20,
      sick: 10,
      personal: 3,
      bereavement: 5,
      used: { pto: 0, sick: 0, personal: 0, bereavement: 0 },
    },
  },
  {
    id: 'u3',
    name: 'Maria Garcia',
    email: 'm.garcia@acme.com',
    role: UserRole.STAFF,
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isNewHire: false,
    department: 'Product',
    title: 'Senior Product Manager',
    startDate: '2022-01-10',
    managerId: 'u1',
    location: 'Austin, TX',
    phone: '+1 (555) 100-0004',
    bio: 'Product leader focused on user-centric design and data-driven decisions.',
    skills: [
      'Product Strategy',
      'User Research',
      'Data Analysis',
      'Roadmapping',
      'Stakeholder Management',
    ],
    employmentType: 'full-time',
    timeOffBalance: {
      pto: 20,
      sick: 10,
      personal: 3,
      bereavement: 5,
      used: { pto: 12, sick: 3, personal: 2, bereavement: 0 },
    },
  },
  {
    id: 'u4',
    name: 'James Wilson',
    email: 'j.wilson@acme.com',
    role: UserRole.STAFF,
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isNewHire: false,
    department: 'Design',
    title: 'Lead Designer',
    startDate: '2021-09-01',
    managerId: 'u1',
    location: 'Remote',
    phone: '+1 (555) 100-0005',
    bio: 'Design leader creating beautiful, accessible, and intuitive user experiences.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Design Systems', 'Prototyping'],
    employmentType: 'full-time',
    timeOffBalance: {
      pto: 20,
      sick: 10,
      personal: 3,
      bereavement: 5,
      used: { pto: 7, sick: 0, personal: 1, bereavement: 0 },
    },
  },
  {
    id: 'u5',
    name: 'Sarah Thompson',
    email: 's.thompson@acme.com',
    role: UserRole.MANAGER,
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    isNewHire: false,
    department: 'People',
    title: 'Head of People',
    startDate: '2021-03-15',
    managerId: 'u0',
    location: 'New York, NY',
    phone: '+1 (555) 100-0006',
    bio: 'HR professional dedicated to creating inclusive, engaging workplaces.',
    skills: [
      'Talent Acquisition',
      'Employee Relations',
      'Compensation',
      'HRIS',
      'Culture Building',
    ],
    employmentType: 'full-time',
    timeOffBalance: {
      pto: 20,
      sick: 10,
      personal: 3,
      bereavement: 5,
      used: { pto: 9, sick: 2, personal: 0, bereavement: 0 },
    },
  },
];

export const MOCK_TEAM_MEMBERS = MOCK_USERS;

// ============================================
// AUDIT LOG
// ============================================

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: `log-${Date.now() - 10000}`,
    timestamp: new Date(Date.now() - 10000).toISOString(),
    user: { id: 'u1', name: 'Evelyn Reed' },
    action: 'VIEW_DOCUMENT',
    category: 'data',
    status: 'success',
    details: 'Viewed document: Employee Handbook',
  },
  {
    id: `log-${Date.now() - 60000}`,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    user: { id: 'u2', name: 'Alex Chen' },
    action: 'ACKNOWLEDGE_POLICY',
    category: 'compliance',
    status: 'success',
    details: 'Acknowledged policy: Acceptable Use Policy',
  },
  {
    id: `log-${Date.now() - 120000}`,
    timestamp: new Date(Date.now() - 120000).toISOString(),
    user: { id: 'u3', name: 'Maria Garcia' },
    action: 'USER_LOGIN',
    category: 'security',
    status: 'success',
    details: 'User logged into the system.',
  },
];

export const createAuditLog = (
  user: User,
  action: string,
  details: string,
  category: AuditLog['category'] = 'system',
  status: AuditLog['status'] = 'success'
) => {
  if (!user) return;
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: { id: user.id, name: user.name },
    action,
    category,
    status,
    details,
  };
  MOCK_AUDIT_LOGS.unshift(newLog);
};

// ============================================
// ONBOARDING
// ============================================

export const MOCK_ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: 'ot1',
    title: 'Set up workstation and accounts',
    category: 'IT',
    status: TaskStatus.DONE,
    dueDate: '2024-07-16',
    assignedTo: 'u2',
    priority: 'High',
    estimatedTime: 2,
  },
  {
    id: 'ot2',
    title: 'Complete employment paperwork',
    category: 'HR',
    status: TaskStatus.IN_PROGRESS,
    dueDate: '2024-07-17',
    assignedTo: 'u2',
    priority: 'High',
    estimatedTime: 1,
  },
  {
    id: 'ot3',
    title: 'Review Employee Handbook',
    category: 'HR',
    status: TaskStatus.TODO,
    dueDate: '2024-07-20',
    assignedTo: 'u2',
    priority: 'Medium',
    estimatedTime: 2,
  },
  {
    id: 'ot4',
    title: 'Complete security training',
    category: 'IT',
    status: TaskStatus.TODO,
    dueDate: '2024-07-22',
    assignedTo: 'u2',
    priority: 'High',
    estimatedTime: 1,
  },
  {
    id: 'ot5',
    title: 'Meet with team members',
    category: 'Department',
    status: TaskStatus.TODO,
    dueDate: '2024-07-25',
    assignedTo: 'u2',
    priority: 'Medium',
    estimatedTime: 4,
  },
  {
    id: 'ot6',
    title: 'Set up development environment',
    category: 'Department',
    status: TaskStatus.TODO,
    dueDate: '2024-07-26',
    assignedTo: 'u2',
    priority: 'High',
    estimatedTime: 3,
  },
  {
    id: 'ot7',
    title: 'Review codebase and documentation',
    category: 'Department',
    status: TaskStatus.TODO,
    dueDate: '2024-07-30',
    assignedTo: 'u2',
    priority: 'Medium',
    estimatedTime: 8,
  },
  {
    id: 'ot8',
    title: 'Benefits enrollment',
    category: 'HR',
    status: TaskStatus.TODO,
    dueDate: '2024-08-01',
    assignedTo: 'u2',
    priority: 'High',
    estimatedTime: 1,
  },
];

export const MOCK_POLICIES: Policy[] = [
  { id: 'p1', title: 'Employee Handbook', acknowledged: false, required: true, version: 'v3.2' },
  { id: 'p2', title: 'Code of Conduct', acknowledged: false, required: true, version: 'v2.1' },
  { id: 'p3', title: 'Data Security Policy', acknowledged: true, required: true, version: 'v1.5' },
  { id: 'p4', title: 'Remote Work Policy', acknowledged: false, required: false, version: 'v1.0' },
  {
    id: 'p5',
    title: 'Anti-Harassment Policy',
    acknowledged: false,
    required: true,
    version: 'v2.0',
  },
];

// ============================================
// GOALS & PERFORMANCE
// ============================================

export const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Complete Onboarding Program',
    description: 'Finish all mandatory training and setup tasks within first 30 days.',
    progress: 35,
    owner: 'u2',
    isTeamGoal: false,
    priority: 'High',
    estimatedTime: 40,
    dueDate: '2024-08-15',
    category: 'Development',
    status: 'in-progress',
  },
  {
    id: 'g2',
    title: 'Ship v2.0 Product Launch',
    description: 'Successfully launch the next major version of our platform.',
    progress: 65,
    owner: 'u1',
    isTeamGoal: true,
    priority: 'High',
    estimatedTime: 200,
    dueDate: '2024-09-30',
    category: 'Product',
    status: 'in-progress',
  },
  {
    id: 'g3',
    title: 'Improve Team Velocity by 20%',
    description: 'Implement process improvements to increase sprint velocity.',
    progress: 45,
    owner: 'u1',
    isTeamGoal: true,
    priority: 'Medium',
    estimatedTime: 80,
    dueDate: '2024-10-31',
    category: 'Operations',
    status: 'in-progress',
  },
  {
    id: 'g4',
    title: 'Complete AWS Certification',
    description: 'Obtain AWS Solutions Architect certification.',
    progress: 25,
    owner: 'u2',
    isTeamGoal: false,
    priority: 'Medium',
    estimatedTime: 60,
    dueDate: '2024-12-31',
    category: 'Development',
    status: 'not-started',
  },
  {
    id: 'g5',
    title: 'Redesign User Dashboard',
    description: 'Create a more intuitive and data-rich user dashboard.',
    progress: 80,
    owner: 'u4',
    isTeamGoal: false,
    priority: 'High',
    estimatedTime: 120,
    dueDate: '2024-08-31',
    category: 'Design',
    status: 'in-progress',
  },
];

export const MOCK_REVIEWS: PerformanceReview[] = [
  {
    id: 'pr1',
    employeeId: 'u3',
    managerId: 'u1',
    period: 'H1 2024',
    status: 'pending',
    goals: [{ goalId: 'g5', progress: 80, comment: '' }],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'pr2',
    employeeId: 'u2',
    managerId: 'u1',
    period: '30-Day Check-in',
    status: 'in_progress',
    selfAssessment: {
      performanceRating: 4,
      goalsAchievement: 3,
      skillsGrowth: 5,
      teamwork: 4,
      initiative: 5,
      achievements: [
        'Ramping up quickly on the codebase',
        'Completed all mandatory training ahead of schedule',
      ],
    },
    goals: [{ goalId: 'g1', progress: 35, comment: '' }],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'pr3',
    employeeId: 'u3',
    managerId: 'u1',
    period: 'H2 2023',
    status: 'completed',
    selfAssessment: {
      performanceRating: 4,
      goalsAchievement: 4,
      skillsGrowth: 4,
      teamwork: 5,
      initiative: 4,
      achievements: ['Successfully launched three major features', 'Mentored two junior PMs'],
    },
    managerAssessment: {
      performanceRating: 4,
      goalsAchievement: 5,
      skillsGrowth: 4,
      teamwork: 4,
      initiative: 5,
      achievements: [],
      feedback:
        'Maria consistently exceeds expectations. Her strategic thinking and stakeholder management are exceptional.',
    },
    goals: [],
    dueDate: '2024-01-15',
    completedDate: '2024-01-10',
    rating: 4,
  },
];

// ============================================
// LEARNING & TRAINING
// ============================================

export const MOCK_TRAINING: TrainingModule[] = [
  {
    id: 't1',
    title: 'Security Awareness Training',
    description: 'Essential training on data security, phishing, and best practices.',
    type: 'Mandatory',
    dueDate: '2024-08-01',
    completed: false,
    url: '#',
    points: 100,
    duration: 60,
    category: 'Security',
  },
  {
    id: 't2',
    title: 'Code of Conduct',
    description: 'Understanding our company values and professional standards.',
    type: 'Mandatory',
    dueDate: '2024-07-15',
    completed: true,
    completedAt: '2024-01-10',
    url: '#',
    points: 50,
    duration: 30,
    category: 'Compliance',
  },
  {
    id: 't3',
    title: 'Effective Communication',
    description: 'Mastering the art of clear and professional communication.',
    type: 'Recommended',
    completed: false,
    url: '#',
    points: 75,
    duration: 45,
    category: 'Soft Skills',
  },
  {
    id: 't4',
    title: 'Project Management Fundamentals',
    description: 'Basics of agile project management and workflows.',
    type: 'Optional',
    completed: false,
    url: '#',
    points: 150,
    duration: 120,
    category: 'Skills',
  },
  {
    id: 't5',
    title: 'HIPAA Compliance',
    description: 'Required for all staff handling patient data.',
    type: 'Mandatory',
    dueDate: '2024-06-30',
    completed: true,
    completedAt: '2023-01-22', // Matches MyJourney milestone
    url: '#',
    points: 100,
    duration: 60,
    category: 'Healthcare',
    industry: ['healthcare'],
  },
];

// ============================================
// COMMUTE & JOURNEY
// ============================================

export const MOCK_MILESTONES: JourneyMilestone[] = [
  {
    id: '1',
    type: 'onboarding',
    title: 'Welcome Aboard!',
    description: 'Successfully completed the onboarding process and joined the team.',
    date: '2023-01-15',
    status: 'completed',
    icon: 'rocket',
    category: 'Getting Started',
    details: [
      { label: 'Department', value: 'Engineering' },
      { label: 'Manager', value: 'Sarah Chen' },
    ],
  },
  {
    id: '2',
    type: 'training',
    title: 'Completed Security Training',
    description: 'Finished mandatory security awareness and compliance training.',
    date: '2023-01-22',
    status: 'completed',
    icon: 'shield',
    category: 'Training & Development',
  },
  {
    id: '3',
    type: 'project',
    title: 'First Project Milestone',
    description: 'Successfully delivered first major project contribution.',
    date: '2023-03-10',
    status: 'completed',
    icon: 'briefcase',
    category: 'Projects',
    details: [
      { label: 'Project', value: 'Customer Portal Redesign' },
      { label: 'Role', value: 'Lead Developer' },
    ],
  },
  {
    id: '4',
    type: 'certification',
    title: 'AWS Certified',
    description: 'Earned AWS Solutions Architect certification.',
    date: '2023-05-20',
    status: 'completed',
    icon: 'award',
    category: 'Certifications',
    details: [
      { label: 'Certification', value: 'AWS Solutions Architect' },
      { label: 'Valid Until', value: '2026-05-20' },
    ],
  },
  {
    id: '5',
    type: 'review',
    title: 'First Performance Review',
    description: 'Completed 6-month performance review with positive feedback.',
    date: '2023-07-15',
    status: 'completed',
    icon: 'clipboard',
    category: 'Performance',
    details: [
      { label: 'Rating', value: 'Exceeds Expectations' },
      { label: 'Manager', value: 'Sarah Chen' },
    ],
  },
  {
    id: '6',
    type: 'recognition',
    title: 'Innovation Award',
    description: 'Recognized for innovative solution to customer onboarding.',
    date: '2023-09-01',
    status: 'completed',
    icon: 'star',
    category: 'Recognition',
  },
  {
    id: '7',
    type: 'anniversary',
    title: '1 Year Anniversary',
    description: 'Celebrating one year with the company!',
    date: '2024-01-15',
    status: 'completed',
    icon: 'cake',
    category: 'Milestones',
  },
  {
    id: '8',
    type: 'promotion',
    title: 'Promoted to Senior Developer',
    description: 'Recognized for consistent excellence and promoted to senior role.',
    date: '2024-02-01',
    status: 'completed',
    icon: 'trending-up',
    category: 'Career Growth',
    details: [
      { label: 'Previous Role', value: 'Software Developer' },
      { label: 'New Role', value: 'Senior Software Developer' },
    ],
  },
  {
    id: '9',
    type: 'training',
    title: 'Leadership Fundamentals',
    description: 'Currently enrolled in leadership development program.',
    date: '2024-06-01',
    status: 'in_progress',
    icon: 'users',
    category: 'Training & Development',
    details: [
      { label: 'Progress', value: '60% Complete' },
      { label: 'Expected Completion', value: '2024-08-15' },
    ],
  },
  {
    id: '10',
    type: 'review',
    title: 'Annual Performance Review',
    description: 'Upcoming annual performance review scheduled.',
    date: '2024-07-15',
    status: 'upcoming',
    icon: 'calendar',
    category: 'Performance',
  },
  {
    id: 'jm1',
    date: '2022-01-10',
    title: 'Joined the Company',
    description: 'Started as Product Manager in the Product team.',
    icon: 'start',
    employeeId: 'u3',
    type: 'milestone',
    status: 'completed',
    category: 'general',
  },
  {
    id: 'jm2',
    date: '2022-06-15',
    title: 'First Product Launch',
    description: 'Successfully led the launch of our mobile app v1.0.',
    icon: 'project',
    employeeId: 'u3',
    type: 'achievement',
    status: 'completed',
    category: 'work',
  },
  {
    id: 'jm3',
    date: '2023-01-20',
    title: 'Promoted to Senior PM',
    description: 'Promoted for exceptional performance and leadership.',
    icon: 'promotion',
    employeeId: 'u3',
    type: 'role_change',
    status: 'completed',
    category: 'career',
  },
  {
    id: 'jm4',
    date: '2023-09-15',
    title: 'PMP Certification',
    description: 'Obtained Project Management Professional certification.',
    icon: 'certification',
    employeeId: 'u3',
    type: 'certification',
    status: 'completed',
    category: 'learning',
  },
  {
    id: 'jm5',
    date: '2024-01-10',
    title: 'Two Year Anniversary',
    description: 'Celebrated two years with the company!',
    icon: 'anniversary',
    employeeId: 'u3',
    type: 'anniversary',
    status: 'completed',
    category: 'general',
  },
];

export const MOCK_CAREER_PATH: CareerPath[] = [
  {
    id: '1',
    title: 'Junior Developer',
    level: 1,
    description: 'Entry-level position focusing on learning and growth.',
    requirements: ["Bachelor's degree or equivalent", 'Basic programming skills'],
    status: 'completed',
  },
  {
    id: '2',
    title: 'Software Developer',
    level: 2,
    description: 'Independent contributor with growing expertise.',
    requirements: [
      '2+ years experience',
      'Proficient in core technologies',
      'Can work independently',
    ],
    status: 'completed',
  },
  {
    id: '3',
    title: 'Senior Software Developer',
    level: 3,
    description: 'Technical expert who mentors others and leads projects.',
    requirements: ['5+ years experience', 'Technical leadership', 'Mentorship experience'],
    status: 'current',
    salary_range: '$120,000 - $150,000',
  },
  {
    id: '4',
    title: 'Staff Engineer',
    level: 4,
    description: 'Strategic technical leader driving architecture decisions.',
    requirements: ['8+ years experience', 'System design expertise', 'Cross-team influence'],
    status: 'future',
    salary_range: '$150,000 - $180,000',
  },
  {
    id: '5',
    title: 'Principal Engineer',
    level: 5,
    description: 'Organization-wide technical visionary.',
    requirements: ['12+ years experience', 'Industry recognition', 'Strategic impact'],
    status: 'future',
    salary_range: '$180,000 - $220,000',
  },
];

export const MOCK_RESOURCES: LearningResource[] = [
  {
    id: 'lr1',
    title: 'Engineering Best Practices Guide',
    type: 'Document',
    url: '#',
    tags: ['engineering', 'best-practices'],
  },
  {
    id: 'lr2',
    title: 'Company Culture Handbook',
    type: 'Document',
    url: '#',
    tags: ['culture', 'onboarding'],
  },
  {
    id: 'lr3',
    title: 'Effective 1:1 Meetings',
    type: 'Video',
    url: '#',
    duration: 15,
    tags: ['management', 'communication'],
  },
  {
    id: 'lr4',
    title: 'Quarterly Business Review Deck',
    type: 'Presentation',
    url: '#',
    tags: ['business', 'quarterly'],
  },
  {
    id: 'lr5',
    title: 'Design System Documentation',
    type: 'Document',
    url: '#',
    tags: ['design', 'engineering'],
  },
  {
    id: 'lr6',
    title: 'Leadership Fundamentals Course',
    type: 'Course',
    url: '#',
    duration: 480,
    tags: ['leadership', 'management'],
  },
];

// ============================================
// TIME OFF
// ============================================

export const MOCK_TIME_OFF_REQUESTS: TimeOffRequest[] = [
  {
    id: 'to1',
    employeeId: 'u3',
    type: 'pto',
    startDate: '2024-08-15',
    endDate: '2024-08-19',
    totalDays: 3,
    reason: 'Family vacation',
    status: 'approved',
    requestedAt: '2024-07-20T10:00:00Z',
    reviewedBy: 'u1',
    reviewedAt: '2024-07-21T09:00:00Z',
  },
  {
    id: 'to2',
    employeeId: 'u4',
    type: 'sick',
    startDate: '2024-07-25',
    endDate: '2024-07-25',
    totalDays: 1,
    reason: 'Not feeling well',
    status: 'approved',
    requestedAt: '2024-07-25T08:00:00Z',
    reviewedBy: 'u1',
    reviewedAt: '2024-07-25T08:30:00Z',
  },
  {
    id: 'to3',
    employeeId: 'u2',
    type: 'pto',
    startDate: '2024-09-02',
    endDate: '2024-09-06',
    totalDays: 5,
    reason: 'International travel',
    status: 'pending',
    requestedAt: '2024-07-28T14:00:00Z',
  },
];

export const MOCK_HOLIDAYS: Holiday[] = [
  { id: 'h1', name: "New Year's Day", date: '2024-01-01' },
  { id: 'h2', name: 'Martin Luther King Jr. Day', date: '2024-01-15' },
  { id: 'h3', name: "Presidents' Day", date: '2024-02-19' },
  { id: 'h4', name: 'Memorial Day', date: '2024-05-27' },
  { id: 'h5', name: 'Independence Day', date: '2024-07-04' },
  { id: 'h6', name: 'Labor Day', date: '2024-09-02' },
  { id: 'h7', name: 'Thanksgiving', date: '2024-11-28' },
  { id: 'h8', name: 'Christmas Day', date: '2024-12-25' },
];

// ============================================
// SURVEYS
// ============================================

export const MOCK_SURVEYS: Survey[] = [
  {
    id: 'survey1',
    title: 'Monthly Pulse Check',
    type: 'pulse',
    description: "Quick check-in on how you're feeling at work.",
    questions: [
      {
        id: 'q1',
        text: 'How would you rate your overall job satisfaction this month?',
        type: 'rating',
        required: true,
      },
      { id: 'q2', text: 'Do you feel supported by your manager?', type: 'yes_no', required: true },
      { id: 'q3', text: 'What could we improve?', type: 'text', required: false },
    ],
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    anonymous: true,
    status: 'active',
    responseRate: 72,
  },
  {
    id: 'survey2',
    title: 'Annual Engagement Survey',
    type: 'engagement',
    description: 'Comprehensive survey to understand employee engagement and satisfaction.',
    questions: [
      {
        id: 'q1',
        text: 'I would recommend this company as a great place to work.',
        type: 'rating',
        required: true,
      },
      {
        id: 'q2',
        text: 'I understand how my work contributes to company goals.',
        type: 'rating',
        required: true,
      },
      {
        id: 'q3',
        text: 'I have the tools and resources I need to do my job well.',
        type: 'rating',
        required: true,
      },
    ],
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    anonymous: true,
    status: 'closed',
    responseRate: 89,
  },
];

// ============================================
// BENEFITS
// ============================================

export const MOCK_BENEFITS: BenefitPlan[] = [
  {
    id: 'b1',
    name: 'Medical - PPO Premium',
    type: 'health',
    provider: 'Blue Cross Blue Shield',
    description: 'Comprehensive medical coverage with low deductibles.',
    enrollmentStatus: 'enrolled',
    coverageLevel: 'Employee + Family',
    monthlyCost: 450,
    employerContribution: 800,
    category: 'Health',
  },
  {
    id: 'b2',
    name: 'Dental - Premium',
    type: 'dental',
    provider: 'Delta Dental',
    description: 'Full dental coverage including orthodontics.',
    enrollmentStatus: 'enrolled',
    coverageLevel: 'Employee + Family',
    monthlyCost: 45,
    employerContribution: 30,
    category: 'Health',
  },
  {
    id: 'b3',
    name: 'Vision',
    type: 'vision',
    provider: 'VSP',
    description: 'Annual eye exams and glasses/contacts allowance.',
    enrollmentStatus: 'enrolled',
    coverageLevel: 'Employee Only',
    monthlyCost: 10,
    employerContribution: 15,
    category: 'Health',
  },
  {
    id: 'b4',
    name: '401(k) Retirement Plan',
    type: '401k',
    provider: 'Fidelity',
    description: '4% company match on contributions.',
    enrollmentStatus: 'enrolled',
    monthlyCost: 0,
    employerContribution: 0,
    category: 'Financial',
  },
  {
    id: 'b5',
    name: 'Life Insurance',
    type: 'life',
    provider: 'MetLife',
    description: '2x annual salary coverage.',
    enrollmentStatus: 'enrolled',
    monthlyCost: 0,
    employerContribution: 25,
    category: 'Protection',
  },
];

// ============================================
// DOCUMENTS
// ============================================

export const MOCK_DOCUMENTS: ManagedDocument[] = [
  {
    id: 'doc1',
    name: 'Employee Handbook',
    type: 'Handbook',
    version: 'v3.2',
    lastUpdated: '2024-06-15',
    status: 'Active',
    content: 'Comprehensive guide to company policies, benefits, and expectations...',
  },
  {
    id: 'doc2',
    name: 'Remote Work Policy',
    type: 'Policy',
    version: 'v1.5',
    lastUpdated: '2024-07-20',
    status: 'Active',
    content: 'Guidelines for hybrid and remote work arrangements...',
  },
  {
    id: 'doc3',
    name: 'Expense Reimbursement Guide',
    type: 'Procedure',
    version: 'v2.1',
    lastUpdated: '2024-05-10',
    status: 'Active',
    content: 'Step-by-step process for submitting expense reports...',
  },
  {
    id: 'doc4',
    name: 'Performance Review Template',
    type: 'Template',
    version: 'v1.0',
    lastUpdated: '2024-01-15',
    status: 'Active',
    content: 'Standardized template for conducting performance reviews...',
  },
  {
    id: 'doc5',
    name: 'Offer Letter Template',
    type: 'Template',
    version: 'v2.0',
    lastUpdated: '2024-03-01',
    status: 'Active',
    content: 'Standard offer letter format for new hires...',
  },
];

// ============================================
// SKILLS
// ============================================

export const MOCK_SKILLS: Skill[] = [
  {
    id: 's1',
    name: 'React',
    category: 'Frontend',
    description: 'React.js framework proficiency',
    criticalLevel: 'critical',
  },
  {
    id: 's2',
    name: 'TypeScript',
    category: 'Languages',
    description: 'TypeScript language skills',
    criticalLevel: 'critical',
  },
  {
    id: 's3',
    name: 'Node.js',
    category: 'Backend',
    description: 'Node.js runtime expertise',
    criticalLevel: 'important',
  },
  {
    id: 's4',
    name: 'Python',
    category: 'Languages',
    description: 'Python programming',
    criticalLevel: 'important',
  },
  {
    id: 's5',
    name: 'AWS',
    category: 'Cloud',
    description: 'Amazon Web Services',
    criticalLevel: 'critical',
  },
  {
    id: 's6',
    name: 'Docker',
    category: 'DevOps',
    description: 'Containerization',
    criticalLevel: 'important',
  },
  {
    id: 's7',
    name: 'PostgreSQL',
    category: 'Database',
    description: 'PostgreSQL database',
    criticalLevel: 'important',
  },
  {
    id: 's8',
    name: 'GraphQL',
    category: 'API',
    description: 'GraphQL API design',
    criticalLevel: 'nice_to_have',
  },
  {
    id: 's9',
    name: 'Kubernetes',
    category: 'DevOps',
    description: 'Container orchestration',
    criticalLevel: 'nice_to_have',
  },
  {
    id: 's10',
    name: 'Machine Learning',
    category: 'AI/ML',
    description: 'ML fundamentals',
    criticalLevel: 'nice_to_have',
  },
  {
    id: 's11',
    name: 'Agile/Scrum',
    category: 'Process',
    description: 'Agile methodologies',
    criticalLevel: 'important',
  },
  {
    id: 's12',
    name: 'System Design',
    category: 'Architecture',
    description: 'System architecture design',
    criticalLevel: 'critical',
  },
];

export const MOCK_TEAM_SKILLS: TeamMemberSkill[] = [
  {
    memberId: 'm1',
    memberName: 'Alex Johnson',
    memberTitle: 'Senior Developer',
    skills: [
      { skillId: 's1', proficiency: 5, verified: true, lastAssessed: '2024-01-15' },
      { skillId: 's2', proficiency: 5, verified: true, lastAssessed: '2024-01-15' },
      { skillId: 's3', proficiency: 4, verified: true, lastAssessed: '2024-01-15' },
      { skillId: 's4', proficiency: 3, verified: false },
      { skillId: 's5', proficiency: 4, verified: true, lastAssessed: '2023-11-20' },
      { skillId: 's6', proficiency: 4, verified: true, lastAssessed: '2023-11-20' },
      { skillId: 's7', proficiency: 4, verified: false },
      { skillId: 's8', proficiency: 3, verified: false },
      { skillId: 's9', proficiency: 2, verified: false },
      { skillId: 's10', proficiency: 1, verified: false },
      { skillId: 's11', proficiency: 4, verified: true, lastAssessed: '2024-01-10' },
      { skillId: 's12', proficiency: 4, verified: true, lastAssessed: '2024-01-15' },
    ],
  },
  {
    memberId: 'm2',
    memberName: 'Maria Garcia',
    memberTitle: 'Developer',
    skills: [
      { skillId: 's1', proficiency: 4, verified: true, lastAssessed: '2024-01-10' },
      { skillId: 's2', proficiency: 4, verified: true, lastAssessed: '2024-01-10' },
      { skillId: 's3', proficiency: 3, verified: false },
      { skillId: 's4', proficiency: 2, verified: false },
      { skillId: 's5', proficiency: 2, verified: false },
      { skillId: 's6', proficiency: 2, verified: false },
      { skillId: 's7', proficiency: 3, verified: false },
      { skillId: 's8', proficiency: 4, verified: true, lastAssessed: '2024-01-10' },
      { skillId: 's9', proficiency: 1, verified: false },
      { skillId: 's10', proficiency: 0, verified: false },
      { skillId: 's11', proficiency: 3, verified: false },
      { skillId: 's12', proficiency: 2, verified: false },
    ],
  },
  {
    memberId: 'm3',
    memberName: 'James Wilson',
    memberTitle: 'Junior Developer',
    skills: [
      { skillId: 's1', proficiency: 3, verified: false },
      { skillId: 's2', proficiency: 2, verified: false },
      { skillId: 's3', proficiency: 2, verified: false },
      { skillId: 's4', proficiency: 4, verified: true, lastAssessed: '2023-12-01' },
      { skillId: 's5', proficiency: 1, verified: false },
      { skillId: 's6', proficiency: 1, verified: false },
      { skillId: 's7', proficiency: 2, verified: false },
      { skillId: 's8', proficiency: 1, verified: false },
      { skillId: 's9', proficiency: 0, verified: false },
      { skillId: 's10', proficiency: 3, verified: true, lastAssessed: '2023-12-01' },
      { skillId: 's11', proficiency: 2, verified: false },
      { skillId: 's12', proficiency: 1, verified: false },
    ],
  },
  {
    memberId: 'm4',
    memberName: 'Emily Chen',
    memberTitle: 'DevOps Engineer',
    skills: [
      { skillId: 's1', proficiency: 2, verified: false },
      { skillId: 's2', proficiency: 3, verified: false },
      { skillId: 's3', proficiency: 3, verified: false },
      { skillId: 's4', proficiency: 4, verified: true, lastAssessed: '2024-02-01' },
      { skillId: 's5', proficiency: 5, verified: true, lastAssessed: '2024-02-01' },
      { skillId: 's6', proficiency: 5, verified: true, lastAssessed: '2024-02-01' },
      { skillId: 's7', proficiency: 3, verified: false },
      { skillId: 's8', proficiency: 2, verified: false },
      { skillId: 's9', proficiency: 5, verified: true, lastAssessed: '2024-02-01' },
      { skillId: 's10', proficiency: 2, verified: false },
      { skillId: 's11', proficiency: 4, verified: true, lastAssessed: '2024-01-20' },
      { skillId: 's12', proficiency: 4, verified: true, lastAssessed: '2024-02-01' },
    ],
  },
  {
    memberId: 'm5',
    memberName: 'Michael Brown',
    memberTitle: 'Senior Developer',
    skills: [
      { skillId: 's1', proficiency: 4, verified: true, lastAssessed: '2023-10-15' },
      { skillId: 's2', proficiency: 4, verified: true, lastAssessed: '2023-10-15' },
      { skillId: 's3', proficiency: 5, verified: true, lastAssessed: '2023-10-15' },
      { skillId: 's4', proficiency: 3, verified: false },
      { skillId: 's5', proficiency: 3, verified: false },
      { skillId: 's6', proficiency: 3, verified: false },
      { skillId: 's7', proficiency: 5, verified: true, lastAssessed: '2023-10-15' },
      { skillId: 's8', proficiency: 4, verified: true, lastAssessed: '2023-10-15' },
      { skillId: 's9', proficiency: 2, verified: false },
      { skillId: 's10', proficiency: 1, verified: false },
      { skillId: 's11', proficiency: 5, verified: true, lastAssessed: '2023-10-15' },
      { skillId: 's12', proficiency: 5, verified: true, lastAssessed: '2023-10-15' },
    ],
  },
];

export const MOCK_EMPLOYEE_SKILLS: EmployeeSkill[] = [
  ...MOCK_TEAM_SKILLS.flatMap(member =>
    member.skills.map(skill => ({
      employeeId: member.memberId,
      skillId: skill.skillId,
      proficiency: skill.proficiency as ProficiencyLevel,
      verified: skill.verified,
      lastAssessed: skill.lastAssessed,
    }))
  ),
];

// ============================================
// CREDENTIALS
// ============================================

export const MOCK_CREDENTIALS: Credential[] = [
  {
    id: 'c1',
    name: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: '2023-06-15',
    expiryDate: '2026-06-14',
    status: 'Active',
    credentialId: 'AWS-SAA-12345',
  },
  {
    id: 'c2',
    name: 'PMP Certification',
    issuer: 'Project Management Institute',
    issueDate: '2022-03-20',
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Expiring Soon',
    credentialId: 'PMP-98765',
  },
  {
    id: 'c3',
    name: 'Google Cloud Professional',
    issuer: 'Google Cloud',
    issueDate: '2024-01-10',
    expiryDate: '2026-01-09',
    status: 'Active',
    credentialId: 'GCP-PRO-54321',
  },
];

// ============================================
// ANNOUNCEMENTS & RECOGNITION
// ============================================

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Q3 All-Hands Meeting',
    content:
      "Join us for our quarterly all-hands meeting this Friday at 2 PM ET. We'll be sharing company updates and celebrating wins!",
    author: 'Samuel Carter',
    authorId: 'u0',
    date: '2024-07-28',
    priority: 'important',
    pinned: true,
  },
  {
    id: 'a2',
    title: 'Welcome Alex Chen!',
    content:
      'Please join us in welcoming Alex Chen to the Engineering team. Alex will be working on our core platform.',
    author: 'Evelyn Reed',
    authorId: 'u1',
    date: '2024-07-25',
    priority: 'normal',
  },
  {
    id: 'a3',
    title: 'New Remote Work Guidelines',
    content:
      "We've updated our remote work policy. Please review the changes in the Documents section.",
    author: 'Sarah Thompson',
    authorId: 'u5',
    date: '2024-07-20',
    priority: 'normal',
  },
];

export const MOCK_VALUES: ValueBadge[] = [
  {
    id: 'v1',
    name: 'Innovation',
    description: 'Thinking creatively and pushing boundaries',
    icon: '💡',
    color: 'purple',
  },
  {
    id: 'v2',
    name: 'Collaboration',
    description: 'Working together to achieve more',
    icon: '🤝',
    color: 'blue',
  },
  {
    id: 'v3',
    name: 'Excellence',
    description: 'Striving for the highest quality',
    icon: '⭐',
    color: 'gold',
  },
  {
    id: 'v4',
    name: 'Integrity',
    description: 'Acting with honesty and transparency',
    icon: '🛡️',
    color: 'green',
  },
  {
    id: 'v5',
    name: 'Customer Focus',
    description: 'Putting customers at the center',
    icon: '❤️',
    color: 'red',
  },
];

export const MOCK_RECOGNITIONS: Recognition[] = [
  {
    id: 'r1',
    from: 'Evelyn Reed',
    fromId: 'u1',
    to: 'Maria Garcia',
    toId: 'u3',
    message:
      'Amazing work leading the product launch! Your attention to detail made all the difference.',
    date: '2024-07-27',
    valueId: 'v3',
    reactions: [
      { emoji: '🎉', count: 5 },
      { emoji: '👏', count: 8 },
    ],
  },
  {
    id: 'r2',
    from: 'Maria Garcia',
    fromId: 'u3',
    to: 'James Wilson',
    toId: 'u4',
    message:
      'The new dashboard designs are incredible. Thank you for iterating so quickly on the feedback!',
    date: '2024-07-26',
    valueId: 'v1',
    reactions: [{ emoji: '🔥', count: 3 }],
  },
  {
    id: 'r3',
    from: 'Samuel Carter',
    fromId: 'u0',
    to: 'Evelyn Reed',
    toId: 'u1',
    message:
      'Thank you for your leadership during the challenging sprint. The team delivered because of you.',
    date: '2024-07-25',
    valueId: 'v2',
    reactions: [{ emoji: '💪', count: 6 }],
  },
];

// ============================================
// WELLNESS
// ============================================

export const MOCK_WELLNESS_RESOURCES: WellnessResource[] = [
  {
    id: 'wr1',
    title: 'Mental Health Support',
    description: '24/7 access to confidential counseling through our EAP program.',
    category: 'Mental Health',
    url: '#',
    icon: '🧠',
  },
  {
    id: 'wr2',
    title: 'Meditation & Mindfulness',
    description: 'Free access to Headspace for all employees.',
    category: 'Stress Management',
    url: '#',
    icon: '🧘',
  },
  {
    id: 'wr3',
    title: 'Fitness Reimbursement',
    description: 'Up to $100/month for gym memberships or fitness classes.',
    category: 'Physical Health',
    url: '#',
    icon: '💪',
  },
  {
    id: 'wr4',
    title: 'Ergonomic Assessment',
    description: 'Request a free ergonomic assessment for your workspace.',
    category: 'Physical Health',
    url: '#',
    icon: '🪑',
  },
  {
    id: 'wr5',
    title: 'Financial Wellness',
    description: 'Free financial planning sessions with certified advisors.',
    category: 'Financial Health',
    url: '#',
    icon: '💰',
  },
];

// ============================================
// ANALYTICS
// ============================================

export const MOCK_ANALYTICS: AnalyticsMetric[] = [
  {
    id: 'am1',
    name: 'Employee Satisfaction',
    value: 4.2,
    previousValue: 4.0,
    unit: '/5',
    trend: 'up',
    category: 'Engagement',
    changePercent: 5.0,
  },
  {
    id: 'am2',
    name: 'Retention Rate',
    value: 94,
    previousValue: 91,
    unit: '%',
    trend: 'up',
    category: 'Retention',
    changePercent: 3.3,
  },
  {
    id: 'am3',
    name: 'Average Tenure',
    value: 2.8,
    previousValue: 2.5,
    unit: 'years',
    trend: 'up',
    category: 'Retention',
    changePercent: 12.0,
  },
  {
    id: 'am4',
    name: 'Training Completion',
    value: 87,
    previousValue: 82,
    unit: '%',
    trend: 'up',
    category: 'Learning',
    changePercent: 6.1,
  },
  {
    id: 'am5',
    name: 'Goal Achievement',
    value: 78,
    previousValue: 75,
    unit: '%',
    trend: 'up',
    category: 'Performance',
    changePercent: 4.0,
  },
  {
    id: 'am6',
    name: 'eNPS Score',
    value: 42,
    previousValue: 38,
    unit: '',
    trend: 'up',
    category: 'Engagement',
    changePercent: 10.5,
  },
];

// ============================================
// INTEGRATIONS
// ============================================

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int1',
    name: 'Slack',
    category: 'communication',
    icon: '💬',
    connected: true,
    status: 'active',
    lastSync: '2024-07-28T10:00:00Z',
  },
  {
    id: 'int2',
    name: 'Google Workspace',
    category: 'productivity',
    icon: '📧',
    connected: true,
    status: 'active',
    lastSync: '2024-07-28T09:30:00Z',
  },
  {
    id: 'int3',
    name: 'ADP Payroll',
    category: 'payroll',
    icon: '💵',
    connected: true,
    status: 'active',
    lastSync: '2024-07-27T00:00:00Z',
  },
  {
    id: 'int4',
    name: 'Greenhouse',
    category: 'ats',
    icon: '🌱',
    connected: false,
    status: 'pending',
  },
  {
    id: 'int5',
    name: 'Okta',
    category: 'identity',
    icon: '🔐',
    connected: true,
    status: 'active',
    lastSync: '2024-07-28T10:15:00Z',
  },
  {
    id: 'int6',
    name: 'Google Calendar',
    category: 'calendar',
    icon: '📅',
    connected: true,
    status: 'active',
    lastSync: '2024-07-28T10:00:00Z',
  },
];

// ============================================
// AI INSIGHTS (Generic)
// ============================================

export const AI_INSIGHTS = {
  'Task Completion': {
    title: 'Task Completion Insights',
    content:
      'Analysis shows tasks with clear due dates and assigned owners have a 35% higher completion rate. Breaking down large projects into smaller, time-boxed tasks improves team velocity.',
    recommendations: [
      'Set specific, short-term due dates for all tasks',
      'Ensure every task has a single owner',
      'Break large projects into sub-tasks under 4 hours each',
    ],
  },
  'Team Engagement': {
    title: 'Team Engagement Analysis',
    content:
      'Teams with weekly check-ins show 28% higher engagement scores. Recognition given within 24 hours of achievement has 3x the impact on motivation.',
    recommendations: [
      'Schedule regular 1:1s with all direct reports',
      'Enable peer-to-peer recognition in team channels',
      'Celebrate wins in team meetings',
    ],
  },
  'Onboarding Effectiveness': {
    title: 'Onboarding Analysis',
    content:
      'New hires who complete their 30-day checklist are 2x more likely to stay beyond their first year. Early buddy assignments increase ramp-up speed by 40%.',
    recommendations: [
      'Assign a buddy to every new hire on day one',
      'Schedule new hire check-ins at 30, 60, and 90 days',
      'Create department-specific onboarding tracks',
    ],
  },
};

// ============================================
// MANAGER NUDGES
// ============================================

export const MANAGER_NUDGES = [
  {
    id: 'n1',
    employeeId: 'u2',
    type: 'onboarding_check',
    title: 'New Hire Check-in: Alex Chen',
    details:
      'Alex is approaching their 2-week milestone. Consider scheduling a check-in to address any questions.',
    suggestion:
      'Alex is approaching their 2-week milestone. Consider scheduling a check-in to address any questions.',
    urgency: 'medium',
    action: 'Schedule 1:1',
  },
  {
    id: 'n2',
    employeeId: 'u3',
    type: 'recognition_opportunity',
    title: 'Recognition Due: Maria Garcia',
    details:
      'Maria recently completed a major product launch. This is a great opportunity for recognition.',
    suggestion:
      'Maria recently completed a major product launch. This is a great opportunity for recognition.',
    urgency: 'high',
    action: 'Give Recognition',
  },
  {
    id: 'n3',
    employeeId: 'u4',
    type: 'goal_review',
    title: 'Goal Check: James Wilson',
    details:
      "James's dashboard redesign goal is at 80%. Consider reviewing progress and next steps.",
    suggestion:
      "James's dashboard redesign goal is at 80%. Consider reviewing progress and next steps.",
    urgency: 'low',
    action: 'Review Goal',
  },
];
