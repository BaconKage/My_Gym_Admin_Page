import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getDashboardStats } from '../fakeApi';
import { Activity, TrendingUp, Trophy, Dumbbell, ShoppingCart, MessageSquare, Users, UserCheck } from 'lucide-react';

const DashboardCards = ({ onCardClick }) => {
  const stats = getDashboardStats();

  const cards = [
    {
      id: 'activity',
      title: 'Total Activities',
      value: stats.totalActivities.toLocaleString(),
      description: 'From activities, feeds & attendances',
      icon: Activity,
      color: 'text-blue-500',
      gradient: 'from-blue-500/10 to-blue-600/10'
    },
    {
      id: 'steps',
      title: 'Daily Steps (Today)',
      value: stats.dailySteps.toLocaleString(),
      description: 'From dailysteps collection',
      icon: TrendingUp,
      color: 'text-green-500',
      gradient: 'from-green-500/10 to-green-600/10'
    },
    {
      id: 'challenges',
      title: 'Active Challenges',
      value: stats.activeChallenges,
      description: 'From challenges & challengesworks',
      icon: Trophy,
      color: 'text-yellow-500',
      gradient: 'from-yellow-500/10 to-yellow-600/10'
    },
    {
      id: 'workouts',
      title: 'Total Exercises',
      value: stats.totalExercises,
      description: 'From exercises & categories',
      icon: Dumbbell,
      color: 'text-purple-500',
      gradient: 'from-purple-500/10 to-purple-600/10'
    },
    {
      id: 'carts',
      title: 'Open Carts',
      value: stats.openCarts,
      description: 'From carts collection',
      icon: ShoppingCart,
      color: 'text-orange-500',
      gradient: 'from-orange-500/10 to-orange-600/10'
    },
    {
      id: 'conversations',
      title: 'Conversations',
      value: stats.conversations,
      description: 'From conversations & chatmembers',
      icon: MessageSquare,
      color: 'text-pink-500',
      gradient: 'from-pink-500/10 to-pink-600/10'
    },
    {
      id: 'users',
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      description: 'Registered members',
      icon: Users,
      color: 'text-cyan-500',
      gradient: 'from-cyan-500/10 to-cyan-600/10'
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      description: 'Active this week',
      icon: UserCheck,
      color: 'text-emerald-500',
      gradient: 'from-emerald-500/10 to-emerald-600/10'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h2 className="text-4xl font-bold page-header mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Click on any card to view detailed information</p>
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
                <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="stat-number text-3xl font-bold mb-1">{card.value}</div>
                <CardDescription className="text-xs">{card.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardCards;
