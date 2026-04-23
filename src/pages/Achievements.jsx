const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const today = new Date().toISOString().split('T')[0];

const feelingLabels = {
  1: '😐 Meh', 2: '🙂 Okay', 3: '😊 Good', 4: '😄 Happy',
  5: '🌟 Proud', 6: '✨ Thrilled', 7: '🎉 Ecstatic',
  8: '🚀 On top of the world', 9: '💫 Extraordinary', 10: '🏆 Legendary'
};

export default function Achievements() {
  const [form, setForm] = useState({ description: '', feeling_score: 7, notes: '' });
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => db.entities.DailyAchievement.list('-date', 50),
  });

  const create = useMutation({
    mutationFn: (d) => db.entities.DailyAchievement.create({ ...d, date: today }),
    onSuccess: () => { qc.invalidateQueries(['achievements']); setForm({ description: '', feeling_score: 7, notes: '' }); setShowForm(false); }
  });

  const remove = useMutation({
    mutationFn: (id) => db.entities.DailyAchievement.delete(id),
    onSuccess: () => qc.invalidateQueries(['achievements']),
  });

  const isDark = document.documentElement.classList.contains('dark-gothic');

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'text-purple-100' : ''}`}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-amber-900 to-yellow-900' : 'bg-gradient-to-br from-amber-400 to-yellow-500'}`}>
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-amber-300' : 'text-slate-800'}`}>Daily Achievements</h1>
              <p className={`text-sm ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>Celebrate your wins, big and small</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(s => !s)}
            className={`flex items-center gap-2 ${isDark ? 'bg-amber-900 hover:bg-amber-800 text-amber-200 border border-amber-700' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'}`}>
            <Plus className="w-4 h-4" />
            Add Achievement
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`rounded-3xl p-6 mb-6 shadow-lg ${isDark ? 'bg-zinc-900/80 border border-amber-900' : 'bg-white border border-amber-100'}`}>
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-300' : 'text-slate-700'}`}>What did you achieve?</p>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe your achievement..."
                rows={3}
                className={`w-full rounded-xl p-3 text-sm resize-none outline-none mb-4 ${isDark ? 'bg-zinc-800 border border-amber-900 text-purple-100 placeholder-purple-700' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}
              />

              <p className={`text-sm font-medium mb-3 ${isDark ? 'text-amber-300' : 'text-slate-700'}`}>
                How does it make you feel? <span className="font-normal ml-1">{feelingLabels[form.feeling_score]}</span>
              </p>
              <Slider value={[form.feeling_score]} onValueChange={([v]) => setForm(f => ({ ...f, feeling_score: v }))}
                min={1} max={10} step={1} className="mb-2" />
              <div className="flex justify-between text-xs text-slate-400 mb-4"><span>Okay</span><span>Legendary</span></div>

              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-300' : 'text-slate-700'}`}>Self notes</p>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="How did you get here? What made it possible?"
                rows={2}
                className={`w-full rounded-xl p-3 text-sm resize-none outline-none mb-4 ${isDark ? 'bg-zinc-800 border border-amber-900 text-purple-100 placeholder-purple-700' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                <Button disabled={!form.description || create.isPending} onClick={() => create.mutate(form)}
                  className={`flex-1 ${isDark ? 'bg-amber-900 hover:bg-amber-800 text-amber-200' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'}`}>
                  {create.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {achievements.length === 0 && (
            <div className={`text-center py-16 rounded-3xl ${isDark ? 'bg-zinc-900/50 border border-amber-900/30' : 'bg-white/60 border border-amber-100'}`}>
              <p className="text-4xl mb-3">🏆</p>
              <p className={`text-lg font-medium ${isDark ? 'text-amber-300' : 'text-slate-600'}`}>No achievements yet today</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-purple-500' : 'text-slate-400'}`}>Every small win counts — log it!</p>
            </div>
          )}
          {achievements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-2xl p-4 ${isDark ? 'bg-zinc-900/70 border border-amber-900/50' : 'bg-white border border-amber-50 shadow-sm'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-amber-200' : 'text-slate-700'}`}>{a.description}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-purple-500' : 'text-slate-400'}`}>{feelingLabels[a.feeling_score]} · {a.date}</p>
                  {a.notes && <p className={`text-xs mt-2 italic ${isDark ? 'text-purple-400' : 'text-slate-500'}`}>{a.notes}</p>}
                </div>
                <button onClick={() => remove.mutate(a.id)} className="ml-3 text-slate-300 hover:text-rose-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full" style={{ width: `${a.feeling_score * 10}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}