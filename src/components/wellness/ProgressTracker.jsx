import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Moon, Activity, Sparkles, Pill, Palette, Monitor } from 'lucide-react';

const steps = [
  { id: 1, title: 'Food',     icon: Utensils },
  { id: 2, title: 'Sleep',    icon: Moon },
  { id: 3, title: 'Move',     icon: Activity },
  { id: 4, title: 'Meditate', icon: Sparkles },
  { id: 5, title: 'Meds',     icon: Pill },
  { id: 6, title: 'Hobbies',  icon: Palette },
  { id: 7, title: 'Screen',   icon: Monitor },
];

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-gothic'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark-gothic')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function ProgressTracker({ currentStep }) {
  const dark = useDark();

  return (
    <div className="mb-8">
      <div className={`relative h-2 rounded-full overflow-hidden mb-4 ${dark ? 'bg-red-950/60' : 'bg-slate-200'}`}>
        <motion.div
          className={`absolute h-full rounded-full ${dark ? 'bg-gradient-to-r from-red-800 to-red-600' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / 7) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between overflow-x-auto pb-2 gap-1">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center min-w-[36px]">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-colors duration-300
                  ${isCompleted
                    ? (dark ? 'bg-gradient-to-br from-red-800 to-red-950' : 'bg-gradient-to-br from-emerald-400 to-teal-500')
                    : isActive
                      ? (dark ? 'bg-gradient-to-br from-red-700 to-red-900 ring-4 ring-red-900/40' : 'bg-gradient-to-br from-violet-400 to-purple-500 ring-4 ring-violet-200')
                      : (dark ? 'bg-red-950/50' : 'bg-slate-200')
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCompleted || isActive ? 'text-white' : (dark ? 'text-red-900' : 'text-slate-400')}`} />
              </motion.div>
              <span className={`text-[10px] ${isActive ? (dark ? 'text-red-500 font-medium' : 'text-violet-600 font-medium') : (dark ? 'text-red-900' : 'text-slate-400')}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}