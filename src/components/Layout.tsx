import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: any;
}

export function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  user,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
