import { User, UserRole, OnboardingTask, TaskStatus, Policy, Goal, TrainingModule, LearningResource, Announcement, Recognition, PerformanceReview, Skill, EmployeeSkill, ManagedDocument, AuditLog, ValueBadge, JourneyMilestone, Credential, CredentialStatus, WellnessResource } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u0', name: 'Dr. Samuel Carter', email: 's.carter@clinic.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/id/1062/100/100', isNewHire: false },
  { id: 'u1', name: 'Dr. Evelyn Reed', email: 'e.reed@clinic.com', role: UserRole.MANAGER, avatarUrl: 'https://picsum.photos/id/1027/100/100', isNewHire: false },
  { id: 'u2', name: 'Alex Chen', email: 'a.chen@clinic.com', role: UserRole.STAFF, avatarUrl: 'https://picsum.photos/id/1005/100/100', isNewHire: true },
  { id: 'u3', name: 'Maria Garcia', email: 'm.garcia@clinic.com', role: UserRole.STAFF, avatarUrl: 'https://picsum.photos/id/1011/100/100', isNewHire: false },
];

export let MOCK_AUDIT_LOGS: AuditLog[] = [
    {
        id: `log-${new Date().getTime() - 10000}`,
        timestamp: new Date(new Date().getTime() - 10000).toISOString(),
        user: { id: 'u1', name: 'Dr. Evelyn Reed' },
        action: 'VIEW_DOCUMENT_SUMMARY',
        details: 'Generated AI summary for document: Employee Handbook'
    },
    {
        id: `log-${new Date().getTime() - 60000}`,
        timestamp: new Date(new Date().getTime() - 60000).toISOString(),
        user: { id: 'u2', name: 'Alex Chen' },
        action: 'ACKNOWLEDGE_POLICY',
        details: 'Acknowledged policy: IT Acceptable Use Policy'
    },
    {
        id: `log-${new Date().getTime() - 120000}`,
        timestamp: new Date(new Date().getTime() - 120000).toISOString(),
        user: { id: 'u3', name: 'Maria Garcia' },
        action: 'USER_LOGIN',
        details: 'User logged into the system.'
    }
];

export const createAuditLog = (user: User, action: string, details: string) => {
    if (!user) return; // Prevent logging for null user
    const newLog: AuditLog = {
        id: `log-${new Date().getTime()}`,
        timestamp: new Date().toISOString(),
        user: { id: user.id, name: user.name },
        action,
        details
    };
    MOCK_AUDIT_LOGS.unshift(newLog); // Add to beginning of array
};


export const MOCK_ONBOARDING_TASKS: OnboardingTask[] = [
    { id: 'ot1', title: 'Set up workstation and email', category: 'IT', status: TaskStatus.DONE, dueDate: '2024-08-01', assignedTo: 'u2', priority: 'High', estimatedTime: 2 },
    { id: 'ot2', title: 'Complete HR paperwork (W-4, I-9)', category: 'HR', status: TaskStatus.IN_PROGRESS, dueDate: '2024-08-02', assignedTo: 'u2', priority: 'High', estimatedTime: 1 },
    { id: 'ot3', title: 'Review Employee Handbook', category: 'HR', status: TaskStatus.TODO, dueDate: '2024-08-05', assignedTo: 'u2', priority: 'Medium', estimatedTime: 3 },
    { id: 'ot4', title: 'Introduction to EMR system', category: 'Department', status: TaskStatus.TODO, dueDate: '2024-08-07', assignedTo: 'u2', priority: 'Medium', estimatedTime: 4 },
];

export const MOCK_POLICIES: Policy[] = [
    { id: 'p1', title: 'HIPAA Privacy & Security Policy', acknowledged: false },
    { id: 'p2', title: 'Code of Conduct', acknowledged: false },
    { id: 'p3', title: 'IT Acceptable Use Policy', acknowledged: true },
];

