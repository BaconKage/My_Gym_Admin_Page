import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import DataTable from './DataTable';
import { getExercises, getExerciseCategories, getExerciseLevels } from '../fakeApi';
import { Dumbbell, Filter } from 'lucide-react';

const ExercisesView = () => {
  const allExercises = getExercises();
  const categories = getExerciseCategories();
  const levels = getExerciseLevels();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredExercises = allExercises.filter(exercise => {
    const categoryMatch = selectedCategory === 'All' || exercise.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || exercise.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const columns = [
    { key: 'name', label: 'Exercise Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    { key: 'subcategory', label: 'Subcategory' },
    { 
      key: 'level', 
      label: 'Level',
      render: (value) => (
        <Badge variant={
          value === 'Beginner' ? 'secondary' : 
          value === 'Intermediate' ? 'default' : 
          'destructive'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'equipment', label: 'Equipment' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold page-header mb-2">Workouts & Exercises</h2>
        <p className="text-muted-foreground">Browse and manage exercise library</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter exercises by category and level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Level</label>
              <div className="flex flex-wrap gap-2">
                {levels.map(level => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Exercise Library
              </CardTitle>
              <CardDescription>
                Showing {filteredExercises.length} of {allExercises.length} exercises
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredExercises} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisesView;
