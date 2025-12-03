import { Home, BookOpen, CheckSquare, Calendar, Brain, Settings, LogOut, Bot, Mic } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: Home, path: 'dashboard' as Page },
  { name: 'Courses', icon: BookOpen, path: 'courses' as Page },
  { name: 'Assignments', icon: CheckSquare, path: 'assignments' as Page },
  { name: 'Calendar', icon: Calendar, path: 'calendar' as Page },
  { name: 'Study Plan', icon: Brain, path: 'study-plan' as Page },
  { name: 'Chat', icon: Bot, path: 'chat' as Page },
  { name: 'Notetaker', icon: Mic, path: 'notetaker' as Page },
  { name: 'Settings', icon: Settings, path: 'settings' as Page },
];

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ClassMate</h1>
            <p className="text-xs text-gray-500">Smart Schedule Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.path;
          return (
            <button
              key={item.name}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
