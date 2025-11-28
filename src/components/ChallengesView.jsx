import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import DataTable from './DataTable';
import { getChallenges, getChallengeParticipants } from '../fakeApi';
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';

const ChallengesView = () => {
  const challenges = getChallenges();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [participants, setParticipants] = useState([]);

  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
    setParticipants(getChallengeParticipants(challenge.id));
  };

  const participantColumns = [
    { key: 'userName', label: 'User Name' },
    { 
      key: 'progress', 
      label: 'Progress',
      render: (value) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{value}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )
    },
    { key: 'joinDate', label: 'Join Date' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold page-header mb-2">Active Challenges</h2>
        <p className="text-muted-foreground">Manage and track gym challenges</p>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {challenges.map((challenge) => (
          <Card 
            key={challenge.id} 
            className="card-hover-effect cursor-pointer"
            onClick={() => handleChallengeClick(challenge)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    {challenge.title}
                  </CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </div>
                <Badge variant="default">{challenge.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Start Date</span>
                  </div>
                  <p className="text-sm font-medium">{challenge.startDate}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>End Date</span>
                  </div>
                  <p className="text-sm font-medium">{challenge.endDate}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Participants</span>
                  </div>
                  <span className="text-lg font-bold">{challenge.participants}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Participants Table */}
      {selectedChallenge && (
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {selectedChallenge.title} - Participants
                </CardTitle>
                <CardDescription>Progress tracking for all participants</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={participantColumns} data={participants} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChallengesView;
