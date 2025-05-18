"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Set initial dark mode from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored) {
      setDarkMode(stored === 'dark');
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        {/* No need for dark mode script, handled in React */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-[#101624] transition-colors duration-300`}>
        <div suppressHydrationWarning>
          {mounted ? (
            <div>
              <header className="w-full flex justify-end items-center px-6 py-4 border-b border-gray-100 dark:border-[#232b3e] bg-white dark:bg-[#101624]">
                {/* User Profile Dropdown */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#232b3e] transition"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      // Sun icon
                      <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 4.95l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      // Moon icon
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                      </svg>
                    )}
                  </button>
                  <div className="relative">
                    <button
                      id="user-menu-button"
                      aria-haspopup="true"
                      aria-expanded={profileOpen ? 'true' : 'false'}
                      onClick={() => setProfileOpen((open) => !open)}
                      className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="h-9 w-9 rounded-full border border-gray-200 shadow" />
                      <span className="hidden sm:block font-medium text-gray-800 dark:text-gray-100">Personal</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {profileOpen && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#232b3e] border border-gray-200 dark:border-[#232b3e] rounded-lg shadow-lg py-2 z-50"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                      >
                        <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#232b3e]" role="menuitem">Account</a>
                        <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#232b3e]" role="menuitem">Settings</a>
                        <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#232b3e]" role="menuitem">Logout</a>
                      </div>
                    )}
                  </div>
                </div>
              </header>
              <MainLayout>
                {children}
              </MainLayout>
            </div>
          ) : (
            <div />
          )}
        </div>
      </body>
    </html>
  );
}
