import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Activity, Flame, Heart, Zap } from 'lucide-react';
import useDarkMode from './useDarkMode';

const activityMessages = {
  0:   { emoji: "🛋️", message: "Rest day? That's okay too! Your body sometimes needs a break.",         lightColor: "from-slate-200 to-slate-300",  darkColor: "from-gray-900/80 to-red-950/60" },
  15:  { emoji: "🚶", message: "A little movement goes a long way! Even small steps count.",             lightColor: "from-blue-200 to-cyan-300",    darkColor: "from-red-950/70 to-gray-900/80" },
  30:  { emoji: "💪", message: "Great effort! 30 minutes is a solid foundation for wellness.",           lightColor: "from-green-200 to-emerald-300", darkColor: "from-red-900/60 to-red-950/80" },
  45:  { emoji: "🔥", message: "You're on fire! This level of activity boosts both body and mind.",      lightColor: "from-orange-200 to-amber-300",  darkColor: "from-red-900/70 to-red-800/60" },
  60:  { emoji: "⭐", message: "Incredible! An hour of activity is amazing for your health.",            lightColor: "from-yellow-200 to-orange-300", darkColor: "from-red-800/70 to-red-900/60" },
  90:  { emoji: "🏆", message: "Champion level! You're really prioritizing your physical health.",       lightColor: "from-purple-200 to-pink-300",   darkColor: "from-red-900/80 to-gray-900/70" },
  120: { emoji: "🌟", message: "Wow! You're absolutely crushing it! Remember to stay hydrated!",         lightColor: "from-rose-200 to-red-300",     darkColor: "from-red-800/80 to-red-950/60" },
};

const getMsg = (m) => {
  if (m === 0) return activityMessages[0];
  if (m <= 15) return activityMessages[15];
  if (m <= 30) return activityMessages[30];
  if (m <= 45) return activityMessages[45];
  if (m <= 60) return activityMessages[60];
  if (m <= 90) return activityMessages[90];
  return activityMessages[120];
};

export default function PhysicalActivityStep({ data, onUpdate, onNext, onBack }) {
  const dark = useDarkMode();
  const [minutes, setMinutes] = useState(data?.physical_activity_minutes || 30);
  const msg = getMsg(minutes);

  const handleNext = () => { onUpdate({ physical_activity_minutes: minutes }); onNext(); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-green-200 to-emerald-300'}`}>
          <Activity className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-green-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>Let's get moving! 🏃♀️</h2>
        <p className={dark ? 'text-red-900' : 'text-slate-500'}>Physical activity is nature's mood booster. How active were you today?</p>
      </div>

      <div className="relative">
        <motion.div className={`bg-gradient-to-br ${dark ? msg.darkColor : msg.lightColor} rounded-3xl p-8 text-center border ${dark ? 'border-red-900/40' : 'border-transparent'}`}
          initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <motion.div className="absolute top-4 right-6" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Flame className={`w-6 h-6 ${dark ? 'text-red-700' : 'text-orange-500'}`} />
          </motion.div>
          <motion.div className="absolute bottom-6 left-6" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Heart className={`w-5 h-5 ${dark ? 'text-red-800' : 'text-rose-500'}`} />
          </motion.div>
          <motion.div className="absolute top-8 left-8" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Zap className={`w-4 h-4 ${dark ? 'text-red-700' : 'text-yellow-500'}`} />
          </motion.div>

          <motion.div key={minutes} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl mb-2">
            {msg.emoji}
          </motion.div>
          <div className={`text-5xl font-bold mb-2 ${dark ? 'text-red-300' : 'text-slate-800'}`}>
            {minutes} <span className="text-2xl">min</span>
          </div>
          <motion.p key={msg.message} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={dark ? 'text-red-300/70 max-w-sm mx-auto' : 'text-slate-600 max-w-sm mx-auto'}>
            {msg.message}
          </motion.p>
        </motion.div>
      </div>

      <div className="px-4">
        <Slider value={[minutes]} onValueChange={(val) => setMinutes(val[0])} max={180} min={0} step={5} className="py-4" />
        <div className={`flex justify-between text-sm mt-2 ${dark ? 'text-red-900' : 'text-slate-400'}`}>
          <span>0 min</span><span>1 hour</span><span>2 hours</span><span>3 hours</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleNext} className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'}`}>
          Continue to Meditation 🧘
        </Button>
      </div>
    </motion.div>
  );
}