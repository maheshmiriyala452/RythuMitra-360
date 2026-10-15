import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Shell
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CropManagement from './pages/CropManagement';
import ActivityManagement from './pages/ActivityManagement';
import ExpenseManagement from './pages/ExpenseManagement';
import SalesRevenue from './pages/SalesRevenue';
import InventoryManagement from './pages/InventoryManagement';
import MarketPrices from './pages/MarketPrices';
import WeatherForecast from './pages/WeatherForecast';
import ProfileSettings from './pages/ProfileSettings';
import AboutHelp from './pages/AboutHelp';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Presentation Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Shell with Sidebar & Navbar */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crops" element={<CropManagement />} />
          <Route path="/activities" element={<ActivityManagement />} />
          <Route path="/expenses" element={<ExpenseManagement />} />
          <Route path="/sales" element={<SalesRevenue />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/market" element={<MarketPrices />} />
          <Route path="/weather" element={<WeatherForecast />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/about" element={<AboutHelp />} />
        </Route>

        {/* 404 Not Found Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
