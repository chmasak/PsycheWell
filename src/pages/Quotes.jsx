const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Quote, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const today = new Date().toISOString().split('T')[0];

export default function Quotes() {
  const [form, setForm] = useState({ quote: '', author: '' });
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => db.entities.DailyQuote.list('-date', 100),
  });

  const create = useMutation({
    mutationFn: (d) => db.entities.DailyQuote.create({ ...d, date: today }),
    onSuccess: () => { qc.invalidateQueries(['quotes']); setForm({ quote: '', author: '' }); setShowForm(false); }
  });

  const remove = useMutation({
    mutationFn: (id) => db.entities.DailyQuote.delete(id),
    onSuccess: () => qc.invalidateQueries(['quotes']),
  });

  return (
    <div className="min-h-screen p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-red-900 to-gray-800">
              <Quote className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">My Quotes</h1>
              <p className="text-sm text-gray-600">Words that nourish the soul</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-900">
            <Plus className="w-4 h-4" />
            Add Quote
          </Button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl p-6 mb-6 shadow-lg bg-gray-950 border border-gray-800">
              <p className="text-sm font-medium mb-2 text-gray-400">Quote</p>
              <textarea
                value={form.quote}
                onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                placeholder="Enter a quote that resonates with you..."
                rows={3}
                className="w-full rounded-xl p-3 text-sm resize-none outline-none mb-4 bg-gray-900 border border-gray-700 text-gray-300 placeholder-gray-700 focus:border-red-900"
              />
              <p className="text-sm font-medium mb-2 text-gray-400">Author</p>
              <input
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                placeholder="Who said it?"
                className="w-full rounded-xl p-3 text-sm outline-none mb-4 bg-gray-900 border border-gray-700 text-gray-300 placeholder-gray-700 focus:border-red-900"
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-gray-700 text-gray-500">Cancel</Button>
                <Button disabled={!form.quote || create.isPending} onClick={() => create.mutate(form)}
                  className="flex-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-900">
                  {create.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved quotes */}
        <div className="space-y-3">
          {quotes.length === 0 && (
            <div className="text-center py-16 rounded-3xl bg-gray-950/50 border border-gray-800/30">
              <p className="text-5xl mb-4">✨</p>
              <p className="text-lg font-medium text-gray-500">No saved quotes yet</p>
              <p className="text-sm mt-1 text-gray-700">Collect words that move you</p>
            </div>
          )}
          {quotes.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-5 bg-gray-950/70 border border-gray-800/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm leading-relaxed italic text-gray-400">"{q.quote}"</p>
                  {q.author && <p className="text-xs mt-2 text-gray-600">— {q.author}</p>}
                  <p className="text-xs mt-1 text-gray-800">{q.date}</p>
                </div>
                <button onClick={() => remove.mutate(q.id)} className="ml-3 text-gray-700 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}