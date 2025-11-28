import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import DataTable from './DataTable';
import { getDailySteps } from '../api';
import { TrendingUp, Award } from 'lucide-react';

const StepsView = () => {
  const stepsData = getDailySteps();

  const columns = [
    { 
      key: 'userName', 
      label: 'User Name',
      render: (value, row, index) => (
        <div className="flex items-center gap-2">
          {index < 3 && (
            <Award className={`w-4 h-4 ${
              index === 0 ? 'text-yellow-500' : 
              index === 1 ? 'text-gray-400' : 
              'text-orange-600'
            }`} />
          )}
          <span>{value}</span>
        </div>
      )
    },
    { key: 'date', label: 'Date' },
    { 
      key: 'steps', 
      label: 'Steps',
      render: (value) => (
        <Badge variant={value > 10000 ? 'default' : 'secondary'}>
          {value.toLocaleString()}
        </Badge>
      )
    },
  ];

  const maxSteps = Math.max(...stepsData.chartData.map(d => d.steps));

  return (
    <div className="container mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold page-header mb-2">Daily Steps Overview</h2>
        <p className="text-muted-foreground">Track daily step counts across all users</p>
      </div>

      {/* Chart Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Steps This Week
          </CardTitle>
          <CardDescription>Last 7 days average step count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stepsData.chartData.map((day, index) => {
              const percentage = (day.steps / maxSteps) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-muted-foreground">{day.steps.toLocaleString()} steps</span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Steppers</CardTitle>
          <CardDescription>Users with highest step counts today</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={stepsData.topUsers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StepsView;
