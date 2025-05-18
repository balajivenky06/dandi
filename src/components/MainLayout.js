'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`flex-1 transition-all duration-200 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        {!showSidebar && (
          <button
            className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-[#232b3e] border border-gray-200 dark:border-[#232b3e] shadow-lg"
            onClick={() => setShowSidebar(true)}
            aria-label="Show sidebar"
          >
            <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="min-h-screen bg-white dark:bg-[#101624]">
          {children}
        </div>
      </main>
    </div>
  );
} 