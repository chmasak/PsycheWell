import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis
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
        <span className="text-xs font-semibold" style={{ color: barColor }}>{pct > 0 ? '+' : ''}{pct}%</span>
      </div>
    </div>
  );
}

// Build available months from entries
function getMonths(entries) {
  const map = {};
  entries.forEach(e => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map[key]) map[key] = { key, year: d.getFullYear(), month: d.getMonth(), entries: [] };
    map[key].entries.push(e);
  });
  return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
}

function monthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en', { month: 'long', year: 'numeric' });
}

export default function MonthlyAnalysis({ entries }) {
  const dark = useDark();
  const months = useMemo(() => getMonths(entries), [entries]);
  const [monthIdx, setMonthIdx] = useState(0);

  const monthEntries = useMemo(() =>
    [...(months[monthIdx]?.entries ?? [])].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [months, monthIdx]
  );

  const stats = useMemo(() => {
    const e = monthEntries;
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
      moodStd:          stdDev(moodScores),
      moodTrend:        linearTrend(moodScores),
      avgSleep:         parseFloat(average(sleepArr.filter(Boolean)).toFixed(1)),
      avgActivity:      Math.round(average(activityArr.filter(Boolean))),
      avgScreen:        parseFloat(average(screenArr.filter(Boolean)).toFixed(1)),
      corrSleepMood:    correlation(sleepArr,    moodScores),
      corrActivityMood: correlation(activityArr, moodScores),
      corrScreenMood:   correlation(screenArr,   moodScores),
      corrSocialMood:   correlation(socialArr,   moodScores),
      corrMeditMood:    correlation(meditArr,    moodScores),
      corrHobbyMood:    correlation(hobbyArr,    moodScores),
      lagSleep:         lagCorrelation(sleepArr,  moodScores, 1),
    };
  }, [monthEntries]);

  const weeklyBuckets = useMemo(() => {
    const buckets = [];
    for (let i = 0; i < monthEntries.length; i += 7) {
      const week = monthEntries.slice(i, i + 7);
      if (!week.length) continue;
      buckets.push({
        week:        `W${Math.floor(i / 7) + 1}`,
        avgMood:     parseFloat(average(week.map(e => getMoodScore(e.moods))).toFixed(1)),
        avgSleep:    parseFloat(average(week.map(e => e.sleep_hours).filter(Boolean)).toFixed(1)),
        avgActivity: Math.round(average(week.map(e => e.physical_activity_minutes).filter(Boolean))),
      });
    }
    return buckets;
  }, [monthEntries]);

  const moodTrendInfo = trendLabel(stats.moodTrend);

  const card = dark ? 'bg-red-950/40 border border-red-900/50' : 'bg-white border border-slate-100 shadow-sm';
  const gridColor = dark ? '#2a0a0a' : '#f1f5f9';
  const axisColor = dark ? '#5a1a1a' : '#94a3b8';
  const tooltipStyle = dark
    ? { borderRadius: 12, background: '#1a0505', border: '1px solid #5a0000', color: '#e8d5d5', fontSize: 12 }
    : { borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 };
  const primaryColor = dark ? '#dc2626' : '#8b5cf6';
  const secondaryColor = dark ? '#991b1b' : '#6366f1';

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
    { emoji: '😴', label: 'Sleep → Next', value: stats.lagSleep },
    { emoji: '🏃', label: 'Exercise',     value: stats.corrActivityMood },
    { emoji: '📱', label: 'Screen Time',  value: stats.corrScreenMood },
    { emoji: '👥', label: 'Social',       value: stats.corrSocialMood },
    { emoji: '🧘', label: 'Meditation',   value: stats.corrMeditMood },
    { emoji: '🎨', label: 'Hobbies',      value: stats.corrHobbyMood },
  ].filter(d => d.value !== null);

  // Daily mood line for this month
  const moodLine = monthEntries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    Mood: parseFloat(getMoodScore(e.moods).toFixed(1)),
  }));

  const MoodOnlyTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={tooltipStyle} className="px-3 py-2 rounded-xl">
        <p className="text-xs font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-xs" style={{ color: p.color }}>
            {p.dataKey === 'Mood' || p.name === 'Avg Mood' ? 'Mood' : `${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  };

  if (!months.length) return <div className={`text-center py-12 ${dark ? 'text-red-900' : 'text-slate-400'}`}>No monthly data yet.</div>;

  return (
    <div className="space-y-5">
      {/* Month picker */}
      <div className={`rounded-2xl p-4 flex items-center gap-3 ${card}`}>
        <button onClick={() => setMonthIdx(i => Math.min(i + 1, months.length - 1))} disabled={monthIdx >= months.length - 1}
          className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${dark ? 'hover:bg-red-900/40 text-red-500' : 'hover:bg-slate-100 text-slate-500'}`}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          <p className={`text-sm font-semibold ${dark ? 'text-red-300' : 'text-slate-700'}`}>
            {months[monthIdx] ? monthLabel(months[monthIdx].year, months[monthIdx].month) : '—'}
          </p>
          <p className={`text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>{monthEntries.length} day{monthEntries.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button onClick={() => setMonthIdx(i => Math.max(i - 1, 0))} disabled={monthIdx <= 0}
          className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${dark ? 'hover:bg-red-900/40 text-red-500' : 'hover:bg-slate-100 text-slate-500'}`}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {monthEntries.length < 2 ? (
        <div className={`rounded-3xl p-8 text-center ${card}`}>
          <p className={`text-sm ${dark ? 'text-red-800' : 'text-slate-400'}`}>Not enough entries for this month.</p>
        </div>
      ) : (
        <>
          {/* KPI row */}
          {(() => {
            const moodEmoji = stats.avgMood >= 8 ? '🌟' : stats.avgMood >= 6 ? '🌤' : stats.avgMood >= 4 ? '🌥' : stats.avgMood >= 2 ? '🌧' : '⛈';
            const moodLabel = stats.avgMood >= 8 ? 'Thriving' : stats.avgMood >= 6 ? 'Stable & Positive' : stats.avgMood >= 4 ? 'Emotionally Variable' : stats.avgMood >= 2 ? 'Low Energy Month' : 'Needs Attention';
            return (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: moodLabel,                   value: moodEmoji, sub: 'Overall mood'  },
                  { label: `${stats.avgSleep}h sleep`,  value: '🌙',      sub: 'Avg per night' },
                  { label: moodTrendInfo.label,          value: '📈',      sub: 'Mood trend'    },
                ].map((k, i) => (
                  <motion.div key={k.sub} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`rounded-2xl p-4 text-center ${card}`}>
                    <span className="text-2xl">{k.value}</span>
                    <p className={`text-sm font-bold mt-1 leading-tight ${dark ? 'text-red-300' : 'text-slate-800'}`}>{k.label}</p>
                    <p className={`text-xs ${dark ? 'text-red-800' : 'text-slate-400'}`}>{k.sub}</p>
                  </motion.div>
                ))}
              </div>
            );
          })()}

          {/* Mood line for the month */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className={`rounded-3xl p-5 ${card}`}>
            <SectionTitle dark={dark}>Daily Mood This Month</SectionTitle>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={moodLine} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: axisColor }} interval="preserveStartEnd" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: axisColor }} />
                <Tooltip content={<MoodOnlyTooltip />} />
                <Line type="monotone" dataKey="Mood" stroke={primaryColor} strokeWidth={2.5} dot={{ r: 3 }} name="Mood" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Week-by-week bar chart */}
          {weeklyBuckets.length > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
              className={`rounded-3xl p-5 ${card}`}>
              <SectionTitle dark={dark}>Week-by-Week Overview</SectionTitle>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={weeklyBuckets} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: axisColor }} />
                  <YAxis tick={{ fontSize: 10, fill: axisColor }} />
                  <Tooltip content={<MoodOnlyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: dark ? '#9b6b6b' : undefined }} />
                  <Bar dataKey="avgMood"     name="Avg Mood"     fill={primaryColor}   radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgSleep"    name="Avg Sleep (h)"fill={secondaryColor} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgActivity" name="Activity (min)" fill={dark ? '#7f1d1d' : '#10b981'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Radar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
            className={`rounded-3xl p-5 ${card}`}>
            <SectionTitle dark={dark}>Wellness Radar</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} outerRadius={70}>
                <PolarGrid stroke={dark ? '#3a0a0a' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: dark ? '#7a3a3a' : '#64748b' }} />
                <Radar name="This month" dataKey="value" stroke={primaryColor} fill={primaryColor} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Correlation visual cards */}
          {corrItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
              className={`rounded-3xl p-5 ${card}`}>
              <SectionTitle dark={dark}>What Influenced Your Mood This Month</SectionTitle>
              <p className={`text-xs mb-4 ${dark ? 'text-red-800' : 'text-slate-400'}`}>
                How strongly each habit correlates with your mood
              </p>
              <div className="grid grid-cols-1 gap-3">
                {corrItems.map(item => (
                  <CorrelationCard key={item.label} dark={dark} {...item} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Monthly Summary */}
          {(() => {
            const bullets = [];
            const moodLabel = stats.avgMood >= 8 ? 'a thriving' : stats.avgMood >= 6 ? 'a mostly positive' : stats.avgMood >= 4 ? 'a mixed' : 'a challenging';
            bullets.push(`Overall it was ${moodLabel} month for your emotional wellbeing.`);

            // Sleep
            if (stats.avgSleep >= 8) bullets.push(`Excellent sleep consistency at ${stats.avgSleep}h/night on average — well above the recommended threshold, this is a strong foundation for mental health.`);
            else if (stats.avgSleep >= 7) bullets.push(`Sleep was healthy at ${stats.avgSleep}h on average — consistent rest at this level strongly supports mood stability and cognitive performance.`);
            else if (stats.avgSleep >= 5) bullets.push(`Sleep averaged ${stats.avgSleep}h — below the recommended 7-9h. Over a month, even small deficits accumulate and can meaningfully lower emotional resilience.`);
            else if (stats.avgSleep > 0) bullets.push(`Sleep was quite low at ${stats.avgSleep}h on average this month — prioritising rest is one of the highest-leverage changes you can make for your mental wellbeing.`);

            // Activity
            if (stats.avgActivity >= 60) bullets.push(`Strong physical activity month — ${stats.avgActivity} min/day on average. Regular movement at this level is one of the most effective natural antidepressants.`);
            else if (stats.avgActivity >= 30) bullets.push(`You kept up decent physical activity at ${stats.avgActivity} min/day avg — building toward 45-60 min daily would amplify mood benefits further.`);
            else if (stats.avgActivity > 0) bullets.push(`Activity levels were low this month (${stats.avgActivity} min/day avg) — even a consistent 20-minute daily walk can have a measurable positive impact on mood.`);
            else bullets.push(`No physical activity was logged this month — introducing even light, regular movement is one of the most impactful steps for long-term mood improvement.`);

            // Screen time
            if (stats.avgScreen > 0) {
              if (stats.avgScreen <= 3) bullets.push(`Screen time was well-managed at ${stats.avgScreen}h/day on average — low digital exposure supports better sleep quality and mental clarity.`);
              else if (stats.avgScreen <= 5) bullets.push(`Screen time was moderate at ${stats.avgScreen}h/day — consider introducing screen-free periods, especially in the hour before sleep.`);
              else if (stats.avgScreen <= 8) bullets.push(`Screen time was elevated at ${stats.avgScreen}h/day this month — extended exposure, especially in evenings, can disrupt melatonin production and lower mood.`);
              else bullets.push(`Screen time was very high at ${stats.avgScreen}h/day on average — this likely contributed to mental fatigue and may have dampened mood on many days.`);
            }

            // Meditation
            const avgMeditMonth = average(stats.meditArr.filter(Boolean));
            if (avgMeditMonth >= 15) bullets.push(`Consistent meditation practice (~${Math.round(avgMeditMonth)} min/day) — this level of mindfulness practice has documented benefits for anxiety reduction and emotional regulation.`);
            else if (avgMeditMonth > 0) bullets.push(`Some meditation logged (~${Math.round(avgMeditMonth)} min/day avg) — gradually increasing this toward 10-15 min daily can meaningfully improve stress resilience.`);

            // Hobbies
            const avgHobbyMonth = average(stats.hobbyArr.filter(Boolean));
            if (avgHobbyMonth >= 45) bullets.push(`You invested solid time in hobbies (~${Math.round(avgHobbyMonth)} min/day) — sustained engagement in enjoyable activities is a powerful buffer against stress and negative mood.`);
            else if (avgHobbyMonth > 0) bullets.push(`Some hobby engagement was logged (~${Math.round(avgHobbyMonth)} min/day) — carving out more time for activities you love would likely show up in your mood data.`);

            // Mood variability
            if (stats.moodStd > 2.5) bullets.push(`Your mood was quite variable this month (high fluctuation) — this may point to inconsistent sleep, diet, or stress patterns worth examining.`);
            else if (stats.moodStd < 1) bullets.push(`Your mood was remarkably stable this month — low variability suggests you've found a consistent emotional baseline.`);

            // Correlations
            const topBoost = corrItems.filter(c => Math.round(c.value * 100) >= 15)[0];
            if (topBoost) bullets.push(`"${topBoost.label}" was your strongest positive mood driver this month — keep prioritising it.`);
            const topDrag = corrItems.filter(c => Math.round(c.value * 100) <= -15)[0];
            if (topDrag) bullets.push(`"${topDrag.label}" consistently correlated with lower mood days — addressing this could be a key focus for next month.`);

            bullets.push(`You logged ${monthEntries.length} day${monthEntries.length !== 1 ? 's' : ''} this month — ${monthEntries.length >= 20 ? 'excellent consistency! The more you log, the sharper your insights.' : monthEntries.length >= 10 ? 'good effort — aim for 20+ days next month for even richer patterns.' : 'try logging more days for meaningful insights to emerge.'}`);

            return (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className={`rounded-3xl p-5 ${card}`}>
                <SectionTitle dark={dark}>Monthly Summary</SectionTitle>
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