import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import DataTable from './DataTable';
import { getActivities, getActivitySummary } from '../fakeApi';
import { Activity, Clock, CheckCircle, Users } from 'lucide-react';

const ActivityView = () => {
  const activities = getActivities();
  const summary = getActivitySummary();

  const columns = [
    { key: 'userName', label: 'User Name' },
    { 
      key: 'type', 
      label: 'Activity Type',
      render: (value) => (
        <Badge variant={value === 'Workout' ? 'default' : value === 'Class' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      )
    },
    { key: 'date', label: 'Date' },
    { key: 'details', label: 'Details' },
    { 
      key: 'duration', 
      label: 'Duration (min)',
      render: (value) => value > 0 ? `${value} min` : '-'
    },
  ];

  const summaryCards = [
    {
      title: 'Total Activities',
      value: summary.totalActivities,
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      title: 'Workouts',
      value: summary.workouts,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Classes',
      value: summary.classes,
      icon: Users,
      color: 'text-purple-500',
    },
    {
      title: 'Avg Duration',
      value: `${summary.avgDuration} min`,
      icon: Clock,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold page-header mb-2">Activity Overview</h2>
        <p className="text-muted-foreground">Track all user activities across the gym</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest user activities and check-ins</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={activities} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityView;
