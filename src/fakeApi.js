// Fake API Layer - Mock data for MyGym Admin Dashboard
// Replace these functions with real API calls later

export const getDashboardStats = () => {
  return {
    totalActivities: 1248,
    dailySteps: 8542,
    activeChallenges: 12,
    totalExercises: 156,
    openCarts: 23,
    conversations: 47,
    totalUsers: 892,
    activeUsers: 345
  };
};

export const getActivities = () => {
  return [
    { id: 1, userName: 'John Doe', type: 'Workout', date: '2024-01-15', details: 'Completed cardio session', duration: 45 },
    { id: 2, userName: 'Sarah Smith', type: 'Class', date: '2024-01-15', details: 'Attended yoga class', duration: 60 },
    { id: 3, userName: 'Mike Johnson', type: 'Check-in', date: '2024-01-15', details: 'Gym check-in', duration: 0 },
    { id: 4, userName: 'Emily Brown', type: 'Workout', date: '2024-01-14', details: 'Weight training session', duration: 75 },
    { id: 5, userName: 'David Lee', type: 'Class', date: '2024-01-14', details: 'Spin class', duration: 45 },
    { id: 6, userName: 'Lisa Wang', type: 'Workout', date: '2024-01-14', details: 'HIIT training', duration: 30 },
    { id: 7, userName: 'Tom Wilson', type: 'Check-in', date: '2024-01-13', details: 'Gym check-in', duration: 0 },
    { id: 8, userName: 'Anna Garcia', type: 'Class', date: '2024-01-13', details: 'Pilates class', duration: 60 },
  ];
};

export const getDailySteps = () => {
  // Last 7 days of step data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    chartData: days.map((day, index) => ({
      day,
      steps: Math.floor(7000 + Math.random() * 5000),
      date: `2024-01-${9 + index}`
    })),
    topUsers: [
      { userName: 'John Doe', date: '2024-01-15', steps: 12450 },
      { userName: 'Sarah Smith', date: '2024-01-15', steps: 11230 },
      { userName: 'Mike Johnson', date: '2024-01-15', steps: 10890 },
      { userName: 'Emily Brown', date: '2024-01-15', steps: 9870 },
      { userName: 'David Lee', date: '2024-01-15', steps: 9120 },
    ]
  };
};

export const getChallenges = () => {
  return [
    {
      id: 1,
      title: '30-Day Fitness Challenge',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      participants: 145,
      description: 'Complete 30 days of consistent workouts'
    },
    {
      id: 2,
      title: 'New Year Marathon Prep',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      participants: 67,
      description: 'Train for the spring marathon'
    },
    {
      id: 3,
      title: 'Weight Loss Warriors',
      status: 'Active',
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      participants: 92,
      description: 'Group weight loss challenge'
    },
    {
      id: 4,
      title: 'Strength Building Challenge',
      status: 'Active',
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      participants: 78,
      description: 'Build strength over 30 days'
    },
  ];
};

export const getChallengeParticipants = (challengeId) => {
  return [
    { id: 1, userName: 'John Doe', progress: 85, joinDate: '2024-01-01' },
    { id: 2, userName: 'Sarah Smith', progress: 92, joinDate: '2024-01-01' },
    { id: 3, userName: 'Mike Johnson', progress: 78, joinDate: '2024-01-02' },
    { id: 4, userName: 'Emily Brown', progress: 95, joinDate: '2024-01-01' },
    { id: 5, userName: 'David Lee', progress: 67, joinDate: '2024-01-03' },
  ];
};

export const getExercises = () => {
  return [
    {
      id: 1,
      name: 'Barbell Bench Press',
      category: 'Strength',
      subcategory: 'Chest',
      level: 'Intermediate',
      isActive: true,
      equipment: 'Barbell'
    },
    {
      id: 2,
      name: 'Squats',
      category: 'Strength',
      subcategory: 'Legs',
      level: 'Beginner',
      isActive: true,
      equipment: 'Bodyweight'
    },
    {
      id: 3,
      name: 'Deadlift',
      category: 'Strength',
      subcategory: 'Back',
      level: 'Advanced',
      isActive: true,
      equipment: 'Barbell'
    },
    {
      id: 4,
      name: 'Running',
      category: 'Cardio',
      subcategory: 'Endurance',
      level: 'Beginner',
      isActive: true,
      equipment: 'None'
    },
    {
      id: 5,
      name: 'Pull-ups',
      category: 'Strength',
      subcategory: 'Back',
      level: 'Intermediate',
      isActive: true,
      equipment: 'Pull-up Bar'
    },
    {
      id: 6,
      name: 'Burpees',
      category: 'HIIT',
      subcategory: 'Full Body',
      level: 'Intermediate',
      isActive: true,
      equipment: 'Bodyweight'
    },
    {
      id: 7,
      name: 'Plank',
      category: 'Core',
      subcategory: 'Abs',
      level: 'Beginner',
      isActive: true,
      equipment: 'Bodyweight'
    },
    {
      id: 8,
      name: 'Dumbbell Shoulder Press',
      category: 'Strength',
      subcategory: 'Shoulders',
      level: 'Intermediate',
      isActive: true,
      equipment: 'Dumbbells'
    },
  ];
};

export const getExerciseCategories = () => {
  return ['All', 'Strength', 'Cardio', 'HIIT', 'Core', 'Flexibility'];
};

export const getExerciseLevels = () => {
  return ['All', 'Beginner', 'Intermediate', 'Advanced'];
};

export const getConversations = () => {
  return [
    {
      id: 1,
      conversationId: 'CONV-001',
      participantsCount: 2,
      lastMessage: 'Thanks for the workout tips!',
      lastUpdated: '2024-01-15 14:30',
      participants: ['John Doe', 'Trainer Mike']
    },
    {
      id: 2,
      conversationId: 'CONV-002',
      participantsCount: 3,
      lastMessage: 'What time is the yoga class?',
      lastUpdated: '2024-01-15 13:45',
      participants: ['Sarah Smith', 'Emily Brown', 'Instructor Lisa']
    },
    {
      id: 3,
      conversationId: 'CONV-003',
      participantsCount: 2,
      lastMessage: 'Can I reschedule my session?',
      lastUpdated: '2024-01-15 12:20',
      participants: ['Mike Johnson', 'Admin']
    },
    {
      id: 4,
      conversationId: 'CONV-004',
      participantsCount: 2,
      lastMessage: 'Great progress this week!',
      lastUpdated: '2024-01-15 11:15',
      participants: ['David Lee', 'Trainer Mike']
    },
    {
      id: 5,
      conversationId: 'CONV-005',
      participantsCount: 4,
      lastMessage: 'Challenge starts tomorrow!',
      lastUpdated: '2024-01-15 10:30',
      participants: ['Tom Wilson', 'Anna Garcia', 'Lisa Wang', 'Challenge Coordinator']
    },
  ];
};

export const getActivitySummary = () => {
  return {
    totalActivities: 1248,
    workouts: 542,
    classes: 398,
    checkIns: 308,
    avgDuration: 52 // minutes
  };
};
