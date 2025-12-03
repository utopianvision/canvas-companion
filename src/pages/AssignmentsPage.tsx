import React, { useState } from 'react';
import { AssignmentCard } from '../components/AssignmentCard';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Assignment } from '../types';
import { Filter } from 'lucide-react';
interface AssignmentsPageProps {
  assignments: Assignment[];
  isLoading: boolean;
}
export function AssignmentsPage({
  assignments,
  isLoading
}: AssignmentsPageProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'submitted' | 'graded'>('all');
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your assignments...</p>
        </div>
      </div>;
  }
  const filteredAssignments = filter === 'all' ? assignments : assignments.filter(a => a.status === filter);
  const statusCounts = {
    all: assignments.length,
    upcoming: assignments.filter(a => a.status === 'upcoming').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length
  };
  return <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
        <p className="text-gray-600">Track and manage all your coursework</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-5 h-5 text-gray-600" />
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter('all')}>
            All ({statusCounts.all})
          </Button>
          <Button variant={filter === 'upcoming' ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter('upcoming')}>
            Upcoming ({statusCounts.upcoming})
          </Button>
          <Button variant={filter === 'submitted' ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter('submitted')}>
            Submitted ({statusCounts.submitted})
          </Button>
          <Button variant={filter === 'graded' ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter('graded')}>
            Graded ({statusCounts.graded})
          </Button>
        </div>
      </div>

      {filteredAssignments.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map(assignment => <AssignmentCard key={assignment.id} assignment={assignment} />)}
        </div> : <div className="text-center py-12">
          <p className="text-gray-500">No assignments found</p>
        </div>}
    </div>;
}