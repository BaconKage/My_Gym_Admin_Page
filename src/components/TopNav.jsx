import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Activity, Dumbbell, Trophy, MessageSquare, Menu, LayoutDashboard, FileText } from 'lucide-react';

const TopNav = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-gradient">MyGym</span> Admin
              </h1>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className="gap-2 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">Admin View</p>
              <p className="text-xs text-muted-foreground">MY GYM</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                AU
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
