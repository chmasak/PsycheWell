import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, TrendingDown, Minus, Sun, Moon, Heart, Brain, Activity, Coffee, RefreshCw } from 'lucide-react';

const factorIcons = {
  sleep: Moon, food: Coffee, activity: Activity,
  social: Heart, meditation: Brain, hobbies: Sun,
};

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-gothic'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark-gothic')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function AnalysisResult({ analysis, data, onNewEntry }) {
  const dark = useDark();
  if (!analysis) return null;

  const moodLabels = {
    happy: 'Happy 😊', sad: 'Sad 😢', anxious: 'Anxious 😰', calm: 'Calm 😌',
    energetic: 'Energetic ⚡', tired: 'Tired 😴', stressed: 'Stressed 😫',
    grateful: 'Grateful 🙏', frustrated: 'Frustrated 😤', hopeful: 'Hopeful 🌟',
    lonely: 'Lonely 🥺', excited: 'Excited 🤩', peaceful: 'Peaceful ☮️',
    confused: 'Confused 😕', motivated: 'Motivated 💪',
  };

  const impactColorsDark = {
    positive: 'bg-emerald-950/60 border-emerald-900 text-emerald-300',
    negative:  'bg-red-950/60    border-red-900    text-red-300',
    neutral:   'bg-gray-900/60   border-gray-800   text-gray-300',
  };
  const impactColorsLight = {
    positive: 'bg-emerald-50  border-emerald-200 text-emerald-700',
    negative:  'bg-rose-50     border-rose-200    text-rose-700',
    neutral:   'bg-slate-50    border-slate-200   text-slate-700',
  };
  const impactIconBgDark = { positive: 'bg-emerald-900', negative: 'bg-red-900', neutral: 'bg-gray-800' };
  const impactIconBgLight = { positive: 'bg-emerald-200', negative: 'bg-rose-200', neutral: 'bg-slate-200' };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg ${dark ? 'bg-gradient-to-br from-red-800 to-red-950' : 'bg-gradient-to-br from-violet-400 to-purple-500'}`}>
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className={`text-3xl font-bold mb-2 ${dark ? 'text-red-400' : 'bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent'}`}>
          Your Wellness Insights
        </h2>
        <p className={dark ? 'text-red-800' : 'text-slate-500'}>Here's what we discovered about your day</p>
      </div>

      {/* Mood Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className={`rounded-3xl p-6 border ${dark ? 'bg-gradient-to-br from-red-950/70 to-gray-900/80 border-red-900/40' : 'bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 border-violet-200'}`}>
        <h3 className={`font-semibold mb-3 ${dark ? 'text-red-300' : 'text-slate-800'}`}>Today's Moods</h3>
        <div className="flex flex-wrap gap-2">
          {data.moods?.map((mood) => (
            <span key={mood} className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${dark ? 'bg-red-950 text-red-300 border border-red-900' : 'bg-white text-violet-700'}`}>
              {moodLabels[mood] || mood}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Overall Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className={`rounded-3xl p-6 border ${dark ? 'bg-red-950/40 border-red-900/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${dark ? 'text-red-300' : 'text-slate-800'}`}>
          <Brain className={`w-5 h-5 ${dark ? 'text-red-700' : 'text-violet-500'}`} />
          Overall Analysis
        </h3>
        <p className={`leading-relaxed ${dark ? 'text-red-200/80' : 'text-slate-600'}`}>{analysis.summary}</p>
      </motion.div>

      {/* Key Factors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
        <h3 className={`font-semibold ${dark ? 'text-red-300' : 'text-slate-800'}`}>Key Factors Affecting Your Mood</h3>
        {analysis.factors?.map((factor, index) => {
          const Icon = factorIcons[factor.type] || Sun;
          const ImpactIcon = factor.impact === 'positive' ? TrendingUp : factor.impact === 'negative' ? TrendingDown : Minus;
          return (
            <motion.div key={factor.type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.1 }}
              className={`p-4 rounded-2xl border-2 ${dark ? impactColorsDark[factor.impact] : impactColorsLight[factor.impact]}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dark ? impactIconBgDark[factor.impact] : impactIconBgLight[factor.impact]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold capitalize">{factor.type}</span>
                    <ImpactIcon className="w-4 h-4" />
                  </div>
                  <p className="text-sm opacity-80">{factor.explanation}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recommendations */}
      {analysis.recommendations?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className={`rounded-3xl p-6 border ${dark ? 'bg-gradient-to-br from-red-950/60 to-gray-900/70 border-red-900/40' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'}`}>
          <h3 className={`font-semibold mb-3 flex items-center gap-2 ${dark ? 'text-red-300' : 'text-slate-800'}`}>
            <Sun className={`w-5 h-5 ${dark ? 'text-red-700' : 'text-amber-500'}`} />
            Tips for Tomorrow
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + index * 0.1 }}
                className={`flex items-start gap-2 ${dark ? 'text-red-200/70' : 'text-slate-600'}`}>
                <span className="text-amber-500 mt-1">✦</span>
                <span>{rec}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* New Entry Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <Button onClick={onNewEntry}
          className={`w-full h-12 text-base font-medium ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 text-red-100 border border-red-800' : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'}`}>
          <RefreshCw className="w-5 h-5 mr-2" />
          Log Another Entry
        </Button>
      </motion.div>
    </motion.div>
  );
}