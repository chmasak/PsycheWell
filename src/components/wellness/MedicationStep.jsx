import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Pill, Shield } from 'lucide-react';
import useDarkMode from './useDarkMode';

const sideEffects = [
  { id: 'drowsy',      emoji: '😴', label: 'Makes me feel sleepy or drowsy' },
  { id: 'mood_swings', emoji: '🎢', label: 'Mood goes up and down' },
  { id: 'low_energy',  emoji: '🔋', label: 'Low energy or fatigue' },
  { id: 'appetite',    emoji: '🍽️', label: 'Changes my appetite' },
  { id: 'anxious',     emoji: '😬', label: 'Feeling restless or on edge' },
  { id: 'focus',       emoji: '🌀', label: 'Hard to focus or think clearly' },
  { id: 'sleep',       emoji: '🌙', label: 'Affects my sleep' },
  { id: 'headache',    emoji: '🤕', label: 'Headaches or body aches' },
  { id: 'none',        emoji: '✅', label: "No noticeable side effects" },
];

export default function MedicationStep({ data, onUpdate, onNext, onBack }) {
  const dark = useDarkMode();
  const [onMedication, setOnMedication] = useState(data?.on_medication ?? null);
  const [selectedEffects, setSelectedEffects] = useState(data?.medication_side_effects || []);

  const toggleEffect = (id) => {
    if (id === 'none') {
      setSelectedEffects(['none']);
      return;
    }
    setSelectedEffects(prev => {
      const without = prev.filter(e => e !== 'none');
      return without.includes(id) ? without.filter(e => e !== id) : [...without, id];
    });
  };

  const handleNext = () => {
    onUpdate({
      on_medication: onMedication,
      medication_side_effects: onMedication ? selectedEffects : [],
    });
    onNext();
  };

  const inactiveBtn = dark
    ? 'bg-red-950/20 border-red-950 text-red-800 hover:border-red-900'
    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300';
  const activeBtn = dark
    ? 'bg-red-950/60 border-red-700 text-red-300'
    : 'bg-violet-100 border-violet-400 text-violet-700';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-rose-200 to-pink-300'}`}>
          <Pill className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-rose-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>Medication Check 💊</h2>
        <p className={dark ? 'text-red-900' : 'text-slate-500'}>Some medications can affect how we feel. Are you currently taking any?</p>
      </div>

      <div className={`flex items-start gap-3 p-4 rounded-xl border ${dark ? 'bg-red-950/20 border-red-900' : 'bg-blue-50 border-blue-200'}`}>
        <Shield className={`w-5 h-5 mt-0.5 flex-shrink-0 ${dark ? 'text-red-600' : 'text-blue-500'}`} />
        <p className={`text-sm ${dark ? 'text-red-400' : 'text-blue-700'}`}>This helps us understand what might be affecting your mood. Your data is private and secure.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setOnMedication(true)}
          className={`p-6 rounded-2xl border-2 transition-all duration-300
            ${onMedication === true
              ? (dark ? 'border-red-700 bg-red-950/50' : 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50')
              : (dark ? 'border-red-950 bg-red-950/20 hover:border-red-900' : 'border-slate-200 bg-white hover:border-slate-300')}`}>
          <div className="text-4xl mb-2">💊</div>
          <p className={`font-semibold ${dark ? 'text-red-300' : 'text-slate-700'}`}>Yes, I am</p>
        </motion.button>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setOnMedication(false); setSelectedEffects([]); }}
          className={`p-6 rounded-2xl border-2 transition-all duration-300
            ${onMedication === false
              ? (dark ? 'border-green-900 bg-green-950/30' : 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50')
              : (dark ? 'border-red-950 bg-red-950/20 hover:border-red-900' : 'border-slate-200 bg-white hover:border-slate-300')}`}>
          <div className="text-4xl mb-2">✨</div>
          <p className={`font-semibold ${dark ? 'text-red-300' : 'text-slate-700'}`}>No medication</p>
        </motion.button>
      </div>

      {onMedication === true && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
          <p className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-slate-700'}`}>
            Are you noticing any of these? <span className={`font-normal text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>(pick all that apply)</span>
          </p>
          <div className="grid grid-cols-1 gap-2">
            {sideEffects.map(effect => (
              <motion.button key={effect.id} whileTap={{ scale: 0.97 }}
                onClick={() => toggleEffect(effect.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all
                  ${selectedEffects.includes(effect.id) ? activeBtn : inactiveBtn}`}>
                <span className="text-lg">{effect.emoji}</span>
                <span>{effect.label}</span>
                {selectedEffects.includes(effect.id) && (
                  <span className="ml-auto">✓</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {onMedication === false && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`p-4 rounded-xl border ${dark ? 'bg-green-950/20 border-green-900' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'}`}>
          <p className={`text-center ${dark ? 'text-green-400/70' : 'text-slate-600'}`}>One less thing to track — great! 🌿</p>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleNext} disabled={onMedication === null}
          className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'}`}>
          Continue to Hobbies 🎨
        </Button>
      </div>
    </motion.div>
  );
}