export const MOCK_GOALS: Goal[] = [
    { id: 'g1', title: 'Complete Q3 Onboarding Training', description: 'Finish all mandatory modules for new hires.', progress: 75, owner: 'u2', isTeamGoal: false, priority: 'High', estimatedTime: 8 },
    { id: 'g2', title: 'Improve Patient Intake Efficiency', description: 'Reduce average patient intake time by 10%.', progress: 40, owner: 'u1', isTeamGoal: true, priority: 'High', estimatedTime: 20 },
    { id: 'g3', title: 'Reduce Administrative Errors', description: 'Achieve a 5% reduction in billing code errors.', progress: 60, owner: 'u1', isTeamGoal: true, priority: 'Medium', estimatedTime: 15 },
    { id: 'g4', title: 'Master EMR System', description: 'Become proficient in all core features of the Electronic Medical Records system.', progress: 50, owner: 'u2', isTeamGoal: false, priority: 'Medium', estimatedTime: 10 },
];

export const MOCK_TRAINING: TrainingModule[] = [
    { id: 't1', title: 'HIPAA Compliance 101', type: 'Mandatory', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], completed: false, url: '#', points: 100 },
    { id: 't2', title: 'Workplace Safety Procedures', type: 'Mandatory', dueDate: '2024-08-20', completed: true, url: '#', points: 50 },
    { id: 't3', title: 'Advanced EMR Features', type: 'Optional', completed: false, url: '#', points: 75 },
];

export const MOCK_RESOURCES: LearningResource[] = [
    { id: 'lr1', title: 'Clinical Protocols Manual', type: 'Document', url: '#' },
    { id: 'lr2', title: 'Billing and Coding Guide', type: 'Document', url: '#' },
    { id: 'lr3', title: 'Video: Patient Communication Best Practices', type: 'Video', url: '#' },
    { id: 'lr4', title: 'Presentation: Annual Compliance Update', type: 'Presentation', url: '#' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'a1', title: 'System Update: EMR Maintenance Scheduled', content: 'The EMR system will be down for scheduled maintenance this Saturday from 1 AM to 3 AM. Please plan accordingly.', author: 'IT Department', date: '2024-07-28' },
    { id: 'a2', title: 'Welcome to our new hire, Alex Chen!', content: 'Please join us in giving a warm welcome to Alex Chen, who is joining our administrative team.', author: 'Dr. Evelyn Reed', date: '2024-07-25' },
];

export const MOCK_VALUES: ValueBadge[] = [
    { id: 'v1', name: 'Compassion', color: 'blue' },
    { id: 'v2', name: 'Innovation', color: 'purple' },
    { id: 'v3', name: 'Teamwork', color: 'green' },
]

export const MOCK_RECOGNITIONS: Recognition[] = [
    { id: 'r1', from: 'Dr. Evelyn Reed', to: 'Maria Garcia', message: 'Huge thanks to Maria for staying late to help with the quarterly reports. Your dedication is much appreciated!', date: '2024-07-27', valueId: 'v3' },
    { id: 'r2', from: 'David Smith', to: 'Alex Chen', message: 'Great job picking up the new scheduling software so quickly, Alex! You\'re already making a big impact.', date: '2024-07-26', valueId: 'v2' },
];

export const MOCK_REVIEWS: PerformanceReview[] = [
    {
        id: 'pr1',
        employeeId: 'u3', // Maria Garcia
        managerId: 'u1',
        reviewPeriod: 'Q3 2024',
        status: 'Pending Self-Assessment',
        selfAssessment: '',
        managerAssessment: '',
        goals: [
            { goalId: 'g3', progress: 60, comment: 'Good progress on error reduction.' },
        ],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], // Due in 2 weeks
    },
    {
        id: 'pr2',
        employeeId: 'u2', // Alex Chen
        managerId: 'u1',
        reviewPeriod: 'Q3 2024 Onboarding Review',
        status: 'Pending Manager Review',
        selfAssessment: 'Feeling comfortable with the EMR system, but still learning the advanced billing codes. Onboarding has been smooth.',
        managerAssessment: '',
        goals: [
            { goalId: 'g1', progress: 75, comment: '' },
            { goalId: 'g4', progress: 50, comment: '' },
        ],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Due in 1 month
    },
    {
        id: 'pr3',
        employeeId: 'u3', // Maria Garcia
        managerId: 'u1',
        reviewPeriod: 'Q2 2024',
        status: 'Completed',
        selfAssessment: 'Successfully streamlined the patient follow-up process.',
        managerAssessment: 'Maria has shown excellent initiative and has become a key member of the administrative team.',
        goals: [],
        dueDate: '2024-07-15',
        completionDate: '2024-07-10',
    }
];

