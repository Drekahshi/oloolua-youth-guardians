import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { TreePlanting } from './pages/TreePlanting';
import { Staking } from './pages/Staking';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';
import { Verify } from './pages/Verify';
import { GamificationProvider } from './context/GamificationContext';
import { VerificationProvider } from './context/VerificationContext';

// Import newly created global css
import './index.css';

function App() {
  return (
    <GamificationProvider>
      <VerificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plant" element={<TreePlanting />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/verify" element={<Verify />} />
            </Routes>
          </Layout>
        </Router>
      </VerificationProvider>
    </GamificationProvider>
  );
}

export default App;
