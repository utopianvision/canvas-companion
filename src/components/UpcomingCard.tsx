import { Assignment } from '../types';
import { Card } from './Card';
import { Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { AssignmentModal } from './AssignmentModal';

interface UpcomingCardProps {
  assignment: Assignment;
}

export function UpcomingCard({
  assignment
}: UpcomingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const hoursUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isUrgent = hoursUntilDue < 24 && hoursUntilDue > 0;

  return (
    <>
      <button onClick={openModal} className="w-full">
        <Card padding="sm" className="border-l-4 hover:shadow-md transition-shadow duration-200" style={{
          borderLeftColor: assignment.courseColor
        }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{
                  color: assignment.courseColor
                }}>
                  {assignment.courseName}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 truncate text-left">
                {assignment.title}
              </h4>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-gray-400 mr-1" />
                <span className={`text-sm ${isUrgent ? 'text-orange-600' : 'text-gray-600'}`}>
                  {`Due ${dueDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}`}
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