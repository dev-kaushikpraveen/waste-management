import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { DeveloperHubPage } from './pages/DeveloperHubPage';
import { LoginPage } from './pages/LoginPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AIWasteScanner } from './pages/AIWasteScanner';
import { SmartBinMap } from './pages/SmartBinMap';
import { PlasticPassportPage } from './pages/PlasticPassportPage';
import { PublicTrackingPage } from './pages/PublicTrackingPage';
import { CollectorDashboard } from './pages/CollectorDashboard';
import { RecyclerDashboard } from './pages/RecyclerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { RewardsWalletPage } from './pages/RewardsWalletPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { EnvironmentalAnalyticsPage } from './pages/EnvironmentalAnalyticsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { PickupBookingPage } from './pages/PickupBookingPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/hub" element={<DeveloperHubPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/track/:batchCode" element={<PublicTrackingPage />} />

          {/* Authenticated Application Shell */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/ai-scanner" element={<AIWasteScanner />} />
            <Route path="/smart-bins" element={<SmartBinMap />} />
            <Route path="/passports" element={<PlasticPassportPage />} />
            <Route path="/pickup-booking" element={<PickupBookingPage />} />
            <Route path="/collector" element={<CollectorDashboard />} />
            <Route path="/recycler" element={<RecyclerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/rewards" element={<RewardsWalletPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/analytics" element={<EnvironmentalAnalyticsPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
