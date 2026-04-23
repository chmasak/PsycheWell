const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import { Moon, Sun, User, BarChart2, BookOpen, Trophy, Quote, Sparkles, PenLine, Gamepad2, Brain } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import AmbientPlayer from './components/AmbientPlayer';

export default function Layout({ children, currentPageName }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('psychewell-dark') === 'true');
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    const key = `psychewell-welcome-${new Date().toISOString().split('T')[0]}`;
    return !sessionStorage.getItem(key);
  });

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('psychewell-dark', darkMode);
    document.documentElement.classList.toggle('dark-gothic', darkMode);
  }, [darkMode]);

  const isHome = currentPageName === 'Home';
  const isAnalytics = currentPageName === 'Analytics';
  const isLanding = currentPageName === 'Landing';

  if (isLanding) return <>{children}</>;

  const handleWelcomeDone = () => {
    const key = `psychewell-welcome-${new Date().toISOString().split('T')[0]}`;
    sessionStorage.setItem(key, '1');
    setShowWelcome(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'gothic-dark' : 'bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50'}`}>
      {showWelcome && <WelcomeScreen onDone={handleWelcomeDone} />}
      <style>{`
        .gothic-dark {
          background: linear-gradient(135deg, #0a0000 0%, #110000 50%, #1a1a1a 100%);
          color: #e8d5d5;
        }
        .gothic-dark .nav-bar {
          background: rgba(15, 0, 0, 0.97);
          border-bottom: 1px solid #5a0000;
          backdrop-filter: blur(12px);
        }
        .gothic-dark .sidebar {
          background: rgba(10, 0, 0, 0.95);
          border-right: 1px solid #5a0000;
        }
        .gothic-dark .sidebar-btn {
          color: #d1a0a0;
        }
        .gothic-dark .sidebar-btn:hover, .gothic-dark .sidebar-btn.active {
          background: rgba(180, 0, 0, 0.2);
          color: #f87171;
          border-left: 3px solid #dc2626;
        }
        .gothic-dark .content-area {
          background: transparent;
        }
        .gothic-dark .card {
          background: rgba(20, 5, 5, 0.85);
          border: 1px solid #5a0000;
        }
        .gothic-dark .dark-gothic-card {
          background: rgba(18, 4, 4, 0.97) !important;
          border-color: #4a0000 !important;
          backdrop-filter: blur(12px);
        }
        /* Gothic dark: all "continue" buttons → red gradient */
        .gothic-dark .btn-gothic-continue {
          background: linear-gradient(to right, #7f1d1d, #450a0a) !important;
          color: #fca5a5 !important;
          border: 1px solid #7f1d1d !important;
        }
        .gothic-dark .btn-gothic-continue:hover {
          background: linear-gradient(to right, #991b1b, #5a0f0f) !important;
        }
        /* Gothic inner cards/panels */
        .gothic-dark .gothic-inner-card {
          background: rgba(30, 6, 6, 0.9) !important;
          border-color: #5a0000 !important;
          color: #e8d5d5 !important;
        }
        /* Unselected option buttons */
        .gothic-dark .gothic-option-btn {
          background: rgba(20, 4, 4, 0.8) !important;
          border-color: #3a0000 !important;
          color: #c8a0a0 !important;
        }
        .gothic-dark .gothic-option-btn:hover {
          border-color: #7f1d1d !important;
        }
        /* Progress bar */
        .gothic-dark .gothic-progress-bar {
          background: linear-gradient(to right, #7f1d1d, #dc2626) !important;
        }
        .gothic-dark .gothic-progress-track {
          background: rgba(40, 5, 5, 0.8) !important;
        }
        /* Text colors in dark */
        .gothic-dark .gothic-text-primary { color: #e8d5d5 !important; }
        .gothic-dark .gothic-text-muted { color: #9b6b6b !important; }
        .gothic-dark .gothic-step-active { color: #f87171 !important; }
        .gothic-dark .gothic-step-dot-active {
          background: linear-gradient(to bottom right, #dc2626, #7f1d1d) !important;
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2) !important;
        }
        .gothic-dark .gothic-hide-orb { display: none; }
        .gothic-dark .dark-gothic-card {
          background: rgba(22, 4, 4, 0.96) !important;
          border: 1px solid #4a0000 !important;
        }
        .light-nav {
          background: rgba(255,255,255,0.8);
          border-bottom: 1px solid rgba(139,92,246,0.2);
          backdrop-filter: blur(12px);
        }
        .light-sidebar {
          background: rgba(255,255,255,0.7);
          border-right: 1px solid rgba(139,92,246,0.15);
          backdrop-filter: blur(8px);
        }
        .light-sidebar-btn {
          color: #7c3aed;
        }
        .light-sidebar-btn:hover, .light-sidebar-btn.active {
          background: rgba(139,92,246,0.1);
          color: #5b21b6;
          border-left: 3px solid #8b5cf6;
        }
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* Top Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 ${darkMode ? 'nav-bar' : 'light-nav'}`}>
        {/* Logo */}
        <Link to={createPageUrl('Home')} className="flex items-center gap-2 mr-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-red-900 to-gray-800' : 'bg-gradient-to-br from-violet-400 to-purple-500'}`}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className={`font-cinzel font-bold text-sm tracking-wide ${darkMode ? 'text-red-400' : 'text-violet-700'}`}>PsycheWell</span>
            <span className={`font-cormorant italic text-[10px] tracking-widest ${darkMode ? 'text-gray-500' : 'text-violet-400'}`}>Insight into feelings</span>
          </div>
        </Link>

        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Ambient player */}
          <AmbientPlayer />

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              darkMode
                ? 'bg-gradient-to-r from-red-950 to-gray-900 text-red-300 border border-red-900 hover:border-red-700'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
            }`}
          >
            {darkMode ? <><Moon className="w-3.5 h-3.5" /> Dark</> : <><Sun className="w-3.5 h-3.5" /> Light</>}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(p => !p)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                darkMode
                  ? 'bg-gray-900/80 text-gray-300 border border-gray-700 hover:border-red-800'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[80px] truncate">{user?.full_name?.split(' ')[0] || 'Profile'}</span>
            </button>
            {showProfile && (
              <div className={`absolute right-0 top-10 w-48 rounded-2xl shadow-xl p-3 z-50 ${darkMode ? 'bg-gray-950 border border-red-950' : 'bg-white border border-slate-100'}`}>
                <p className={`text-xs mb-1 font-medium ${darkMode ? 'text-red-400' : 'text-slate-500'}`}>{user?.email || 'Not logged in'}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{user?.full_name || ''}</p>
                <hr className={`my-2 ${darkMode ? 'border-red-950' : 'border-slate-100'}`} />
                <button onClick={() => db.auth.logout()} className="text-xs text-rose-500 hover:text-rose-400 w-full text-left">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 bottom-0 w-56 z-40 flex flex-col py-6 px-3 ${darkMode ? 'sidebar' : 'light-sidebar'}`}>
          <p className={`text-[10px] uppercase tracking-widest font-semibold mb-3 px-3 ${darkMode ? 'text-red-800' : 'text-slate-400'}`}>Navigate</p>

          {[
            { label: 'Daily Journey', icon: Sparkles, page: 'Home' },
            { label: 'Analytics', icon: BarChart2, page: 'Analytics' },
          ].map(({ label, icon: Icon, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all border-l-2
                ${currentPageName === page
                  ? (darkMode ? 'bg-red-950/60 text-red-400 border-red-700' : 'bg-violet-100 text-violet-700 border-violet-500')
                  : (darkMode ? 'text-gray-500 hover:bg-red-950/30 hover:text-red-400 border-transparent' : 'light-sidebar-btn text-slate-500 hover:bg-violet-50 border-transparent')
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <hr className={`my-4 ${darkMode ? 'border-red-950' : 'border-violet-100'}`} />
          <p className={`text-[10px] uppercase tracking-widest font-semibold mb-3 px-3 ${darkMode ? 'text-red-800' : 'text-slate-400'}`}>Daily Log</p>

          {[
            { label: 'Daily Notes', icon: PenLine, page: 'DailyNote' },
            { label: 'Regrets', icon: BookOpen, page: 'Regrets' },
            { label: 'Achievements', icon: Trophy, page: 'Achievements' },
            { label: 'Quotes', icon: Quote, page: 'Quotes' },
          ].map(({ label, icon: Icon, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all border-l-2
                ${currentPageName === page
                  ? (darkMode ? 'bg-red-950/60 text-red-400 border-red-700' : 'bg-violet-100 text-violet-700 border-violet-500')
                  : (darkMode ? 'text-gray-500 hover:bg-red-950/30 hover:text-red-400 border-transparent' : 'text-slate-500 hover:bg-violet-50 border-transparent')
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <hr className={`my-4 ${darkMode ? 'border-red-950' : 'border-violet-100'}`} />
          <p className={`text-[10px] uppercase tracking-widest font-semibold mb-3 px-3 ${darkMode ? 'text-red-800' : 'text-slate-400'}`}>Mind Games</p>

          {[
            { label: 'Thought Dump', icon: Brain, page: 'ThoughtDump' },
            { label: 'Zen Tracing', icon: Gamepad2, page: 'ZenTracing' },
          ].map(({ label, icon: Icon, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all border-l-2
                ${currentPageName === page
                  ? (darkMode ? 'bg-red-950/60 text-red-400 border-red-700' : 'bg-violet-100 text-violet-700 border-violet-500')
                  : (darkMode ? 'text-gray-500 hover:bg-red-950/30 hover:text-red-400 border-transparent' : 'text-slate-500 hover:bg-violet-50 border-transparent')
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </aside>

        {/* Main content */}
        <main className="ml-56 flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {showProfile && <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />}
    </div>
  );
}