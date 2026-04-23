const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Monitor } from 'lucide-react';
import useDarkMode from './useDarkMode';

const getAssessment = (minutes) => {
  if (minutes < 60)  return { emoji: '🌿' };
  if (minutes < 180) return { emoji: '✅' };
  if (minutes < 360) return { emoji: '😊' };
  if (minutes < 540) return { emoji: '📱' };
  return               { emoji: '💤' };
};

export default function ScreenTimeStep({ data, onUpdate, onNext, onBack, onSubmit, isSubmitting }) {
  const dark = useDarkMode();
  const [minutes, setMinutes] = useState(data?.screen_time_minutes || 240);
  const [workField, setWorkField] = useState(data?.work_field || null);

  // Load work_field from user profile (set during profile setup)
  useEffect(() => {
    if (!workField) {
      db.auth.me().then(u => {
        if (u?.work_field) setWorkField(u.work_field);
      }).catch(() => {});
    }
  }, []);

  const assessment = getAssessment(minutes);
  const hours = Math.floor(minutes / 60);
  const mins  = minutes % 60;

  const handleNext = () => {
    const screenData = { work_field: workField, screen_time_minutes: minutes };
    onUpdate(screenData);
    if (onSubmit) {
      onSubmit(screenData);
    } else {
      onNext();
    }
  };

  const lightBg = minutes < 180 ? 'from-emerald-100 to-teal-100' : minutes < 360 ? 'from-blue-100 to-cyan-100' : minutes < 540 ? 'from-amber-100 to-yellow-100' : 'from-violet-100 to-purple-100';
  const darkBg  = minutes < 180 ? 'from-green-950/70 to-red-950/60' : minutes < 360 ? 'from-red-950/70 to-gray-900/70' : minutes < 540 ? 'from-red-900/60 to-red-950/70' : 'from-red-800/80 to-red-950/60';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="text-center mb-4">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? 'bg-gradient-to-br from-red-950 to-gray-900' : 'bg-gradient-to-br from-blue-200 to-cyan-300'}`}>
          <Monitor className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-blue-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>Screen Time 📱</h2>
        <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-500'}`}>How much screen time did you have today?</p>
      </div>

      <motion.div
        className={`bg-gradient-to-br ${dark ? darkBg : lightBg} rounded-3xl p-8 text-center border ${dark ? 'border-red-900/30' : 'border-transparent'}`}
      >
        <motion.div key={assessment.emoji} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-3">
          {assessment.emoji}
        </motion.div>
        <div className={`text-5xl font-bold mb-2 ${dark ? 'text-red-200' : 'text-slate-800'}`}>
          {hours > 0 && `${hours}h `}{mins > 0 && `${mins}m`}{hours === 0 && mins === 0 && '0m'}
        </div>
      </motion.div>

      <div className="px-2">
        <Slider value={[minutes]} onValueChange={(val) => setMinutes(val[0])} max={720} min={0} step={15} className="py-4" />
        <div className={`flex justify-between text-xs mt-1 ${dark ? 'text-red-900' : 'text-slate-400'}`}>
          <span>0h</span><span>3h</span><span>6h</span><span>9h</span><span>12h</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className={`flex-1 h-12 ${dark ? 'border-red-900 text-red-400 bg-transparent hover:bg-red-950/40' : ''}`}>Back</Button>
        <Button onClick={handleNext} disabled={isSubmitting}
          className={`flex-1 h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800 disabled:opacity-50' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50'}`}>
          {isSubmitting ? '✨ Analysing...' : 'Get My Analysis ✨'}
        </Button>
      </div>
    </motion.div>
  );
}