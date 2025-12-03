export interface Course {
  id: string;
  name: string;
  courseCode: string;
  term: string;
  instructor: string;
  color: string;
  grade: number | null;
  credits: number;
  schedule: CourseSchedule[];
}

export interface CourseSchedule {
  day: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  courseColor: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  submissionType: string;
  status: 'upcoming' | 'submitted' | 'graded';
  priority: 'low' | 'medium' | 'high';
  grade?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'assignment' | 'exam' | 'event';
  courseColor?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

export interface StudyPlan {
  id: string;
  generatedAt: string;
  weekStart: string;
  weekEnd: string;
  dailyPlans: DailyPlan[];
  tips: string[];
}

export interface DailyPlan {
  date: string;
  dayName: string;
  tasks: StudyTask[];
  totalHours: number;
}

export interface StudyTask {
  time: string;
  duration: number;
  subject: string;
  task: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  name: string;
  email: string;
  canvasUrl: string;
  avatar?: string;
}

// Centralized Page type
export type Page =
  | 'login'
  | 'dashboard'
  | 'courses'
  | 'assignments'
  | 'calendar'
  | 'study-plan'
  | 'settings'
  | 'chat'
  | 'notetaker';
