
import React, { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

import { Droplet, HeartPulse, LogOut } from 'lucide-react';

import HealthStatusBanner from './components/HealthStatusBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PortalEntry from './components/PortalEntry';
import Services from './components/Services';
import StatsSection from './components/StatsSection';
import EmergencySection from './components/EmergencySection';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import BloodDonorRegistration from './components/BloodDonorRegistration';
import EmergencyCoordinatorDashboard from './components/EmergencyCoordinatorDashboard';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const roleDashboards = {
  patient: 'Patient Dashboard',
  doctor: 'Doctor Dashboard',
  hospital_admin: 'Hospital Admin Dashboard',
  blood_donor: 'Blood Donor Dashboard',
  emergency_coordinator: 'Emergency Coordinator Dashboard',
  super_admin: 'Super Admin Dashboard'
};

// Landing Page
function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  const handleOpenAuth = (role = 'patient') => {
    setSelectedRole(role);
    setAuthModalOpen(true);
  };

  const handleEmergencyDispatch = () => {
    alert(
      'Emergency dispatch is a demo feature and is not connected to live emergency services.'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      <HealthStatusBanner />

      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="flex-grow">
        <Hero onSelectRole={handleOpenAuth} />

        <PortalEntry onSelectRole={handleOpenAuth} />

        <Services
          onSelectService={() => handleOpenAuth('patient')}
        />

        <StatsSection />

        <EmergencySection
          onEmergencyDispatch={handleEmergencyDispatch}
        />
      </main>

      <Footer onOpenAuth={handleOpenAuth} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={selectedRole}
      />
    </div>
  );
}

// Redirect users to their own dashboard
function DashboardRedirect() {
  const { profile } = useAuth();

  if (!profile || !roleDashboards[profile.role]) {
    return <Navigate to="/" replace />;
  }

  return (
    <Navigate
      to={`/dashboard/${profile.role}`}
      replace
    />
  );
}

// Blood Donor Dashboard
function BloodDonorDashboard() {
  const { profile, signOut } = useAuth();
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    setLogoutError('');

    const { error } = await signOut();

    if (error) {
      setLogoutError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <HeartPulse size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-sky-700">
                CARECONNECT
              </h1>
              <p className="text-xs text-slate-500">
                Blood Donor Portal
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8">
        <section className="rounded-2xl bg-gradient-to-r from-red-700 to-rose-600 p-8 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Droplet size={32} />

            <p className="text-sm font-semibold tracking-wide text-red-100">
              BLOOD DONOR PORTAL
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-bold">
            Welcome, {profile?.full_name || 'Donor'}!
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-red-100">
            Your willingness to donate blood can help save lives.
            Register your donor details and manage your availability.
          </p>
        </section>

        {logoutError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Logout failed: {logoutError}
          </p>
        )}

        <BloodDonorRegistration />

        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          © 2026 CARECONNECT. Connecting Care. Saving Lives.
        </footer>
      </main>
    </div>
  );
}

// Dashboard Page
function DashboardPage({ role }) {
  const { profile, signOut } = useAuth();
  const [logoutError, setLogoutError] = useState('');

  if (role === 'patient') {
    return <PatientDashboard />;
  }

  if (role === 'doctor') {
    return <DoctorDashboard />;
  }

  if (role === 'blood_donor') {
    return <BloodDonorDashboard />;
  }

  if (role === 'emergency_coordinator') {
    return <EmergencyCoordinatorDashboard />;
  }

  const handleLogout = async () => {
    setLogoutError('');

    const { error } = await signOut();

    if (error) {
      setLogoutError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-5 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-700">
          CARECONNECT
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-slate-800">
          {roleDashboards[role]}
        </h2>

        <p className="mt-3 text-slate-600">
          Welcome, {profile?.full_name || 'User'}!
        </p>

        {logoutError && (
          <p className="mt-4 text-sm text-red-600">
            Logout failed: {logoutError}
          </p>
        )}

        <div className="mt-8 rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Your CARECONNECT Portal
          </h3>

          <p className="mt-2 text-slate-600">
            Your {role.replaceAll('_', ' ')} account is active.
            Dashboard modules will be added in the next implementation steps.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Account role: {profile?.role}
          </p>
        </div>
      </main>
    </div>
  );
}

// Unauthorized Page
function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-red-600">
        Access Denied
      </h1>

      <p className="mt-3 text-slate-600 text-center">
        You are not authorized to access this dashboard.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-sky-600 px-5 py-3 text-white hover:bg-sky-700"
      >
        Return Home
      </Link>
    </div>
  );
}

// Main Application
export default function App() {
  const allRoles = Object.keys(roleDashboards);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      <Route
        element={
          <ProtectedRoute allowedRoles={allRoles} />
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardRedirect />}
        />

        {allRoles.map((role) => (
          <Route
            key={role}
            element={
              <ProtectedRoute allowedRoles={[role]} />
            }
          >
            <Route
              path={`/dashboard/${role}`}
              element={<DashboardPage role={role} />}
            />
          </Route>
        ))}
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
