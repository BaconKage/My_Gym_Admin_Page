import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Activity,
  TrendingUp,
  Trophy,
  Dumbbell,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";

function DashboardCards({ onCardClick, stats, statsLoading, statsError }) {
  // ---- handle loading & error for stats ----
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

  if (statsError && !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-sm text-red-200">
          {statsError}
        </div>
      </div>
    );
  }

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
      id: "activity",
      title: "Total Activities",
      value: safeStats.totalActivities.toLocaleString(),
      description: "Recent actions taken by users.",
      icon: Activity,
      color: "text-blue-500",
      gradient: "from-blue-500/10 to-blue-600/10",
    },
    {
      id: "steps",
      title: "Daily Steps Records",
      value: safeStats.totalDailyStepsRecords.toLocaleString(),
      description: "Entries in the Daily Steps log.",
      icon: TrendingUp,
      color: "text-green-500",
      gradient: "from-green-500/10 to-green-600/10",
    },
    {
      id: "challenges",
      title: "Active Challenges",
      value: safeStats.activeChallenges.toLocaleString(),
      description: "Currently running fitness challenges.",
      icon: Trophy,
      color: "text-yellow-500",
      gradient: "from-yellow-500/10 to-yellow-600/10",
    },
    {
      id: "workouts",
      title: "Total Exercises",
      value: safeStats.totalExercises.toLocaleString(),
      description: "Exercises available in the library.",
      icon: Dumbbell,
      color: "text-purple-500",
      gradient: "from-purple-500/10 to-purple-600/10",
    },
    {
      id: "carts",
      title: "Open Carts",
      value: safeStats.openCarts.toLocaleString(),
      description: "Carts with pending checkouts.",
      icon: ShoppingCart,
      color: "text-orange-500",
      gradient: "from-orange-500/10 to-orange-600/10",
    },
    {
      id: "conversations",
      title: "Conversations",
      value: safeStats.totalConversations.toLocaleString(),
      description: "Active user chat conversations.",
      icon: MessageSquare,
      color: "text-pink-500",
      gradient: "from-pink-500/10 to-pink-600/10",
    },
  ];

  // Data for the simple bar chart
  const chartData = [
    { key: "Activities", value: safeStats.totalActivities },
    { key: "Steps", value: safeStats.totalDailyStepsRecords },
    { key: "Challenges", value: safeStats.activeChallenges },
    { key: "Exercises", value: safeStats.totalExercises },
    { key: "Carts", value: safeStats.openCarts },
    { key: "Conversations", value: safeStats.totalConversations },
  ];

  const maxValue =
    chartData.reduce((max, item) => (item.value > max ? item.value : max), 0) ||
    1;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="mb-2 animate-slide-up">
        <h2 className="text-4xl font-bold page-header mb-2">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          High-level summary of what&apos;s happening inside MyGym. Click any
          card to dive deeper into details.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className="stat-card card-hover-effect cursor-pointer group"
              onClick={() => onCardClick && onCardClick(card.id)}
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

      {/* Visual Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Platform overview</CardTitle>
            <CardDescription className="text-xs">
              Relative size of each key module based on current counts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex items-end gap-4 h-48">
              {chartData.map((item) => {
                const height = (item.value / maxValue) * 100;
                return (
                  <div
                    key={item.key}
                    className="flex-1 flex flex-col items-center justify-end gap-2"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary/80 transition-all"
                        style={{ height: `${height || 5}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-muted-foreground text-center leading-tight">
                      {item.key}
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick insight tiles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick insights</CardTitle>
            <CardDescription className="text-xs">
              Simple highlights admins can understand at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2">
              <div>
                <p className="font-medium text-emerald-200">
                  Content-rich exercise library
                </p>
                <p className="text-[11px] text-emerald-100/80">
                  {safeStats.totalExercises.toLocaleString()} exercises
                  available for trainers and users.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-blue-500/5 border border-blue-500/20 px-3 py-2">
              <div>
                <p className="font-medium text-blue-200">
                  User engagement activities
                </p>
                <p className="text-[11px] text-blue-100/80">
                  {safeStats.totalActivities.toLocaleString()} tracked
                  activities across the platform.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-violet-500/5 border border-violet-500/20 px-3 py-2">
              <div>
                <p className="font-medium text-violet-200">
                  Challenges driving participation
                </p>
                <p className="text-[11px] text-violet-100/80">
                  {safeStats.activeChallenges.toLocaleString()} challenges
                  currently active.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-500/5 border border-slate-500/20 px-3 py-2">
              <div>
                <p className="font-medium text-slate-200">
                  Conversations & support
                </p>
                <p className="text-[11px] text-slate-100/80">
                  {safeStats.totalConversations.toLocaleString()} conversations
                  helping users stay connected with trainers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardCards;
