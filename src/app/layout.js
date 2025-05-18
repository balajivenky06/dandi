"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className={mounted ? '' : ''}>
      <head>
        {/* Remove dark mode script */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white`}>
        <div>
          <header className="w-full flex justify-end items-center px-6 py-4 border-b border-gray-100 bg-white">
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                id="user-menu-button"
                aria-haspopup="true"
                aria-expanded={profileOpen ? 'true' : 'false'}
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="h-9 w-9 rounded-full border border-gray-200 shadow" />
                <span className="hidden sm:block font-medium text-gray-800">Personal</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">Account</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">Logout</a>
                </div>
              )}
            </div>
          </header>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
