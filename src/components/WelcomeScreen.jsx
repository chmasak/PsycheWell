const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { BookmarkCheck } from 'lucide-react';

const quotes = [
  { text: "Every day is a new beginning. Take a deep breath and start again.", author: "Unknown" },
  { text: "You are enough, just as you are.", author: "Meghan Markle" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott" },
  { text: "Be gentle with yourself. You are a child of the universe.", author: "Max Ehrmann" },
  { text: "You don't have to be positive all the time. Healing is not linear.", author: "Lori Deschene" },
  { text: "Nourish yourself. It is medicine for the soul.", author: "Unknown" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
];

const floatingOrbs = [
  { size: 'w-40 h-40', pos: 'top-16 left-8', delay: 0, color: 'from-red-900/30 to-transparent' },
  { size: 'w-24 h-24', pos: 'top-32 right-12', delay: 0.5, color: 'from-gray-700/20 to-transparent' },
  { size: 'w-32 h-32', pos: 'bottom-24 left-16', delay: 1, color: 'from-red-800/20 to-transparent' },
  { size: 'w-20 h-20', pos: 'bottom-16 right-8', delay: 0.3, color: 'from-gray-600/20 to-transparent' },
];

export default function WelcomeScreen({ onDone }) {
  const [quote] = useState(() => quotes[new Date().getDate() % quotes.length]);
  const [phase, setPhase] = useState('in'); // in | show | out
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 600);
    const t2 = setTimeout(() => setPhase('out'), 4200);
    const t3 = setTimeout(() => onDone(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const handleSaveQuote = async (e) => {
    e.stopPropagation();
    if (saved) return;
    await db.entities.DailyQuote.create({
      date: new Date().toISOString().split('T')[0],
      quote: quote.text,
      author: quote.author,
    });
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #050000 0%, #0f0000 50%, #111111 100%)' }}>

      {/* Floating orbs */}
      {floatingOrbs.map((o, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{ delay: o.delay, duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          className={`absolute ${o.size} ${o.pos} rounded-full bg-gradient-to-br ${o.color} blur-2xl pointer-events-none`} />
      ))}

      {/* Decorative stars */}
      {[...Array(16)].map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ delay: Math.random() * 3, duration: 2 + Math.random() * 2, repeat: Infinity }}
          className="absolute w-1 h-1 rounded-full bg-red-400/40"
          style={{ top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%` }} />
      ))}

      {/* Main content */}
      <AnimatePresence>
        {phase !== 'out' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center px-10 max-w-md relative z-10 flex flex-col items-center"
          >
            {/* Graphic */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-8xl mb-8 select-none"
            >
              🌙
            </motion.div>

            {/* App name */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-bold tracking-widest mb-2"
              style={{ color: '#c87070', fontFamily: "'Cinzel', serif" }}
            >
              PsycheWell
            </motion.p>

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 text-red-800"
            >
              ✦ Welcome Back ✦
            </motion.p>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-xl font-light leading-relaxed italic mb-4"
                style={{ color: '#e8d5d5', fontFamily: "'Cormorant Garamond', serif" }}>
                "{quote.text}"
              </p>
              <p className="text-sm" style={{ color: '#5a3030' }}>— {quote.author}</p>
            </motion.div>

            {/* Save quote button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={handleSaveQuote}
              className={`mt-6 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all border ${
                saved
                  ? 'border-green-900/50 text-green-600 bg-green-950/30'
                  : 'border-red-900/40 text-red-700 hover:text-red-400 hover:border-red-700 bg-transparent'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              {saved ? 'Saved to Quotes ✓' : 'Save this quote'}
            </motion.button>

            {/* Skip */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={onDone}
              className="mt-6 text-xs text-gray-700 hover:text-gray-500 transition-colors tracking-widest uppercase"
            >
              Begin your journey →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}