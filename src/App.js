import React, { useState, useEffect } from 'react';
import './App.css';
import TopNav from './components/TopNav';
import DashboardCards from './components/DashboardCards';
import ActivityView from './components/ActivityView';
import StepsView from './components/StepsView';
import ChallengesView from './components/ChallengesView';
import ExercisesView from './components/ExercisesView';
import ConversationsView from './components/ConversationsView';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Add dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
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
        return <DashboardCards onCardClick={handleNavigation} />;
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
        return <DashboardCards onCardClick={handleNavigation} />;
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
