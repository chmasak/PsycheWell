// Mood numeric scoring
export const moodScores = {
  happy: 9, excited: 9, grateful: 9, hopeful: 8, energetic: 8,
  motivated: 8, peaceful: 7, calm: 7, neutral: 5,
  confused: 4, tired: 3, lonely: 3, anxious: 3, stressed: 2,
  frustrated: 2, sad: 1,
};

export const getMoodScore = (moods = []) => {
  if (!moods.length) return 5;
  const sum = moods.reduce((acc, m) => acc + (moodScores[m] || 5), 0);
  return parseFloat((sum / moods.length).toFixed(2));
};

export const average = (arr) => {
  const valid = arr.filter(v => v != null && !isNaN(v));
  if (!valid.length) return 0;
  return parseFloat((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2));
};

export const stdDev = (arr) => {
  const valid = arr.filter(v => v != null && !isNaN(v));
  if (valid.length < 2) return 0;
  const avg = average(valid);
  const variance = valid.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / valid.length;
  return parseFloat(Math.sqrt(variance).toFixed(2));
};

// Pearson correlation coefficient
export const correlation = (xArr, yArr) => {
  const n = Math.min(xArr.length, yArr.length);
  if (n < 3) return null;
  const xs = xArr.slice(0, n);
  const ys = yArr.slice(0, n);
  const avgX = average(xs), avgY = average(ys);
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    num  += (xs[i] - avgX) * (ys[i] - avgY);
    denX += Math.pow(xs[i] - avgX, 2);
    denY += Math.pow(ys[i] - avgY, 2);
  }
  if (denX === 0 || denY === 0) return null;
  return parseFloat((num / Math.sqrt(denX * denY)).toFixed(3));
};

// Lag correlation: correlate x[i] with y[i+lag]
export const lagCorrelation = (xArr, yArr, lag = 1) => {
  const n = Math.min(xArr.length, yArr.length);
  if (n - lag < 3) return null;
  const xs = xArr.slice(0, n - lag);
  const ys = yArr.slice(lag, n);
  return correlation(xs, ys);
};

// Linear trend: positive = improving, negative = worsening
export const linearTrend = (arr) => {
  const valid = arr.filter(v => v != null && !isNaN(v));
  if (valid.length < 2) return 0;
  const n = valid.length;
  const xs = valid.map((_, i) => i);
  const avgX = average(xs), avgY = average(valid);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - avgX) * (valid[i] - avgY);
    den += Math.pow(xs[i] - avgX, 2);
  }
  return den === 0 ? 0 : parseFloat((num / den).toFixed(4));
};

export const correlationLabel = (r) => {
  if (r === null) return { label: 'Insufficient data', color: 'text-slate-400' };
  const abs = Math.abs(r);
  const dir = r > 0 ? '↑ Positive' : '↓ Negative';
  if (abs >= 0.7) return { label: `${dir} (Strong)`,   color: r > 0 ? 'text-emerald-600' : 'text-rose-600' };
  if (abs >= 0.4) return { label: `${dir} (Moderate)`, color: r > 0 ? 'text-green-500'   : 'text-orange-500' };
  if (abs >= 0.2) return { label: `${dir} (Weak)`,     color: r > 0 ? 'text-blue-500'    : 'text-amber-500' };
  return { label: 'Negligible correlation', color: 'text-slate-400' };
};

export const trendLabel = (slope) => {
  if (slope >  0.1) return { label: '📈 Improving',  color: 'text-emerald-600' };
  if (slope < -0.1) return { label: '📉 Declining',  color: 'text-rose-600' };
  return               { label: '➡️ Stable',          color: 'text-blue-500' };
};

export const socialQualityScore = (q) => {
  const map = { excellent: 5, good: 4, neutral: 3, poor: 2, none: 1 };
  return map[q] || 3;
};