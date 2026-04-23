import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from 'lucide-react';
import useDarkMode from './useDarkMode';

const moods = [
  { id: 'happy',      emoji: '😊', label: 'Happy',      color: 'from-yellow-300 to-amber-400' },
  { id: 'sad',        emoji: '😢', label: 'Sad',        color: 'from-blue-300 to-indigo-400' },
  { id: 'anxious',    emoji: '😰', label: 'Anxious',    color: 'from-purple-300 to-violet-400' },
  { id: 'calm',       emoji: '😌', label: 'Calm',       color: 'from-teal-300 to-cyan-400' },
  { id: 'energetic',  emoji: '⚡', label: 'Energetic',  color: 'from-orange-300 to-red-400' },
  { id: 'tired',      emoji: '😴', label: 'Tired',      color: 'from-slate-300 to-slate-400' },
  { id: 'stressed',   emoji: '😫', label: 'Stressed',   color: 'from-rose-300 to-pink-400' },
  { id: 'grateful',   emoji: '🙏', label: 'Grateful',   color: 'from-emerald-300 to-green-400' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'from-red-300 to-orange-400' },
  { id: 'hopeful',    emoji: '🌟', label: 'Hopeful',    color: 'from-sky-300 to-blue-400' },
  { id: 'lonely',     emoji: '🥺', label: 'Lonely',     color: 'from-indigo-300 to-purple-400' },
  { id: 'excited',    emoji: '🤩', label: 'Excited',    color: 'from-pink-300 to-rose-400' },
  { id: 'peaceful',   emoji: '☮️', label: 'Peaceful',   color: 'from-green-300 to-teal-400' },
  { id: 'confused',   emoji: '😕', label: 'Confused',   color: 'from-amber-300 to-yellow-400' },
  { id: 'motivated',  emoji: '💪', label: 'Motivated',  color: 'from-lime-300 to-green-400' },
];

export default function MoodSelectionStep({ data, onUpdate, onSubmit, onBack, isSubmitting }) {
  const dark = useDarkMode();
  const [selectedMoods, setSelectedMoods] = useState(data?.moods || []);

  const toggleMood = (moodId) => {
    setSelectedMoods(prev => prev.includes(moodId) ? prev.filter(m => m !== moodId) : [...prev, moodId]);
  };

  const handleSubmit = () => { onUpdate({ moods: selectedMoods }); onSubmit(); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-violet-200 to-purple-300'}`}
          animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-violet-600'}`} />
        </motion.div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>How did you feel today? 🎭</h2>
        <p className={dark ? 'text-red-900' : 'text-slate-500'}>Select all the emotions you experienced. It's okay to feel many things!</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood, index) => {
          const isSelected = selectedMoods.includes(mood.id);
          return (
            <motion.button key={mood.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => toggleMood(mood.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300
                ${isSelected
                  ? (dark ? `border-red-700 bg-gradient-to-br ${mood.color} shadow-lg` : `border-violet-400 bg-gradient-to-br ${mood.color} shadow-lg`)
                  : (dark ? 'border-red-950 bg-red-950/20 hover:border-red-900' : 'border-slate-200 bg-white hover:border-slate-300')
                }`}
            >
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${dark ? 'bg-red-700' : 'bg-violet-500'}`}>
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
              <div className="text-3xl mb-1">{mood.emoji}</div>
              <p className={`text-sm font-medium ${isSelected ? 'text-white' : (dark ? 'text-red-400' : 'text-slate-600')}`}>{mood.label}</p>
            </motion.button>
          );
        })}
      </div>

      {selectedMoods.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className={dark ? 'text-red-700' : 'text-slate-500'}>
            You selected <span className={`font-semibold ${dark ? 'text-red-400' : 'text-violet-600'}`}>{selectedMoods.length}</span> mood{selectedMoods.length > 1 ? 's' : ''}
            {selectedMoods.length >= 3 && " — It's perfectly normal to feel many things!"}
          </p>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleSubmit} disabled={selectedMoods.length === 0 || isSubmitting}
          className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600'}`}>
          {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>✨</motion.div> : "Get My Analysis! ✨"}
        </Button>
      </div>
    </motion.div>
  );
}