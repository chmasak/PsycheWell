import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line
} from 'recharts';
import {
  getMoodScore, average, stdDev, correlation, lagCorrelation,
  linearTrend, trendLabel, socialQualityScore
} from './statsUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-gothic'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark-gothic')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

const SectionTitle = ({ dark, children }) => (
  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-red-800' : 'text-slate-400'}`}>{children}</p>
);

// Visual correlation card: shows emoji + label + a filled indicator bar
function CorrelationCard({ dark, emoji, label, value }) {
  if (value === null) return null;
  const pct = Math.round(value * 100);
  const isPositive = pct >= 15;
  const isNegative = pct <= -15;
  const barColor = isPositive ? (dark ? '#16a34a' : '#22c55e') : isNegative ? (dark ? '#dc2626' : '#ef4444') : (dark ? '#92400e' : '#f59e0b');
  const icon = isPositive ? '📈' : isNegative ? '📉' : '➡️';
  const label2 = isPositive ? 'Boosts mood' : isNegative ? 'Lowers mood' : 'Neutral';
  const absPct = Math.abs(pct);

  return (
    <div className={`rounded-2xl p-4 ${dark ? 'bg-red-950/40 border border-red-900/50' : 'bg-white border border-slate-100 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <span className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-slate-700'}`}>{label}</span>
        </div>
        <span className="text-base">{icon}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden mb-2 ${dark ? 'bg-red-950' : 'bg-slate-100'}`}>
        <motion.div className="h-full rounded-full" style={{ background: barColor }}
          initial={{ width: 0 }} animate={{ width: `${Math.min(absPct, 100)}%` }} transition={{ duration: 0.6 }} />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>{label2}</span>
        <span className={`text-xs font-semibold`} style={{ color: barColor }}>{pct > 0 ? '+' : ''}{pct}%</span>
      </div>
    </div>
  );
}

// Build all available weeks from entries (Sun→Sat buckets)
function getWeeks(entries) {
  if (!entries.length) return [];
  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const weeks = [];
  let current = [];
  let weekStart = null;

  sorted.forEach(e => {
    const d = new Date(e.date);
    if (!weekStart) {
      weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay()); // go to Sunday
    }
    const diffDays = Math.floor((d - weekStart) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      current.push(e);
    } else {
      if (current.length) weeks.push({ entries: current, start: weekStart });
      weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      current = [e];
    }
  });
  if (current.length) weeks.push({ entries: current, start: weekStart });
  return weeks.reverse(); // most recent first
}

function weekLabel(start) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`;
}

export default function WeeklyAnalysis({ entries }) {
  const dark = useDark();
  const weeks = useMemo(() => getWeeks(entries), [entries]);
  const [weekIdx, setWeekIdx] = useState(0);

  const weekEntries = weeks[weekIdx]?.entries ?? [];

  const stats = useMemo(() => {
    const e = weekEntries;
    const moodScores  = e.map(x => getMoodScore(x.moods));
    const sleepArr    = e.map(x => x.sleep_hours ?? null);
    const activityArr = e.map(x => x.physical_activity_minutes ?? null);
    const screenArr   = e.map(x => x.screen_time_minutes != null ? x.screen_time_minutes / 60 : null);
    const socialArr   = e.map(x => socialQualityScore(x.social_interaction_quality));
    const meditArr    = e.map(x => x.meditates ? (x.meditation_minutes ?? 0) : 0);
    const hobbyArr    = e.map(x => x.has_hobbies ? (x.hobby_minutes ?? 0) : 0);
    return {
      moodScores, sleepArr, activityArr, screenArr, socialArr, meditArr, hobbyArr,
      avgMood:          parseFloat(average(moodScores).toFixed(1)),
      avgSleep:         parseFloat(average(sleepArr.filter(Boolean)).toFixed(1)),
      avgActivity:      Math.round(average(activityArr.filter(Boolean))),
      moodTrend:        linearTrend(moodScores),
      corrSleepMood:    correlation(sleepArr,    moodScores),
      corrActivityMood: correlation(activityArr, moodScores),
      corrScreenMood:   correlation(screenArr,   moodScores),
      corrSocialMood:   correlation(socialArr,   moodScores),
      corrMeditMood:    correlation(meditArr,    moodScores),
      corrHobbyMood:    correlation(hobbyArr,    moodScores),
      lagSleepMood:     lagCorrelation(sleepArr,  moodScores, 1),
    };
  }, [weekEntries]);

  const moodTrendInfo = trendLabel(stats.moodTrend);

  const card = dark ? 'bg-red-950/40 border border-red-900/50' : 'bg-white border border-slate-100 shadow-sm';
  const gridColor = dark ? '#2a0a0a' : '#f1f5f9';
  const axisColor = dark ? '#5a1a1a' : '#94a3b8';
  const tooltipStyle = dark
    ? { borderRadius: 12, background: '#1a0505', border: '1px solid #5a0000', color: '#e8d5d5', fontSize: 12 }
    : { borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 };
  const lineColor = dark ? '#dc2626' : '#8b5cf6';

  const timelineData = weekEntries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en', { weekday: 'short' }),
    Mood:     parseFloat(getMoodScore(e.moods).toFixed(1)),
    Sleep:    e.sleep_hours ?? 0,
    Activity: e.physical_activity_minutes ? parseFloat((e.physical_activity_minutes / 10).toFixed(1)) : 0,
    Screen:   e.screen_time_minutes ? parseFloat((e.screen_time_minutes / 60).toFixed(1)) : 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={tooltipStyle} className="px-3 py-2 rounded-xl">
        <p className="text-xs font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-xs" style={{ color: p.color }}>
            {p.dataKey === 'Mood' ? 'Mood' : `${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  };

  const radarData = [
    { metric: 'Mood',       value: stats.avgMood },
    { metric: 'Sleep',      value: Math.min((stats.avgSleep / 9) * 10, 10) },
    { metric: 'Activity',   value: Math.min((stats.avgActivity / 60) * 10, 10) },
    { metric: 'Social',     value: (average(stats.socialArr) / 5) * 10 },
    { metric: 'Meditation', value: Math.min((average(stats.meditArr) / 30) * 10, 10) },
    { metric: 'Hobbies',    value: Math.min((average(stats.hobbyArr) / 60) * 10, 10) },
  ];

  const corrItems = [
    { emoji: '🌙', label: 'Sleep',        value: stats.corrSleepMood },
    { emoji: '😴', label: 'Sleep → Next', value: stats.lagSleepMood },
    { emoji: '🏃', label: 'Exercise',     value: stats.corrActivityMood },
    { emoji: '📱', label: 'Screen Time',  value: stats.corrScreenMood },
    { emoji: '👥', label: 'Social',       value: stats.corrSocialMood },
    { emoji: '🧘', label: 'Meditation',   value: stats.corrMeditMood },
    { emoji: '🎨', label: 'Hobbies',      value: stats.corrHobbyMood },
  ].filter(d => d.value !== null);

  if (!weeks.length) return <div className={`text-center py-12 ${dark ? 'text-red-900' : 'text-slate-400'}`}>No weekly data yet.</div>;

  return (
    <div className="space-y-5">
      {/* Week picker */}
      <div className={`rounded-2xl p-4 flex items-center gap-3 ${card}`}>
        <button onClick={() => setWeekIdx(i => Math.min(i + 1, weeks.length - 1))} disabled={weekIdx >= weeks.length - 1}
          className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${dark ? 'hover:bg-red-900/40 text-red-500' : 'hover:bg-slate-100 text-slate-500'}`}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          <p className={`text-sm font-semibold ${dark ? 'text-red-300' : 'text-slate-700'}`}>
            {weeks[weekIdx] ? weekLabel(weeks[weekIdx].start) : '—'}
          </p>
          <p className={`text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>{weekEntries.length} day{weekEntries.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button onClick={() => setWeekIdx(i => Math.max(i - 1, 0))} disabled={weekIdx <= 0}
          className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${dark ? 'hover:bg-red-900/40 text-red-500' : 'hover:bg-slate-100 text-slate-500'}`}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {weekEntries.length < 2 ? (
        <div className={`rounded-3xl p-8 text-center ${card}`}>
          <p className={`text-sm ${dark ? 'text-red-800' : 'text-slate-400'}`}>Not enough entries for this week.</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          {(() => {
            const moodEmoji = stats.avgMood >= 8 ? '🌟' : stats.avgMood >= 6 ? '🌤' : stats.avgMood >= 4 ? '🌥' : stats.avgMood >= 2 ? '🌧' : '⛈';
            const moodLabel = stats.avgMood >= 8 ? 'Thriving' : stats.avgMood >= 6 ? 'Stable & Positive' : stats.avgMood >= 4 ? 'Emotionally Variable' : stats.avgMood >= 2 ? 'Low Energy Week' : 'Needs Attention';
            return (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: moodLabel,          value: moodEmoji,              sub: 'Overall mood',  icon: null },
                  { label: `${stats.avgSleep}h sleep`,  value: '🌙',         sub: 'Avg per night', icon: null },
                  { label: moodTrendInfo.label, value: '📈',                  sub: 'Mood trend',    icon: null },
                ].map((k, i) => (
                  <motion.div key={k.sub} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`rounded-2xl p-4 ${card}`}>
                    <span className="text-2xl">{k.value}</span>
                    <p className={`text-sm font-bold mt-1 leading-tight ${dark ? 'text-red-300' : 'text-slate-800'}`}>{k.label}</p>
                    <p className={`text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>{k.sub}</p>
                  </motion.div>
                ))}
              </div>
            );
          })()}

          {/* Daily timeline line chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className={`rounded-3xl p-5 ${card}`}>
            <SectionTitle dark={dark}>Daily Mood · Sleep · Screen Time</SectionTitle>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={timelineData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: axisColor }} />
                <YAxis tick={{ fontSize: 10, fill: axisColor }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: dark ? '#9b6b6b' : undefined }} />
                <Line type="monotone" dataKey="Mood"     stroke={dark ? '#f87171' : '#8b5cf6'} strokeWidth={2.5} dot={{ r: 4 }} name="Mood" />
                <Line type="monotone" dataKey="Sleep"    stroke={dark ? '#dc2626' : '#6366f1'} strokeWidth={2}   dot={{ r: 3 }} name="Sleep" />
                <Line type="monotone" dataKey="Screen"   stroke={dark ? '#991b1b' : '#ec4899'} strokeWidth={2}   dot={{ r: 3 }} strokeDasharray="4 2" name="Screen (h)" />
                <Line type="monotone" dataKey="Activity" stroke={dark ? '#7f1d1d' : '#10b981'} strokeWidth={2}   dot={{ r: 3 }} strokeDasharray="6 3" name="Activity (×10min)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className={`rounded-3xl p-5 ${card}`}>
            <SectionTitle dark={dark}>Wellness Radar</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} outerRadius={70}>
                <PolarGrid stroke={dark ? '#3a0a0a' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: dark ? '#7a3a3a' : '#64748b' }} />
                <Radar name="This week" dataKey="value" stroke={lineColor} fill={lineColor} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Correlation visual cards */}
          {corrItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className={`rounded-3xl p-5 ${card}`}>
              <SectionTitle dark={dark}>What Influenced Your Mood</SectionTitle>
              <p className={`text-xs mb-4 ${dark ? 'text-red-800' : 'text-slate-400'}`}>
                How strongly each habit correlates with your mood this week
              </p>
              <div className="grid grid-cols-1 gap-3">
                {corrItems.map(item => (
                  <CorrelationCard key={item.label} dark={dark} {...item} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Weekly Summary */}
          {(() => {
            const bullets = [];
            const moodLabel = stats.avgMood >= 8 ? 'a thriving' : stats.avgMood >= 6 ? 'a mostly positive' : stats.avgMood >= 4 ? 'a mixed' : 'a challenging';
            bullets.push(`It was ${moodLabel} week overall for your emotional wellbeing.`);

            // Sleep
            if (stats.avgSleep >= 8) bullets.push(`Excellent sleep this week at ${stats.avgSleep}h — quality rest is one of the top predictors of stable mood.`);
            else if (stats.avgSleep >= 7) bullets.push(`Your sleep was solid at ${stats.avgSleep}h on average — a key mood stabiliser.`);
            else if (stats.avgSleep >= 5) bullets.push(`Sleep averaged ${stats.avgSleep}h — below the ideal 7h. Even 30 extra minutes can noticeably improve energy and resilience.`);
            else if (stats.avgSleep > 0) bullets.push(`Sleep was quite short at ${stats.avgSleep}h on average — chronic under-sleep significantly impacts mood, focus, and emotional regulation.`);

            // Activity
            if (stats.avgActivity >= 60) bullets.push(`You were very active this week (${stats.avgActivity} min/day avg) — regular movement is a powerful natural mood booster.`);
            else if (stats.avgActivity >= 30) bullets.push(`You stayed reasonably active with ${stats.avgActivity} min of movement on average — keep building on this.`);
            else if (stats.avgActivity > 0) bullets.push(`Physical activity was light this week (${stats.avgActivity} min avg) — even a 20-minute walk daily can meaningfully lift your mood.`);
            else bullets.push(`No physical activity was logged — sedentary days can amplify stress and low mood. Try to add movement, even briefly.`);

            // Screen time
            const avgScreen = average(stats.screenArr.filter(Boolean));
            if (avgScreen > 0) {
              if (avgScreen <= 3) bullets.push(`Screen time was well-managed this week at ~${avgScreen.toFixed(1)}h/day — great for mental clarity and sleep quality.`);
              else if (avgScreen <= 5) bullets.push(`Screen time averaged ~${avgScreen.toFixed(1)}h/day — moderate, but consider screen-free wind-down time before bed.`);
              else bullets.push(`Screen time was high at ~${avgScreen.toFixed(1)}h/day — this may have contributed to fatigue or mood dips, especially if it extends into evenings.`);
            }

            // Meditation
            const avgMedit = average(stats.meditArr.filter(Boolean));
            if (avgMedit >= 15) bullets.push(`Meditation averaged ${Math.round(avgMedit)} min/day — consistent practice helps regulate emotions and reduce anxiety.`);
            else if (avgMedit > 0) bullets.push(`Some meditation was logged (${Math.round(avgMedit)} min/day avg) — even short sessions add up to meaningful emotional resilience.`);

            // Hobbies
            const avgHobby = average(stats.hobbyArr.filter(Boolean));
            if (avgHobby >= 45) bullets.push(`You dedicated solid time to hobbies (~${Math.round(avgHobby)} min/day) — leisure and creative time are strongly linked to life satisfaction.`);
            else if (avgHobby > 0) bullets.push(`Some hobby time was logged (~${Math.round(avgHobby)} min/day) — even small amounts of enjoyable activity contribute to positive mood.`);

            // Correlations
            const topBoost = corrItems.filter(c => Math.round(c.value * 100) >= 15)[0];
            if (topBoost) bullets.push(`"${topBoost.label}" had the strongest positive correlation with your mood this week — lean into it.`);
            const topDrag = corrItems.filter(c => Math.round(c.value * 100) <= -15)[0];
            if (topDrag) bullets.push(`"${topDrag.label}" appeared to lower your mood — worth monitoring next week.`);

            // Trend
            if (moodTrendInfo.label.includes('↑') || moodTrendInfo.label.toLowerCase().includes('rising')) bullets.push(`Your mood trended upward through the week — great momentum going into next week!`);
            else if (moodTrendInfo.label.includes('↓') || moodTrendInfo.label.toLowerCase().includes('declining')) bullets.push(`Your mood dipped as the week went on — reflect on what may have shifted mid-week.`);
            else bullets.push(`Your mood stayed relatively consistent throughout the week — stability is a strength.`);

            return (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className={`rounded-3xl p-5 ${card}`}>
                <SectionTitle dark={dark}>Weekly Summary</SectionTitle>
                <ul className="space-y-2">
                  {bullets.map((b, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${dark ? 'text-red-200/80' : 'text-slate-600'}`}>
                      <span className={`mt-1 text-xs ${dark ? 'text-red-700' : 'text-violet-400'}`}>✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })()}
        </>
      )}
    </div>
  );
}