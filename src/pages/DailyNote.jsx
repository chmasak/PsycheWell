const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-gothic'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark-gothic')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function DailyNote() {
  const dark = useDark();
  const qc = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['dailynotes'],
    queryFn: () => db.entities.DailyNote.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (d) => db.entities.DailyNote.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dailynotes'] }); setShowForm(false); setTitle(''); setBody(''); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.DailyNote.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dailynotes'] }),
  });

  const handleSave = () => {
    if (!body.trim()) return;
    createMutation.mutate({ date: today, title: title.trim() || 'Untitled', body: body.trim() });
  };

  const card = dark ? 'bg-red-950/40 border border-red-900/50' : 'bg-white border border-slate-100 shadow-sm';
  const inputClass = dark
    ? 'w-full rounded-xl px-3 py-2 text-sm bg-gray-950 border border-gray-800 text-gray-300 placeholder-gray-700 outline-none focus:border-red-900 resize-none'
    : 'w-full rounded-xl px-3 py-2 text-sm bg-white border border-slate-200 text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400 resize-none';

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-violet-100 to-purple-200'}`}>
              <BookOpen className={`w-5 h-5 ${dark ? 'text-red-400' : 'text-violet-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${dark ? 'text-red-200' : 'text-slate-800'}`}>Daily Notes</h1>
              <p className={`text-xs ${dark ? 'text-red-900' : 'text-slate-400'}`}>Your personal diary</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(s => !s)}
            className={dark ? 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-900' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'}>
            <Plus className="w-4 h-4 mr-1" /> New Note
          </Button>
        </motion.div>

        {/* New note form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}
              className={`rounded-3xl p-5 mb-5 ${card}`}>
              <p className={`text-xs font-semibold mb-3 uppercase tracking-wide ${dark ? 'text-red-800' : 'text-slate-400'}`}>
                {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give this entry a title (optional)"
                className={`${inputClass} mb-3`} />
              <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write freely... how was your day? What's on your mind?"
                rows={6} className={`${inputClass} leading-relaxed`} />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}
                  className={`flex-1 ${dark ? 'border-red-900 text-red-400 bg-transparent' : ''}`}>Cancel</Button>
                <Button onClick={handleSave} disabled={!body.trim() || createMutation.isPending}
                  className={`flex-1 ${dark ? 'bg-red-900 hover:bg-red-800 text-red-100 border border-red-800' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'}`}>
                  {createMutation.isPending ? 'Saving...' : 'Save Entry ✨'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${dark ? 'border-red-700' : 'border-violet-500'}`} />
          </div>
        ) : notes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`text-center py-16 rounded-3xl ${card}`}>
            <div className="text-5xl mb-4">📖</div>
            <p className={`font-medium mb-1 ${dark ? 'text-red-300' : 'text-slate-700'}`}>Your diary is empty</p>
            <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-400'}`}>Click "New Note" to write your first entry.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notes.map((note, i) => (
              <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`rounded-2xl overflow-hidden ${card}`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${dark ? 'text-red-200' : 'text-slate-800'}`}>{note.title || 'Untitled'}</p>
                      <p className={`text-xs mt-0.5 ${dark ? 'text-red-900' : 'text-slate-400'}`}>
                        {new Date(note.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      {expandedId !== note.id && (
                        <p className={`text-sm mt-2 line-clamp-2 ${dark ? 'text-red-400/70' : 'text-slate-500'}`}>{note.body}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setExpandedId(expandedId === note.id ? null : note.id)}
                        className={`p-1.5 rounded-lg ${dark ? 'text-red-800 hover:text-red-500 hover:bg-red-950' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                        {expandedId === note.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteMutation.mutate(note.id)}
                        className={`p-1.5 rounded-lg ${dark ? 'text-red-900 hover:text-rose-500 hover:bg-red-950' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedId === note.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <p className={`text-sm mt-3 leading-relaxed whitespace-pre-wrap ${dark ? 'text-red-300/80' : 'text-slate-600'}`}>{note.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}