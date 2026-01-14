import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User, View, UserRole } from '../types';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const MyJourney = lazy(() => import('./MyJourney'));
const Onboarding = lazy(() => import('./Onboarding'));
const Goals = lazy(() => import('./Goals'));
const PerformanceReviews = lazy(() => import('./PerformanceReviews'));
const Learning = lazy(() => import('./Learning'));
const Credentialing = lazy(() => import('./Credentialing'));
const Wellness = lazy(() => import('./Wellness'));
const SkillMatrix = lazy(() => import('./SkillMatrix'));
const Team = lazy(() => import('./Team'));
const Directory = lazy(() => import('./Directory'));
const OrgChart = lazy(() => import('./OrgChart'));
const TimeOff = lazy(() => import('./TimeOff'));
const Benefits = lazy(() => import('./Benefits'));
const Surveys = lazy(() => import('./Surveys'));
const AIAssistant = lazy(() => import('./AIAssistant'));
const Analytics = lazy(() => import('./Analytics'));
const DocumentManagement = lazy(() => import('./DocumentManagement'));
const AuditLog = lazy(() => import('./AuditLog'));
const Profile = lazy(() => import('./Profile'));
const Notifications = lazy(() => import('./Notifications'));
const Settings = lazy(() => import('./Settings'));
const Offboarding = lazy(() => import('./Offboarding'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));

interface AppRoutesProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
  setActiveView: (view: View) => void;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const AppRoutes: React.FC<AppRoutesProps> = ({ user, onUserUpdate, onLogout, setActiveView }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/journey" element={<MyJourney user={user} setActiveView={setActiveView} />} />
        <Route
          path="/onboarding"
          element={<Onboarding user={user} setActiveView={setActiveView} />}
        />
        <Route path="/goals" element={<Goals user={user} setActiveView={setActiveView} />} />
        <Route
          path="/reviews"
          element={<PerformanceReviews user={user} setActiveView={setActiveView} />}
        />
        <Route path="/learning" element={<Learning user={user} setActiveView={setActiveView} />} />
        <Route
          path="/credentials"
          element={<Credentialing user={user} setActiveView={setActiveView} />}
        />
        <Route path="/wellness" element={<Wellness user={user} setActiveView={setActiveView} />} />
        <Route path="/skills" element={<SkillMatrix user={user} setActiveView={setActiveView} />} />
        <Route path="/team" element={<Team user={user} setActiveView={setActiveView} />} />
        <Route
          path="/directory"
          element={<Directory user={user} setActiveView={setActiveView} />}
        />
        <Route path="/org-chart" element={<OrgChart user={user} setActiveView={setActiveView} />} />
        <Route path="/time-off" element={<TimeOff user={user} setActiveView={setActiveView} />} />
        <Route path="/benefits" element={<Benefits user={user} setActiveView={setActiveView} />} />
        <Route path="/surveys" element={<Surveys user={user} setActiveView={setActiveView} />} />
        <Route path="/ai" element={<AIAssistant user={user} setActiveView={setActiveView} />} />
        <Route
          path="/analytics"
          element={<Analytics user={user} setActiveView={setActiveView} />}
        />
        <Route
          path="/documents"
          element={<DocumentManagement user={user} setActiveView={setActiveView} />}
        />
        <Route
          path="/audit-log"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AuditLog user={user} setActiveView={setActiveView} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <Profile user={user} onUserUpdate={onUserUpdate} setActiveView={setActiveView} />
          }
        />
        <Route
          path="/notifications"
          element={<Notifications user={user} setActiveView={setActiveView} />}
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings user={user} onLogout={onLogout} setActiveView={setActiveView} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offboarding"
          element={<Offboarding user={user} setActiveView={setActiveView} />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard user={user} setActiveView={setActiveView} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
