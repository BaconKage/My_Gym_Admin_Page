import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import DataTable from './DataTable';
import { getConversations } from '../fakeApi';
import { MessageSquare, Users } from 'lucide-react';

const ConversationsView = () => {
  const conversations = getConversations();

  const columns = [
    { key: 'conversationId', label: 'ID' },
    { 
      key: 'participants', 
      label: 'Participants',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.map((participant, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {participant}
            </Badge>
          ))}
        </div>
      )
    },
    { 
      key: 'participantsCount', 
      label: 'Count',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'lastMessage', label: 'Last Message' },
    { key: 'lastUpdated', label: 'Last Updated' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold page-header mb-2">Conversations</h2>
        <p className="text-muted-foreground">Manage member conversations and support</p>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversations
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Today
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Participants
            </CardTitle>
            <Users className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.reduce((sum, conv) => sum + conv.participantsCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
          <CardDescription>All active conversations and messages</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={conversations} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationsView;
