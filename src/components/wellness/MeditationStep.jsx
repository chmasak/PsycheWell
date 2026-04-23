import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Wind, Leaf } from 'lucide-react';
import useDarkMode from './useDarkMode';

export default function MeditationStep({ data, onUpdate, onNext, onBack }) {
  const dark = useDarkMode();
  const [meditates, setMeditates] = useState(data?.meditates ?? null);
  const [minutes, setMinutes] = useState(data?.meditation_minutes || 10);

  const handleNext = () => { onUpdate({ meditates, meditation_minutes: meditates ? minutes : 0 }); onNext(); };

  const yesSelected = meditates === true;
  const noSelected = meditates === false;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-cyan-200 to-teal-300'}`}>
          <Sparkles className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-cyan-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>Mindfulness Moment 🧘</h2>
        <p className={dark ? 'text-red-900' : 'text-slate-500'}>Meditation can calm the mind and reduce stress. Do you practice meditation?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setMeditates(true)}
          className={`p-6 rounded-2xl border-2 transition-all duration-300
            ${yesSelected
              ? (dark ? 'border-red-700 bg-red-950/50' : 'border-teal-400 bg-gradient-to-br from-teal-50 to-cyan-50')
              : (dark ? 'border-red-950 bg-red-950/20 hover:border-red-900' : 'border-slate-200 bg-white hover:border-slate-300')
            }`}>
          <div className="text-4xl mb-2">🧘♀️</div>
          <p className={`font-semibold ${dark ? 'text-red-300' : 'text-slate-700'}`}>Yes, I meditate</p>
        </motion.button>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setMeditates(false)}
          className={`p-6 rounded-2xl border-2 transition-all duration-300
            ${noSelected
              ? (dark ? 'border-gray-700 bg-gray-900/60' : 'border-slate-400 bg-gradient-to-br from-slate-50 to-slate-100')
              : (dark ? 'border-red-950 bg-red-950/20 hover:border-red-900' : 'border-slate-200 bg-white hover:border-slate-300')
            }`}>
          <div className="text-4xl mb-2">🙅♀️</div>
          <p className={`font-semibold ${dark ? 'text-red-300' : 'text-slate-700'}`}>Not really</p>
        </motion.button>
      </div>

      {meditates === true && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
          <div className={`relative rounded-3xl p-6 text-center overflow-hidden border ${dark ? 'bg-gradient-to-br from-red-950/70 to-gray-900/80 border-red-900/40' : 'bg-gradient-to-br from-teal-100 via-cyan-50 to-emerald-100 border-transparent'}`}>
            <motion.div className="absolute top-4 right-6" animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Wind className={`w-6 h-6 ${dark ? 'text-red-800' : 'text-teal-400'}`} />
            </motion.div>
            <motion.div className="absolute bottom-4 left-6" animate={{ y: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <Leaf className={`w-5 h-5 ${dark ? 'text-red-900' : 'text-green-400'}`} />
            </motion.div>
            <p className={`text-sm mb-2 ${dark ? 'text-red-600' : 'text-teal-600'}`}>Today's meditation</p>
            <div className={`text-5xl font-bold mb-1 ${dark ? 'text-red-300' : 'text-teal-700'}`}>{minutes} <span className="text-2xl">min</span></div>
            <p className={`text-sm ${dark ? 'text-red-700' : 'text-slate-500'}`}>
              {minutes < 5 && "Every minute counts! 🌱"}
              {minutes >= 5 && minutes < 15 && "A peaceful practice! 🌿"}
              {minutes >= 15 && minutes < 30 && "Wonderful mindfulness session! ✨"}
              {minutes >= 30 && "Deep meditation master! 🧘♂️"}
            </p>
          </div>
          <div className="px-4">
            <Slider value={[minutes]} onValueChange={(val) => setMinutes(val[0])} max={60} min={1} step={1} className="py-4" />
            <div className={`flex justify-between text-sm mt-2 ${dark ? 'text-red-900' : 'text-slate-400'}`}>
              <span>1 min</span><span>30 min</span><span>60 min</span>
            </div>
          </div>
        </motion.div>
      )}

      {meditates === false && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`p-4 rounded-xl border ${dark ? 'bg-red-950/30 border-red-900' : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'}`}>
          <p className={`text-center ${dark ? 'text-red-300/70' : 'text-slate-600'}`}>
            That's totally fine! Not everyone meditates. Maybe consider trying a 1-minute breathing exercise sometime? 💭
          </p>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleNext} disabled={meditates === null} className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'}`}>
          Continue to Medication 💊
        </Button>
      </div>
    </motion.div>
  );
}