export const AI_INSIGHTS = {
  'Task Completion Efficiency': {
    title: 'Insights on Task Completion Efficiency',
    content: "Based on anonymized data, tasks categorized as 'Administrative' have a 15% higher completion rate when created with a due date within 3 business days. Consider breaking larger administrative projects into smaller, short-term tasks. Furthermore, tasks with attachments are completed 10% faster on average, suggesting that including all necessary information upfront streamlines the workflow.",
    recommendations: [
      'Break down large projects into smaller, actionable tasks.',
      'Encourage attaching all relevant documents during task creation.',
      'Set realistic, short-term due dates for administrative tasks.',
    ]
  },
  'Team Collaboration Patterns': {
    title: 'Insights on Team Collaboration',
    content: 'Analysis of non-PHI metadata shows that tasks with more than 3 comments take 25% longer to complete, which may indicate ambiguity in the initial request. Projects with a designated "Project Lead" field filled out are completed 30% more quickly. The peak time for task completion is between 10 AM and 12 PM.',
    recommendations: [
      'Ensure task descriptions are clear and concise to reduce back-and-forth communication.',
      'Assign a clear owner or lead for every multi-step project.',
      'Consider scheduling complex project kick-offs in the morning to leverage peak productivity hours.',
    ]
  }
};

export const MANAGER_NUDGES = [
  {
    id: 'n1',
    employeeId: 'u2',
    type: 'burnout_risk',
    title: 'Potential Burnout Risk: Alex Chen',
    details: 'Alex has worked 15% more hours than average this month and recent feedback sentiment is slightly negative. Consider a check-in.',
    action: 'Schedule Check-in',
  },
  {
    id: 'n2',
    employeeId: 'u3',
    type: 'recognition_opportunity',
    title: 'Recognition Opportunity: Maria Garcia',
    details: 'Maria has a 100% on-time task completion rate for the last 30 days and received positive peer feedback.',
    action: 'Give Recognition',
  }
]

export const MOCK_SKILLS: Skill[] = [
    { id: 's1', name: 'Patient Triage', category: 'Clinical' },
    { id: 's2', name: 'EMR Charting', category: 'Technical' },
    { id: 's3', name: 'Medical Billing Codes', category: 'Administrative' },
    { id: 's4', name: 'Patient Communication', category: 'Soft Skills' },
    { id: 's5', name: 'Venipuncture', category: 'Clinical' },
    { id: 's6', name: 'Scheduling Software', category: 'Technical' },
    { id: 's7', name: 'HIPAA Compliance', category: 'Administrative' },
    { id: 's8', name: 'Teamwork & Collaboration', category: 'Soft Skills' },
];

export const MOCK_EMPLOYEE_SKILLS: EmployeeSkill[] = [
    // Alex Chen (u2)
    { employeeId: 'u2', skillId: 's1', proficiency: 2 },
    { employeeId: 'u2', skillId: 's2', proficiency: 3 },
    { employeeId: 'u2', skillId: 's3', proficiency: 2 },
    { employeeId: 'u2', skillId: 's4', proficiency: 4 },
    { employeeId: 'u2', skillId: 's6', proficiency: 4 },
    { employeeId: 'u2', skillId: 's7', proficiency: 3 },
    { employeeId: 'u2', skillId: 's8', proficiency: 4 },

    // Maria Garcia (u3)
    { employeeId: 'u3', skillId: 's1', proficiency: 4 },
    { employeeId: 'u3', skillId: 's2', proficiency: 5 },
    { employeeId: 'u3', skillId: 's3', proficiency: 4 },
    { employeeId: 'u3', skillId: 's4', proficiency: 5 },
    { employeeId: 'u3', skillId: 's5', proficiency: 3 },
    { employeeId: 'u3', skillId: 's6', proficiency: 5 },
    { employeeId: 'u3', skillId: 's7', proficiency: 5 },
    { employeeId: 'u3', skillId: 's8', proficiency: 4 },
];

