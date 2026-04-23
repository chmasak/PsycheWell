const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart2, Calendar, CalendarDays, Sparkles } from 'lucide-react';

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-gothic'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark-gothic')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

import DailyAnalysis from '@/components/analytics/DailyAnalysis.jsx';
import WeeklyAnalysis from '@/components/analytics/WeeklyAnalysis.jsx';
import MonthlyAnalysis from '@/components/analytics/MonthlyAnalysis.jsx';

export default function Analytics() {
  const dark = useDark();
  const [activeTab, setActiveTab] = useState('daily');

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['wellness-entries'],
    queryFn: () => db.entities.WellnessEntry.list('-date', 90),
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => db.entities.DailyAchievement.list('-date', 90),
  });

  const { data: regrets = [] } = useQuery({
    queryKey: ['regrets'],
    queryFn: () => db.entities.DailyRegret.list('-date', 90),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['daily-notes'],
    queryFn: () => db.entities.DailyNote.list('-date', 90),
  });

  const { data: gameScores = [] } = useQuery({
    queryKey: ['game-scores'],
    queryFn: () => db.entities.GameScore.list('-date', 90),
  });

  const tabs = [
    { id: 'daily',   label: 'Daily',   icon: Calendar },
    { id: 'weekly',  label: 'Weekly',  icon: CalendarDays },
    { id: 'monthly', label: 'Monthly', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dark ? 'bg-gradient-to-br from-red-800 to-red-950' : 'bg-gradient-to-br from-violet-400 to-purple-500'}`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${dark ? 'text-red-400' : 'bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent'}`}>Psyche Analytics</h1>
              <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-400'}`}>Deep insights into your wellness patterns</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className={`flex gap-2 p-1.5 rounded-2xl shadow-sm mb-6 ${dark ? 'bg-red-950/50 border border-red-900/40' : 'bg-white/70 backdrop-blur-sm border border-white/50'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? (dark ? 'bg-gradient-to-r from-red-800 to-red-950 text-red-200 shadow-md' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md')
                    : (dark ? 'text-red-800 hover:text-red-600' : 'text-slate-500 hover:text-slate-700')}`}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className={`rounded-3xl p-12 text-center ${dark ? 'bg-red-950/40 border border-red-900/40' : 'bg-white/80'}`}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className={`w-8 h-8 mx-auto ${dark ? 'text-red-700' : 'text-violet-400'}`} />
            </motion.div>
            <p className={`mt-4 ${dark ? 'text-red-800' : 'text-slate-400'}`}>Loading your data...</p>
          </div>
        ) : entries.length < 2 ? (
          <div className={`rounded-3xl p-12 text-center border ${dark ? 'bg-red-950/40 border-red-900/40' : 'bg-white/80 border-white/50'}`}>
            <div className="text-5xl mb-4">📊</div>
            <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-red-300' : 'text-slate-700'}`}>Not enough data yet</h3>
            <p className={`text-sm ${dark ? 'text-red-800' : 'text-slate-400'}`}>Log at least 2 days of wellness data to see your analytics.</p>
            <Link to={createPageUrl('Home')} className={`inline-block mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white ${dark ? 'bg-gradient-to-r from-red-800 to-red-950' : 'bg-gradient-to-r from-violet-500 to-purple-600'}`}>
              Start Logging →
            </Link>
          </div>
        ) : (
          <>
            {activeTab === 'daily'   && <DailyAnalysis   entries={entries} achievements={achievements} regrets={regrets} notes={notes} gameScores={gameScores} />}
            {activeTab === 'weekly'  && <WeeklyAnalysis  entries={entries} />}
            {activeTab === 'monthly' && <MonthlyAnalysis entries={entries} />}
          </>
        )}
      </div>
    </div>
  );
}