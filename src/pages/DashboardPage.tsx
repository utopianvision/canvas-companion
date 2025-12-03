import React from 'react';
import { BookOpen, CheckSquare, TrendingUp, Files } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { UpcomingCard } from '../components/UpcomingCard';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Course, Assignment, Page } from '../types';

interface DashboardPageProps {
  courses: Course[];
  assignments: Assignment[];
  isLoading: boolean;
  onNavigate: (page: Page) => void;
}

export function DashboardPage({ courses, assignments, isLoading, onNavigate }: DashboardPageProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your data from Canvas...</p>
        </div>
      </div>
    );
  }

  const upcomingAssignments = assignments
    .filter((a) => a.status === 'upcoming')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const completedCount = assignments.filter((a) => a.status === 'submitted').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your academic overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Active Courses" value={courses.length} icon={BookOpen} color="bg-blue-600" />
        <StatsCard title="Pending Assignments" value={upcomingAssignments.length} icon={CheckSquare} color="bg-purple-600" />
        <StatsCard title="Submitted Assignments" value={completedCount} icon={TrendingUp} color="bg-green-600" />
        <StatsCard title="Total Assignments" value={assignments.length} icon={Files} color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
            </div>
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => (
                  <UpcomingCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming assignments</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-shadow duration-200"
                onClick={() => onNavigate('study-plan')} // <-- Navigate to Study Plan
              >
                <p className="font-medium text-gray-900">Generate Study Plan</p>
                <p className="text-sm text-gray-600 mt-1">Get AI-powered study recommendations</p>
              </button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">This Week</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Courses</span>
                <span className="font-medium text-gray-900">{courses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Assignments Due</span>
                <span className="font-medium text-gray-900">{upcomingAssignments.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