export const MOCK_DOCUMENTS: ManagedDocument[] = [
    { 
        id: 'doc1', 
        name: 'Employee Handbook', 
        type: 'Policy', 
        version: 'v3.1', 
        lastUpdated: '2024-06-15', 
        status: 'Active', 
        content: `Welcome to the team! This handbook outlines our company policies and procedures. All employees are expected to read and abide by these guidelines. Key sections include Code of Conduct, which requires professional behavior at all times, and our IT Policy, which prohibits the use of personal devices on the company network for non-work-related activities. Our dress code is business casual. Failure to comply with these policies may result in disciplinary action.`
    },
    { 
        id: 'doc2', 
        name: 'Patient Intake Workflow', 
        type: 'Procedure', 
        version: 'v1.5', 
        lastUpdated: '2024-07-20', 
        status: 'Active',
        content: `This document details the step-by-step process for patient intake. Step 1: Greet the patient and verify their identity using a government-issued ID. Step 2: Provide the patient with the new patient information form and the HIPAA acknowledgment form. Ensure all fields are completed. Step 3: Scan the completed forms and the patient's insurance card into the EMR system under the 'Documents' tab. Step 4: Collect any applicable co-payment. Step 5: Notify the clinical staff that the patient is ready.`
    },
    { 
        id: 'doc3', 
        name: 'Vendor Agreement - CleanCo', 
        type: 'Contract', 
        version: 'v1.0', 
        lastUpdated: '2023-08-01', 
        status: 'Archived',
        content: `This agreement is between our clinic and CleanCo for janitorial services. Service will be provided three times a week (M, W, F) after business hours. The monthly fee is $500. The contract term is for one year, automatically renewing unless a 30-day notice is provided. CleanCo is responsible for providing all cleaning supplies and is liable for any damages caused by their staff. All CleanCo employees are required to have passed a background check.`
    },
     { 
        id: 'doc4', 
        name: 'Incident Reporting Form', 
        type: 'Form', 
        version: 'v2.0', 
        lastUpdated: '2024-01-10', 
        status: 'Active',
        content: `This form must be completed within 24 hours of any workplace incident, including employee injuries, patient falls, or security breaches. The form requires a detailed description of the incident, the date and time, location, names of any witnesses, and actions taken immediately following the incident. This form should be submitted to the practice manager. Failure to report incidents in a timely manner is a violation of company policy.`
    },
];

export const MOCK_JOURNEY_MILESTONES: JourneyMilestone[] = [
    { id: 'jm1', date: '2023-05-10', title: 'Joined the Practice', description: 'Started as an Administrative Staff member, responsible for patient scheduling and intake.', icon: 'start' },
    { id: 'jm2', date: '2023-09-22', title: 'Certified EMR Specialist', description: 'Completed the advanced EMR certification, becoming a super-user for the team.', icon: 'certification' },
    { id: 'jm3', date: '2024-02-15', title: 'Led Patient Portal Project', description: 'Successfully led the project to implement the new patient portal, improving patient communication.', icon: 'project' },
    { id: 'jm4', date: '2024-07-01', title: 'Promoted to Senior Admin', description: 'Promoted to Senior Administrative Staff for outstanding performance and project leadership.', icon: 'promotion' },
];

export const MOCK_CREDENTIALS: Credential[] = [
    { id: 'c1', name: 'Registered Nurse (RN)', issuer: 'State Board of Nursing', issueDate: '2022-06-15', expiryDate: '2024-06-14', status: 'Expired', credentialId: 'RN987654' },
    { id: 'c2', name: 'Basic Life Support (BLS)', issuer: 'American Heart Association', issueDate: '2023-08-20', expiryDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString().split('T')[0], status: 'Expiring Soon', credentialId: 'AHA54321' },
    { id: 'c3', name: 'Certified Medical Assistant (CMA)', issuer: 'AAMA', issueDate: '2023-01-10', expiryDate: '2025-01-09', status: 'Active', credentialId: 'CMA123456' },
];

export const MOCK_WELLNESS_RESOURCES: WellnessResource[] = [
    { id: 'wr1', title: 'Managing Stress in a Clinical Environment', description: 'Techniques and strategies for coping with the unique stressors of healthcare work.', category: 'Stress Management', url: '#' },
    { id: 'wr2', title: 'Confidential Mental Health Support Line', description: '24/7 access to professional counselors through our Employee Assistance Program (EAP).', category: 'Mental Health', url: '#' },
    { id: 'wr3', title: 'Guide to Ergonomic Workstations', description: 'Learn how to set up your desk and equipment to prevent physical strain.', category: 'Physical Well-being', url: '#' },
    { id: 'wr4', title: 'Mindfulness and Meditation Sessions', description: 'Join guided online sessions to reduce anxiety and improve focus.', category: 'Mental Health', url: '#' },
];