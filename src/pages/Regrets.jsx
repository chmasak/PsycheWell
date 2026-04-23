const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const today = new Date().toISOString().split('T')[0];

const feelingLabels = {
  1: '😔 Very painful', 2: '😟 Painful', 3: '😕 Somewhat heavy',
  4: '😐 Neutral', 5: '🙂 Acceptable', 6: '😊 Okay', 7: '😌 At peace',
  8: '😄 Liberated', 9: '🌟 Grateful', 10: '✨ Completely healed'
};

export default function Regrets() {
  const [form, setForm] = useState({ description: '', feeling_score: 5, notes: '' });
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: regrets = [] } = useQuery({
    queryKey: ['regrets'],
    queryFn: () => db.entities.DailyRegret.list('-date', 50),
  });

  const create = useMutation({
    mutationFn: (d) => db.entities.DailyRegret.create({ ...d, date: today }),
    onSuccess: () => { qc.invalidateQueries(['regrets']); setForm({ description: '', feeling_score: 5, notes: '' }); setShowForm(false); }
  });

  const remove = useMutation({
    mutationFn: (id) => db.entities.DailyRegret.delete(id),
    onSuccess: () => qc.invalidateQueries(['regrets']),
  });

  const isDark = document.documentElement.classList.contains('dark-gothic');

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'text-purple-100' : ''}`}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-rose-900 to-purple-900' : 'bg-gradient-to-br from-rose-400 to-pink-500'}`}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-rose-300' : 'text-slate-800'}`}>Daily Regrets</h1>
              <p className={`text-sm ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>Release what weighs on you</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(s => !s)}
            className={`flex items-center gap-2 ${isDark ? 'bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-700' : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'}`}>
            <Plus className="w-4 h-4" />
            Add Regret
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`rounded-3xl p-6 mb-6 shadow-lg ${isDark ? 'bg-zinc-900/80 border border-rose-900' : 'bg-white border border-rose-100'}`}>
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-rose-300' : 'text-slate-700'}`}>What do you regret?</p>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the regret..."
                rows={3}
                className={`w-full rounded-xl p-3 text-sm resize-none outline-none mb-4 ${isDark ? 'bg-zinc-800 border border-rose-900 text-purple-100 placeholder-purple-700' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}
              />

              <p className={`text-sm font-medium mb-3 ${isDark ? 'text-rose-300' : 'text-slate-700'}`}>
                How does it make you feel? <span className="font-normal ml-1">{feelingLabels[form.feeling_score]}</span>
              </p>
              <Slider value={[form.feeling_score]} onValueChange={([v]) => setForm(f => ({ ...f, feeling_score: v }))}
                min={1} max={10} step={1} className="mb-2" />
              <div className="flex justify-between text-xs text-slate-400 mb-4"><span>Very painful</span><span>Healed</span></div>

              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-rose-300' : 'text-slate-700'}`}>Self notes</p>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="What would you do differently? Any thoughts..."
                rows={2}
                className={`w-full rounded-xl p-3 text-sm resize-none outline-none mb-4 ${isDark ? 'bg-zinc-800 border border-rose-900 text-purple-100 placeholder-purple-700' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                <Button disabled={!form.description || create.isPending} onClick={() => create.mutate(form)}
                  className={`flex-1 ${isDark ? 'bg-rose-900 hover:bg-rose-800 text-rose-200' : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'}`}>
                  {create.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {regrets.length === 0 && (
            <div className={`text-center py-16 rounded-3xl ${isDark ? 'bg-zinc-900/50 border border-rose-900/30' : 'bg-white/60 border border-rose-100'}`}>
              <p className="text-4xl mb-3">🌿</p>
              <p className={`text-lg font-medium ${isDark ? 'text-rose-300' : 'text-slate-600'}`}>No regrets logged yet</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-purple-500' : 'text-slate-400'}`}>Release them here — awareness is healing</p>
            </div>
          )}
          {regrets.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-2xl p-4 ${isDark ? 'bg-zinc-900/70 border border-rose-900/50' : 'bg-white border border-rose-50 shadow-sm'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-rose-200' : 'text-slate-700'}`}>{r.description}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-purple-500' : 'text-slate-400'}`}>{feelingLabels[r.feeling_score]} · {r.date}</p>
                  {r.notes && <p className={`text-xs mt-2 italic ${isDark ? 'text-purple-400' : 'text-slate-500'}`}>{r.notes}</p>}
                </div>
                <button onClick={() => remove.mutate(r.id)} className="ml-3 text-slate-300 hover:text-rose-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                <div className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full" style={{ width: `${r.feeling_score * 10}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}