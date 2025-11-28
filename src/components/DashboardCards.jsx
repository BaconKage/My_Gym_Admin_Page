import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Activity,
  TrendingUp,
  Trophy,
  Dumbbell,
  ShoppingCart,
  MessageSquare,
} from 'lucide-react';

const DashboardCards = ({ onCardClick, stats, statsLoading, statsError }) => {
  // If we’re still loading from backend and have no stats yet
  if (statsLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading dashboard stats…</p>
        </div>
      </div>
    );
  }

  // If error and nothing to show
  if (statsError && !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-sm text-red-200">
          {statsError}
        </div>
      </div>
    );
  }

  // Safe fallback in case stats is null for a moment
  const safeStats = stats || {
    totalActivities: 0,
    totalDailyStepsRecords: 0,
    totalExercises: 0,
    activeChallenges: 0,
    openCarts: 0,
    totalConversations: 0,
  };

  const cards = [
    {
      id: 'activity',
      title: 'Total Activities',
      value: safeStats.totalActivities.toLocaleString(),
      description: 'From activities collection',
      icon: Activity,
      color: 'text-blue-500',
      gradient: 'from-blue-500/10 to-blue-600/10',
    },
    {
      id: 'steps',
      title: 'Daily Steps Records',
      value: safeStats.totalDailyStepsRecords.toLocaleString(),
      description: 'From dailysteps collection',
      icon: TrendingUp,
      color: 'text-green-500',
      gradient: 'from-green-500/10 to-green-600/10',
    },
    {
      id: 'challenges',
      title: 'Active Challenges',
      value: safeStats.activeChallenges.toLocaleString(),
      description: 'From challenges collection',
      icon: Trophy,
      color: 'text-yellow-500',
      gradient: 'from-yellow-500/10 to-yellow-600/10',
    },
    {
      id: 'workouts',
      title: 'Total Exercises',
      value: safeStats.totalExercises.toLocaleString(),
      description: 'From exercises collection',
      icon: Dumbbell,
      color: 'text-purple-500',
      gradient: 'from-purple-500/10 to-purple-600/10',
    },
    {
      id: 'carts',
      title: 'Open Carts',
      value: safeStats.openCarts.toLocaleString(),
      description: 'From carts collection',
      icon: ShoppingCart,
      color: 'text-orange-500',
      gradient: 'from-orange-500/10 to-orange-600/10',
    },
    {
      id: 'conversations',
      title: 'Conversations',
      value: safeStats.totalConversations.toLocaleString(),
      description: 'From conversations collection',
      icon: MessageSquare,
      color: 'text-pink-500',
      gradient: 'from-pink-500/10 to-pink-600/10',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h2 className="text-4xl font-bold page-header mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Live data from your MyGym MongoDB. Click on any card to view detailed information.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className="stat-card card-hover-effect cursor-pointer group"
              onClick={() => onCardClick(card.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="stat-number text-3xl font-bold mb-1">
                  {card.value}
                </div>
                <CardDescription className="text-xs">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardCards;
