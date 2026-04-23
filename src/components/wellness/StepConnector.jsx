import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

export default function StepConnector({ stepNumber, title, isCompleted, isActive, isLocked, icon: Icon }) {
  return (
    <div className="flex items-center gap-4">
      {/* Step Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: stepNumber * 0.1 }}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-500 shadow-lg
          ${isCompleted 
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
            : isActive 
              ? 'bg-gradient-to-br from-violet-400 to-purple-500 ring-4 ring-violet-200' 
              : 'bg-slate-200'
          }
        `}
      >
        {isCompleted ? (
          <Check className="w-6 h-6 text-white" />
        ) : isLocked ? (
          <Lock className="w-5 h-5 text-slate-400" />
        ) : (
          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
        )}
        
        {/* Pulse animation for active step */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-violet-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      {/* Step Title */}
      <div className="flex-1">
        <p className={`text-sm font-medium ${isActive ? 'text-violet-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
          Step {stepNumber}
        </p>
        <p className={`font-semibold ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
          {title}
        </p>
      </div>
    </div>
  );
}