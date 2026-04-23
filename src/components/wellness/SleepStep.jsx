import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Moon, Star, Sparkles } from 'lucide-react';
import useDarkMode from './useDarkMode';

const sleepMessages = {
  0: { emoji: "😰", message: "Oh no! No sleep at all? That's really tough. Be extra kind to yourself today." },
  1: { emoji: "😓", message: "Just an hour? Your body must be exhausted." },
  2: { emoji: "😔", message: "Very little sleep can really affect your day. Take it easy when you can." },
  3: { emoji: "😕", message: "A short rest. You might feel foggy today." },
  4: { emoji: "🙂", message: "Not ideal, but you got some rest. Try to sneak in a power nap!" },
  5: { emoji: "😊", message: "Getting there! A bit more would be perfect." },
  6: { emoji: "😌", message: "Decent rest! Most people feel okay with this amount." },
  7: { emoji: "😃", message: "Great! You're in the healthy sleep zone. Your body thanks you!" },
  8: { emoji: "🌟", message: "Perfect! 8 hours is golden. You're set for a great day!" },
  9: { emoji: "💫", message: "Wonderful rest! You gave your body plenty of time to recharge." },
  10: { emoji: "✨", message: "Amazing! You really prioritized your sleep. Fantastic self-care!" },
};

export default function SleepStep({ data, onUpdate, onNext, onBack }) {
  const dark = useDarkMode();
  const [hours, setHours] = useState(data?.sleep_hours || 7);
  const message = sleepMessages[Math.min(Math.floor(hours), 10)] || sleepMessages[10];

  const handleNext = () => { onUpdate({ sleep_hours: hours }); onNext(); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-indigo-200 to-purple-300'}`}>
          <Moon className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-indigo-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>How did you sleep? 🌙</h2>
        <p className={dark ? 'text-red-900' : 'text-slate-500'}>Quality sleep is your superpower! Let's see how much rest you got.</p>
      </div>

      <div className="relative">
        <div className={`rounded-3xl p-8 text-center ${dark ? 'bg-gradient-to-br from-red-950/80 to-gray-900/80 border border-red-900/50' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
          <div className="absolute top-4 left-6"><Star className={`w-4 h-4 ${dark ? 'text-red-800 fill-red-800' : 'text-yellow-400 fill-yellow-400'}`} /></div>
          <div className="absolute top-8 right-8"><Sparkles className={`w-5 h-5 ${dark ? 'text-red-800' : 'text-purple-400'}`} /></div>
          <div className="absolute bottom-6 left-10"><Star className={`w-3 h-3 ${dark ? 'text-red-900 fill-red-900' : 'text-yellow-300 fill-yellow-300'}`} /></div>

          <motion.div key={hours} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl mb-2">
            {message.emoji}
          </motion.div>
          <div className={`text-5xl font-bold mb-2 ${dark ? 'text-red-300' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
            {hours} {hours === 1 ? 'hour' : 'hours'}
          </div>
          <motion.p key={message.message} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={dark ? 'text-red-300/70 max-w-sm mx-auto' : 'text-slate-600 max-w-sm mx-auto'}>
            {message.message}
          </motion.p>
        </div>
      </div>

      <div className="px-4">
        <Slider value={[hours]} onValueChange={(val) => setHours(val[0])} max={12} min={0} step={0.5} className="py-4" />
        <div className={`flex justify-between text-sm mt-2 ${dark ? 'text-red-900' : 'text-slate-400'}`}>
          <span>0 hrs</span><span>6 hrs</span><span>12 hrs</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleNext} className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 text-red-100 border border-red-800' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'}`}>
          Continue to Activity 🏃
        </Button>
      </div>
    </motion.div>
  );
}