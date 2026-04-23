const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Palette, Music, Book, Gamepad2, Camera, Heart, Plus } from 'lucide-react';

import useDarkMode from './useDarkMode';

const hobbyIcons = [
  { icon: Palette, lightColor: 'text-pink-500',  darkColor: 'text-red-700' },
  { icon: Music,   lightColor: 'text-purple-500', darkColor: 'text-red-800' },
  { icon: Book,    lightColor: 'text-blue-500',   darkColor: 'text-red-700' },
  { icon: Gamepad2,lightColor: 'text-green-500',  darkColor: 'text-red-800' },
  { icon: Camera,  lightColor: 'text-amber-500',  darkColor: 'text-red-700' },
];

const defaultSuggestions = [
  '🎨 Drawing / Painting', '🎵 Music', '📚 Reading', '🎮 Gaming',
  '📷 Photography', '🍳 Cooking', '🧘 Yoga / Stretching', '🌱 Gardening',
  '✍️ Writing / Journaling', '🏃 Running / Walking', '🎬 Watching films', '🧩 Puzzles',
];

export default function HobbiesStep({ data, onUpdate, onNext, onBack }) {
  const dark = useDarkMode();
  const [savedHobbies, setSavedHobbies] = useState(null); // null = loading
  const [selectedHobbies, setSelectedHobbies] = useState(data?.selected_hobbies || []);
  const [newHobby, setNewHobby] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [didHobbies, setDidHobbies] = useState(data?.has_hobbies ?? null);
  const [minutes, setMinutes] = useState(data?.hobby_minutes || 30);

  useEffect(() => {
    db.auth.me().then(user => {
      setSavedHobbies(user?.hobbies || []);
    }).catch(() => setSavedHobbies([]));
  }, []);

  const isFirstTime = savedHobbies !== null && savedHobbies.length === 0;
  const displayHobbies = savedHobbies?.length > 0 ? savedHobbies : defaultSuggestions;

  const toggleHobby = (h) => {
    setSelectedHobbies(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };

  const addNewHobby = () => {
    const trimmed = newHobby.trim();
    if (!trimmed) return;
    if (!selectedHobbies.includes(trimmed)) setSelectedHobbies(prev => [...prev, trimmed]);
    setNewHobby('');
    setShowAddNew(false);
  };

  const handleNext = async () => {
    // Save hobbies to user profile for future visits
    if (selectedHobbies.length > 0) {
      const existing = savedHobbies || [];
      const merged = Array.from(new Set([...existing, ...selectedHobbies]));
      await db.auth.updateMe({ hobbies: merged });
    }
    onUpdate({
      has_hobbies: didHobbies,
      selected_hobbies: didHobbies ? selectedHobbies : [],
      hobby_minutes: didHobbies ? minutes : 0,
    });
    onNext();
  };

  const canContinue = didHobbies === false || (didHobbies === true && selectedHobbies.length > 0);

  const inactiveBtn = dark ? 'bg-red-950/20 border-red-950 text-red-800 hover:border-red-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300';
  const activeBtn   = dark ? 'bg-red-950/60 border-red-700 text-red-300' : 'bg-violet-100 border-violet-400 text-violet-700';

  if (savedHobbies === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${dark ? 'border-red-700' : 'border-violet-500'}`} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-amber-200 to-orange-300'}`}>
          <Palette className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-amber-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>Hobby Time! 🎨</h2>
        <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-500'}`}>
          {isFirstTime
            ? "What do you love doing in your free time? Pick all that apply — we'll remember them for you!"
            : "Did you spend time on any of your hobbies today?"}
        </p>
      </div>

      {/* Did you do hobbies today? */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setDidHobbies(true)}
          className={`p-5 rounded-2xl border-2 transition-all duration-300
            ${didHobbies === true
              ? (dark ? 'border-red-700 bg-red-950/50' : 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50')
              : (dark ? 'border-red-950 bg-red-950/20 hover:border-red-900' : 'border-slate-200 bg-white hover:border-slate-300')}`}>
          <div className="flex justify-center gap-1 mb-2">
            {hobbyIcons.map(({ icon: Icon, lightColor, darkColor }, i) => (
              <motion.div key={i} animate={didHobbies === true ? { y: [0, -4, 0] } : {}} transition={{ delay: i * 0.1, duration: 1, repeat: Infinity }}>
                <Icon className={`w-5 h-5 ${dark ? darkColor : lightColor}`} />
              </motion.div>
            ))}
          </div>
          <p className={`font-semibold text-sm ${dark ? 'text-red-300' : 'text-slate-700'}`}>Yes! I did 🎉</p>
        </motion.button>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setDidHobbies(false); setSelectedHobbies([]); }}
          className={`p-5 rounded-2xl border-2 transition-all duration-300
            ${didHobbies === false
              ? (dark ? 'border-gray-700 bg-gray-900/60' : 'border-slate-400 bg-gradient-to-br from-slate-50 to-slate-100')
              : (dark ? 'border-red-950 bg-red-950/20 hover:border-red-900' : 'border-slate-200 bg-white hover:border-slate-300')}`}>
          <div className="text-3xl mb-2">🤔</div>
          <p className={`font-semibold text-sm ${dark ? 'text-red-300' : 'text-slate-700'}`}>Not today</p>
        </motion.button>
      </div>

      {/* Hobby picker */}
      {didHobbies === true && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
          <p className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-slate-700'}`}>
            {isFirstTime ? 'Which of these do you enjoy?' : 'Which ones did you do today?'}
            <span className={`font-normal text-xs ml-1 ${dark ? 'text-red-800' : 'text-slate-400'}`}>(pick all that apply)</span>
          </p>

          <div className="grid grid-cols-2 gap-2">
            {displayHobbies.map(h => (
              <motion.button key={h} whileTap={{ scale: 0.96 }}
                onClick={() => toggleHobby(h)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm font-medium transition-all
                  ${selectedHobbies.includes(h) ? activeBtn : inactiveBtn}`}>
                <span className="truncate">{h}</span>
                {selectedHobbies.includes(h) && <span className="ml-auto flex-shrink-0">✓</span>}
              </motion.button>
            ))}
          </div>

          {/* Add a new hobby */}
          <AnimatePresence>
            {showAddNew ? (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex gap-2">
                <input value={newHobby} onChange={e => setNewHobby(e.target.value)} placeholder="Type your hobby..."
                  onKeyDown={e => e.key === 'Enter' && addNewHobby()}
                  className={dark
                    ? 'flex-1 rounded-xl px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-gray-300 placeholder-gray-600 outline-none focus:border-red-900'
                    : 'flex-1 rounded-xl px-3 py-2 text-sm bg-white border border-slate-200 text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400'} />
                <Button onClick={addNewHobby} size="sm" className={dark ? 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-900' : 'bg-violet-500 hover:bg-violet-600 text-white'}>Add</Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddNew(false)} className={dark ? 'border-gray-700 text-gray-500' : ''}>Cancel</Button>
              </motion.div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAddNew(true)}
                className={dark ? 'border-dashed border-2 border-gray-700 text-gray-600 hover:border-red-900 bg-transparent w-full' : 'border-dashed border-2 hover:border-violet-300 hover:bg-violet-50 w-full'}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add something else
              </Button>
            )}
          </AnimatePresence>

          {/* Time slider */}
          {selectedHobbies.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className={`rounded-2xl p-5 text-center border ${dark ? 'bg-gradient-to-br from-red-950/70 to-gray-900/80 border-red-900/40' : 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 border-transparent'}`}>
                <p className={`text-sm mb-1 ${dark ? 'text-red-700' : 'text-amber-600'}`}>Time spent today</p>
                <div className={`text-4xl font-bold mb-1 ${dark ? 'text-red-300' : 'text-amber-700'}`}>{minutes} <span className="text-xl">min</span></div>
                <p className={`text-sm ${dark ? 'text-red-700' : 'text-slate-500'}`}>
                  {minutes < 15 && "A little goes a long way! 💫"}
                  {minutes >= 15 && minutes < 45 && "Nice time well spent! 🌟"}
                  {minutes >= 45 && minutes < 90 && "Wonderful! This is great for your soul. ✨"}
                  {minutes >= 90 && "You really made time for yourself today! 🎉"}
                </p>
              </div>
              <div className="px-4">
                <Slider value={[minutes]} onValueChange={(val) => setMinutes(val[0])} max={180} min={5} step={5} className="py-4" />
                <div className={`flex justify-between text-xs mt-1 ${dark ? 'text-red-900' : 'text-slate-400'}`}>
                  <span>5 min</span><span>1 hr</span><span>2 hrs</span><span>3 hrs</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {didHobbies === false && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`p-4 rounded-xl border ${dark ? 'bg-red-950/30 border-red-900' : 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200'}`}>
          <p className={`text-center text-sm ${dark ? 'text-red-300/70' : 'text-slate-600'}`}>
            No worries — life gets busy. Even a few minutes of doing something you enjoy can make a difference. 💜
          </p>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleNext} disabled={!canContinue}
          className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'}`}>
          Continue to Screen Time 📱
        </Button>
      </div>
    </motion.div>
  );
}