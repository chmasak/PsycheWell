import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Users, Sparkles } from 'lucide-react';
import useDarkMode from './useDarkMode';

const options = [
  { id: 'excellent', emoji: '🤩', label: 'Excellent!',   description: 'Had amazing connections today',  lightBg: 'bg-emerald-50 border-emerald-300',  darkBg: 'bg-emerald-950/30 border-emerald-800',  color: 'from-emerald-400 to-teal-500' },
  { id: 'good',      emoji: '😊', label: 'Good',          description: 'Nice interactions overall',       lightBg: 'bg-green-50 border-green-300',       darkBg: 'bg-green-950/30 border-green-900',      color: 'from-green-400 to-emerald-500' },
  { id: 'neutral',   emoji: '😐', label: 'Neutral',       description: 'Nothing special, just regular',  lightBg: 'bg-amber-50 border-amber-300',       darkBg: 'bg-red-950/40 border-red-900',          color: 'from-amber-400 to-yellow-500' },
  { id: 'poor',      emoji: '😔', label: 'Challenging',   description: 'Some difficult interactions',    lightBg: 'bg-orange-50 border-orange-300',     darkBg: 'bg-red-950/50 border-red-800',          color: 'from-orange-400 to-rose-500' },
  { id: 'none',      emoji: '🏠', label: 'Solo day',      description: 'Kept to myself today',           lightBg: 'bg-slate-50 border-slate-300',       darkBg: 'bg-gray-900/60 border-gray-700',        color: 'from-slate-400 to-slate-500' },
];

const messages = {
  excellent: "That's wonderful! Positive social connections are so important for our wellbeing. 💕",
  good: "Great to hear! Good interactions help keep our spirits up. Keep nurturing those connections!",
  neutral: "That's perfectly fine! Not every day needs to be extraordinary.",
  poor: "I'm sorry to hear that. Challenging interactions can be draining. Remember, it's okay to set boundaries. 💙",
  none: "Some solo time can be refreshing! Introverted days are valid and sometimes necessary for recharging.",
};

export default function SocialInteractionStep({ data, onUpdate, onNext, onBack }) {
  const dark = useDarkMode();
  const [selected, setSelected] = useState(data?.social_interaction_quality || null);

  const handleNext = () => { onUpdate({ social_interaction_quality: selected }); onNext(); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-pink-200 to-rose-300'}`}>
          <Users className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-pink-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>How were your interactions? 👥</h2>
        <p className={dark ? 'text-red-900' : 'text-slate-500'}>Our connections with others greatly influence how we feel.</p>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button key={option.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
            onClick={() => setSelected(option.id)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300
              ${selected === option.id
                ? (dark ? option.darkBg : option.lightBg)
                : (dark ? 'bg-red-950/20 border-red-950 hover:border-red-900' : 'bg-white border-slate-200 hover:border-slate-300')
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                ${selected === option.id ? `bg-gradient-to-br ${option.color}` : (dark ? 'bg-red-950/50' : 'bg-slate-100')}`}>
                {option.emoji}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${selected === option.id ? (dark ? 'text-red-200' : 'text-slate-800') : (dark ? 'text-red-400' : 'text-slate-700')}`}>{option.label}</p>
                <p className={`text-sm ${dark ? 'text-red-800' : 'text-slate-500'}`}>{option.description}</p>
              </div>
              {selected === option.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Sparkles className={`w-5 h-5 ${dark ? 'text-red-500' : 'text-violet-500'}`} />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${dark ? 'bg-red-950/30 border-red-900' : 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200'}`}>
          <p className={`text-center ${dark ? 'text-red-300/80' : 'text-slate-600'}`}>{messages[selected]}</p>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleNext} disabled={!selected} className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'}`}>
          Continue to Meditation 🧘
        </Button>
      </div>
    </motion.div>
  );
}