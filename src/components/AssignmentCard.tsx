import React from 'react';
import { Assignment } from '../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Calendar, FileText, Award } from 'lucide-react';
import { useState } from 'react';
import { AssignmentModal } from './AssignmentModal';

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({
  assignment
}: AssignmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dueDate = new Date(assignment.dueDate);
  const statusVariants = {
    upcoming: 'info',
    submitted: 'warning',
    graded: 'success'
  } as const;

  return (
    <>
      <button onClick={openModal} className="w-full">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{
                  backgroundColor: assignment.courseColor
                }}></div>
                <span className="text-sm font-medium text-gray-600">
                  {assignment.courseName}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-left">
                {assignment.title}
              </h3>
            </div>
            <Badge variant={statusVariants[assignment.status]}>
              {assignment.status}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 text-left">
            {assignment.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {dueDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Award className="w-4 h-4" />
                <span>{assignment.points} pts</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="capitalize">
                  {assignment.submissionType.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </button>
      {isModalOpen && <AssignmentModal assignment={assignment} onClose={closeModal} />}
    </>
  );
}