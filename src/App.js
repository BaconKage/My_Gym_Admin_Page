import React, { useState, useEffect } from 'react';
import './App.css';
import TopNav from './components/TopNav';
import DashboardCards from './components/DashboardCards';
import ActivityView from './components/ActivityView';
import StepsView from './components/StepsView';
import ChallengesView from './components/ChallengesView';
import ExercisesView from './components/ExercisesView';
import ConversationsView from './components/ConversationsView';
import { fetchDashboardStats } from './api';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // backend stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');

  // Add dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Load dashboard stats once from backend
  useEffect(() => {
    async function loadStats() {
      try {
        setStatsLoading(true);
        setStatsError('');
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
        setStatsError('Failed to load dashboard stats from backend.');
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, []);

  const handleNavigation = (page) => {
    setIsLoading(true);
    setTimeout(() => {
      setActivePage(page);
      setIsLoading(false);
    }, 200);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardCards
            onCardClick={handleNavigation}
            stats={stats}
            statsLoading={statsLoading}
            statsError={statsError}
          />
        );
      case 'activity':
        return <ActivityView />;
      case 'steps':
        return <StepsView />;
      case 'challenges':
        return <ChallengesView />;
      case 'workouts':
        return <ExercisesView />;
      case 'conversations':
        return <ConversationsView />;
      default:
        return (
          <DashboardCards
            onCardClick={handleNavigation}
            stats={stats}
            statsLoading={statsLoading}
            statsError={statsError}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav activePage={activePage} onNavigate={handleNavigation} />
      <main className="animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
