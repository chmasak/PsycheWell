import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMoodScore } from './statsUtils';
import { Calendar } from 'lucide-react';

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-gothic'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark-gothic')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function DailyAnalysis({ entries, achievements = [], regrets = [], notes = [], gameScores = [] }) {
  const dark = useDark();
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  const [selectedIdx, setSelectedIdx] = useState(0);
  const entry = sorted[selectedIdx];

  if (!entry) return <div className={`text-center py-12 ${dark ? 'text-red-900' : 'text-slate-400'}`}>No entries yet.</div>;

  const date = entry.date;

  // Match by date string
  const dayAchievements = achievements.filter(a => a.date === date);
  const dayRegrets      = regrets.filter(r => r.date === date);
  const dayNote         = notes.find(n => n.date === date);
  const dayGames        = gameScores.filter(g => g.date === date);

  const moodScore = getMoodScore(entry.moods);

  // Build mood impact items — qualitative, no numeric mood values
  const moodImpactItems = [
    {
      emoji: '🌙',
      label: 'Sleep',
      value: entry.sleep_hours != null ? `${entry.sleep_hours}h` : null,
      impact: entry.sleep_hours == null ? 'neutral'
        : entry.sleep_hours >= 7 ? 'positive'
        : entry.sleep_hours >= 5 ? 'neutral'
        : 'negative',
      note: entry.sleep_hours == null ? 'Not logged'
        : entry.sleep_hours >= 7 ? 'Well-rested — supports emotional stability and focus.'
        : entry.sleep_hours >= 5 ? 'Borderline sleep — may cause mild fatigue or irritability.'
        : 'Low sleep — likely contributed to lower mood and energy today.',
    },
    {
      emoji: '🏃',
      label: 'Physical Activity',
      value: entry.physical_activity_minutes != null ? `${entry.physical_activity_minutes} min` : null,
      impact: entry.physical_activity_minutes == null ? 'neutral'
        : entry.physical_activity_minutes >= 60 ? 'positive'
        : entry.physical_activity_minutes >= 30 ? 'neutral'
        : entry.physical_activity_minutes > 0 ? 'neutral'
        : 'negative',
      note: entry.physical_activity_minutes == null ? 'Not logged'
        : entry.physical_activity_minutes >= 60 ? 'Great activity — endorphins boost mood and reduce stress.'
        : entry.physical_activity_minutes >= 30 ? 'Moderate movement — helpful, but more would amplify mood benefits.'
        : entry.physical_activity_minutes > 0 ? 'Light activity — every bit helps, though more is better.'
        : 'No activity today — sedentary days can lower energy and mood.',
    },
    {
      emoji: '📱',
      label: 'Screen Time',
      value: entry.screen_time_minutes != null ? `${Math.floor(entry.screen_time_minutes / 60)}h ${entry.screen_time_minutes % 60}m` : null,
      impact: entry.screen_time_minutes == null ? 'neutral'
        : entry.screen_time_minutes <= 180 ? 'positive'
        : entry.screen_time_minutes <= 360 ? 'neutral'
        : 'negative',
      note: entry.screen_time_minutes == null ? 'Not tracked for this day.'
        : entry.screen_time_minutes <= 180 ? `${Math.floor(entry.screen_time_minutes / 60)}h ${entry.screen_time_minutes % 60}m — excellent digital balance today, minimal eye strain and cognitive fatigue.`
        : entry.screen_time_minutes <= 360 ? `${Math.floor(entry.screen_time_minutes / 60)}h ${entry.screen_time_minutes % 60}m — moderate usage. Consider screen-free breaks to protect focus and sleep quality.`
        : `${Math.floor(entry.screen_time_minutes / 60)}h ${entry.screen_time_minutes % 60}m — extended screen exposure can elevate mental fatigue, disrupt melatonin, and dampen mood by evening.`,
    },
    {
      emoji: '🧘',
      label: 'Meditation',
      value: entry.meditates ? `${entry.meditation_minutes} min` : 'None',
      impact: entry.meditates && entry.meditation_minutes >= 10 ? 'positive'
        : entry.meditates ? 'neutral'
        : 'neutral',
      note: entry.meditates && entry.meditation_minutes >= 10 ? 'Good meditation session — helps regulate emotions and reduce anxiety.'
        : entry.meditates ? 'Short meditation — even a few minutes can ground your mind.'
        : 'No meditation today — adding even 5 minutes can improve emotional resilience.',
    },
    {
      emoji: '🍽️',
      label: 'Meals',
      value: entry.meals?.length > 0 ? `${entry.meals.filter(m => !m.skipped).length} logged` : null,
      impact: (() => {
        if (!entry.meals?.length) return 'neutral';
        const moods = entry.meals.filter(m => !m.skipped && m.mood).map(m => m.mood);
        const positive = moods.filter(m => ['happy', 'energetic', 'content', 'grateful'].includes(m)).length;
        const negative = moods.filter(m => ['sad', 'anxious', 'stressed', 'overwhelmed'].includes(m)).length;
        return positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral';
      })(),
      note: (() => {
        if (!entry.meals?.length) return 'No meals logged.';
        const skipped = entry.meals.filter(m => m.skipped).length;
        const total = entry.meals.length;
        if (skipped === total) return 'All meals skipped — irregular eating can affect energy and mood.';
        if (skipped > 0) return `${skipped} meal(s) skipped — missed meals can cause energy dips.`;
        return 'All meals logged — regular eating supports stable energy and mood.';
      })(),
    },
    {
      emoji: '🎨',
      label: 'Hobbies',
      value: entry.has_hobbies ? `${entry.hobby_minutes ?? 0} min` : 'None today',
      impact: entry.has_hobbies && (entry.hobby_minutes ?? 0) >= 30 ? 'positive'
        : entry.has_hobbies ? 'neutral'
        : 'neutral',
      note: !entry.has_hobbies
        ? 'No hobby time today — engaging in activities you enjoy, even briefly, is one of the strongest mood boosters.'
        : (entry.hobby_minutes ?? 0) >= 60
        ? `${entry.hobby_minutes} min of hobbies — a meaningful block of time for yourself. Creative and leisure activities strongly support positive mood and reduce stress.`
        : (entry.hobby_minutes ?? 0) >= 30
        ? `${entry.hobby_minutes} min of hobbies — solid engagement. Sustained hobby time is linked to lower anxiety and higher life satisfaction.`
        : `${entry.hobby_minutes ?? 0} min of hobbies — a short but meaningful start. Even brief moments of joy add up to better mood across the day.`,
    },
  ];

  const moodEmojis = {
    happy: '😄', calm: '😌', sad: '😔', anxious: '😟', energetic: '⚡',
    tired: '😴', angry: '😤', grateful: '🙏', hopeful: '🌱', lonely: '😶',
    excited: '🎉', stressed: '😰', content: '🙂', overwhelmed: '😵', inspired: '✨',
  };

  const analysis = entry.mood_analysis;

  const card = dark ? 'bg-red-950/40 border border-red-900/50' : 'bg-white border border-slate-100 shadow-sm';
  const cardText = dark ? 'text-red-200' : 'text-slate-800';
  const mutedText = dark ? 'text-red-800' : 'text-slate-400';
  const subText = dark ? 'text-red-700' : 'text-slate-400';

  return (
    <div className="space-y-5">
      {/* Entry selector */}
      <div className={`rounded-2xl p-4 ${card}`}>
        <p className={`text-xs mb-2 font-medium uppercase tracking-wide ${mutedText}`}>SELECT DATE</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.slice(0, 14).map((e, i) => (
            <button key={e.id} onClick={() => setSelectedIdx(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all
                ${selectedIdx === i
                  ? (dark ? 'bg-gradient-to-r from-red-800 to-red-950 text-red-200 shadow' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow')
                  : (dark ? 'bg-red-950/60 text-red-700 hover:bg-red-900/50 hover:text-red-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>
              {new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>
      </div>

      {/* Date + Mood Emojis */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className={`rounded-3xl p-5 border ${dark ? 'bg-gradient-to-br from-red-950/70 to-gray-900/80 border-red-900/40' : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200'}`}>
        <p className={`font-semibold flex items-center gap-2 mb-4 ${dark ? 'text-red-300' : 'text-slate-700'}`}>
          <Calendar className={`w-4 h-4 ${dark ? 'text-red-600' : 'text-violet-500'}`} />
          {new Date(entry.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        {entry.moods?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {entry.moods.map(m => (
              <span key={m} className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${dark ? 'bg-red-950/60 text-red-300 border border-red-800' : 'bg-white text-slate-700 border border-violet-200 shadow-sm'}`}>
                <span>{moodEmojis[m] || '💭'}</span> {m}
              </span>
            ))}
          </div>
        ) : (
          <p className={`text-sm ${subText}`}>No moods logged for this day</p>
        )}
      </motion.div>

      {/* Mood Impact Analysis */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`rounded-3xl p-5 ${card}`}>
        <p className={`text-xs mb-4 font-medium uppercase tracking-wide ${mutedText}`}>✦ How Today's Habits Shaped Your Mood</p>
        <div className="space-y-3">
          {moodImpactItems.map((item, i) => {
            const impactColor = item.impact === 'positive'
              ? (dark ? 'text-green-400' : 'text-green-600')
              : item.impact === 'negative'
              ? (dark ? 'text-red-400' : 'text-rose-500')
              : (dark ? 'text-amber-600' : 'text-amber-500');
            const impactBg = item.impact === 'positive'
              ? (dark ? 'bg-green-950/40 border-green-900/40' : 'bg-green-50 border-green-100')
              : item.impact === 'negative'
              ? (dark ? 'bg-red-950/60 border-red-900/50' : 'bg-rose-50 border-rose-100')
              : (dark ? 'bg-amber-950/30 border-amber-900/30' : 'bg-amber-50 border-amber-100');
            const impactIcon = item.impact === 'positive' ? '↑' : item.impact === 'negative' ? '↓' : '→';
            return (
              <motion.div key={item.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.05 }}
                className={`rounded-2xl px-4 py-3 border ${impactBg} flex items-start gap-3`}>
                <span className="text-xl mt-0.5">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold ${dark ? 'text-red-200' : 'text-slate-700'}`}>{item.label}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.value && <span className={`text-xs font-medium ${dark ? 'text-red-400' : 'text-slate-500'}`}>{item.value}</span>}
                      <span className={`text-xs font-bold ${impactColor}`}>{impactIcon}</span>
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 leading-relaxed ${dark ? 'text-red-800' : 'text-slate-500'}`}>{item.note}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Daily Note */}
      {dayNote && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className={`rounded-3xl p-5 ${card}`}>
          <p className={`text-xs mb-2 font-medium uppercase tracking-wide ${mutedText}`}>📓 Daily Note</p>
          {dayNote.title && <p className={`text-sm font-semibold mb-1 ${dark ? 'text-red-200' : 'text-slate-700'}`}>{dayNote.title}</p>}
          <p className={`text-sm leading-relaxed ${dark ? 'text-red-200/70' : 'text-slate-600'}`}>{dayNote.body}</p>
        </motion.div>
      )}

      {/* Achievements */}
      {dayAchievements.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
          className={`rounded-3xl p-5 ${card}`}>
          <p className={`text-xs mb-3 font-medium uppercase tracking-wide ${mutedText}`}>🏆 Achievements</p>
          <div className="space-y-2">
            {dayAchievements.map((a, i) => (
              <div key={i} className={`rounded-xl px-4 py-3 flex items-start gap-3 ${dark ? 'bg-yellow-950/30 border border-yellow-900/30' : 'bg-amber-50 border border-amber-100'}`}>
                <span className="text-lg mt-0.5">⭐</span>
                <div>
                  <p className={`text-sm font-medium ${dark ? 'text-yellow-300' : 'text-amber-800'}`}>{a.description}</p>
                  {a.notes && <p className={`text-xs mt-0.5 ${dark ? 'text-yellow-900' : 'text-amber-600'}`}>{a.notes}</p>}
                  {a.feeling_score != null && (
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, s) => (
                        <span key={s} className={`text-xs ${s < a.feeling_score ? '⭐' : '☆'}`}>{s < a.feeling_score ? '⭐' : '☆'}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Regrets */}
      {dayRegrets.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.31 }}
          className={`rounded-3xl p-5 ${card}`}>
          <p className={`text-xs mb-3 font-medium uppercase tracking-wide ${mutedText}`}>💭 Reflections</p>
          <div className="space-y-2">
            {dayRegrets.map((r, i) => (
              <div key={i} className={`rounded-xl px-4 py-3 flex items-start gap-3 ${dark ? 'bg-slate-900/60 border border-slate-800/50' : 'bg-slate-50 border border-slate-100'}`}>
                <span className="text-lg mt-0.5">🌿</span>
                <div>
                  <p className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{r.description}</p>
                  {r.notes && <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{r.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mind Games */}
      {dayGames.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }}
          className={`rounded-3xl p-5 ${card}`}>
          <p className={`text-xs mb-3 font-medium uppercase tracking-wide ${mutedText}`}>🎮 Mind Games</p>
          <div className="space-y-3">
            {dayGames.map((g, i) => {
              const isZen = g.game === 'zen_tracing';
              const fogColor = g.brain_fog_score < 3 ? '#6ee7b7' : g.brain_fog_score < 5 ? '#93c5fd' : g.brain_fog_score < 7 ? '#c4b5fd' : '#fda4af';
              return (
                <div key={i} className={`rounded-xl p-4 ${dark ? 'bg-red-950/30 border border-red-900/30' : 'bg-violet-50 border border-violet-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-semibold ${dark ? 'text-red-200' : 'text-slate-700'}`}>
                      {isZen ? '🌀 Zen Tracing' : '💭 Thought Dump'}
                    </p>
                    {g.score != null && (
                      <span className="text-sm font-bold" style={{ color: isZen ? fogColor : (dark ? '#c4b5fd' : '#7c3aed') }}>
                        {g.score}/100
                      </span>
                    )}
                  </div>
                  {isZen ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Precision', value: g.precision != null ? `${g.precision}%` : '—' },
                        { label: 'Stability', value: g.stability != null ? `${g.stability}%` : '—' },
                        { label: 'Brain Fog', value: g.brain_fog_score != null ? `${g.brain_fog_score}/10` : '—' },
                      ].map(s => (
                        <div key={s.label} className={`rounded-lg p-2 text-center ${dark ? 'bg-red-950/40' : 'bg-white'}`}>
                          <p className="text-sm font-semibold" style={{ color: fogColor }}>{s.value}</p>
                          <p className={`text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className={`rounded-lg px-3 py-2 text-center ${dark ? 'bg-red-950/40' : 'bg-white'}`}>
                        <p className={`text-sm font-semibold ${dark ? 'text-violet-300' : 'text-violet-600'}`}>{g.thoughts_count ?? 0}</p>
                        <p className={`text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>Thoughts released</p>
                      </div>
                      {g.emotion_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center">
                          {g.emotion_tags.map(t => (
                            <span key={t} className={`px-2 py-0.5 rounded-full text-xs ${dark ? 'bg-red-950/60 text-red-400' : 'bg-violet-100 text-violet-600'}`}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {g.fog_label && <p className={`text-xs mt-2 ${dark ? 'text-red-800' : 'text-slate-400'}`}>{g.fog_label}</p>}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* AI Summary */}
      {analysis?.summary && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.37 }}
          className={`rounded-3xl p-5 ${card}`}>
          <p className={`text-xs mb-3 font-medium uppercase tracking-wide ${mutedText}`}>✨ AI Analysis</p>
          <p className={`text-sm leading-relaxed mb-4 ${dark ? 'text-red-200/80' : 'text-slate-600'}`}>{analysis.summary}</p>

          {analysis.factors?.length > 0 && (
            <div className="mb-4">
              <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${dark ? 'text-red-700' : 'text-slate-400'}`}>Key Factors</p>
              <div className="space-y-2">
                {analysis.factors.map((f, i) => {
                  const impactColor = f.impact === 'positive'
                    ? (dark ? 'text-green-400' : 'text-green-600')
                    : f.impact === 'negative'
                    ? (dark ? 'text-red-400' : 'text-rose-500')
                    : (dark ? 'text-amber-600' : 'text-amber-500');
                  const impactIcon = f.impact === 'positive' ? '↑' : f.impact === 'negative' ? '↓' : '→';
                  const factorEmoji = {
                    sleep: '🌙', food: '🍽️', activity: '🏃', social: '👥',
                    meditation: '🧘', hobbies: '🎨', medication: '💊',
                    medication_side_effects: '⚕️', screen_time: '📱',
                  }[f.type] || '✦';
                  return (
                    <div key={i} className={`flex items-start gap-2.5 text-xs ${dark ? 'text-red-200/70' : 'text-slate-600'}`}>
                      <span className="text-base leading-none mt-0.5">{factorEmoji}</span>
                      <div className="flex-1">
                        <span className={`font-semibold mr-1 ${impactColor}`}>{impactIcon} {f.type?.replace(/_/g, ' ')}</span>
                        — {f.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {analysis.recommendations?.length > 0 && (
            <div>
              <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${dark ? 'text-red-700' : 'text-slate-400'}`}>Recommendations for Tomorrow</p>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className={`flex items-start gap-2 text-sm ${dark ? 'text-red-300/80' : 'text-slate-600'}`}>
                    <span className={`mt-1 text-xs shrink-0 ${dark ? 'text-red-700' : 'text-violet-400'}`}>✦</span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}