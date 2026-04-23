import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, X, Coffee, Sun, Moon, Utensils, Cookie, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import useDarkMode from './useDarkMode';

const defaultMeals = [
  { id: 'breakfast', name: 'Breakfast', icon: Coffee, time: 'morning' },
  { id: 'lunch', name: 'Lunch', icon: Sun, time: 'afternoon' },
  { id: 'dinner', name: 'Dinner', icon: Moon, time: 'evening' },
  { id: 'snacks', name: 'Snacks', icon: Cookie, time: 'anytime' },
];

const foodTypes = [
  { id: 'healthy', label: '🥗 Healthy',   lightColor: 'bg-emerald-100 border-emerald-400 text-emerald-700', darkColor: 'bg-emerald-900/50 border-emerald-700 text-emerald-300' },
  { id: 'protein', label: '🥩 Protein',   lightColor: 'bg-blue-100 border-blue-400 text-blue-700',         darkColor: 'bg-blue-900/50 border-blue-700 text-blue-300' },
  { id: 'junk',    label: '🍕 Junk Food', lightColor: 'bg-orange-100 border-orange-400 text-orange-700',   darkColor: 'bg-orange-900/50 border-orange-700 text-orange-300' },
  { id: 'mixed',   label: '🍱 Mixed',     lightColor: 'bg-purple-100 border-purple-400 text-purple-700',   darkColor: 'bg-purple-900/50 border-purple-700 text-purple-300' },
];

const mealMoods = [
  { id: 'great',   emoji: '😄', label: 'Great' },
  { id: 'okay',    emoji: '🙂', label: 'Okay' },
  { id: 'tired',   emoji: '😴', label: 'Tired' },
  { id: 'low',     emoji: '😔', label: 'Low' },
  { id: 'stressed',emoji: '😤', label: 'Stressed' },
  { id: 'calm',    emoji: '😌', label: 'Calm' },
];

const socialOptions = [
  { id: 'great',   emoji: '🤩', label: 'Really good' },
  { id: 'good',    emoji: '😊', label: 'Pretty good' },
  { id: 'neutral', emoji: '😐', label: 'Just okay' },
  { id: 'hard',    emoji: '😔', label: 'A bit tough' },
  { id: 'none',    emoji: '🏠', label: 'Was alone' },
];

const skippedReflections = [
  "That's okay! Even a small snack can help when you're busy. 💛",
  "Your body will let you know when it needs fuel. Listen to it! 🌿",
  "No worries — just nourish yourself when you can. 🤍",
];

function MealCard({ meal, mealState, onToggle, onUpdateDetails }) {
  const dark = useDarkMode();
  const Icon = meal.icon;
  const [showDetails, setShowDetails] = useState(false);
  const [foodName, setFoodName] = useState(mealState?.foodName || '');
  const [foodType, setFoodType] = useState(mealState?.foodType || '');
  const [mealMood, setMealMood] = useState(mealState?.mood || '');
  const [socialQuality, setSocialQuality] = useState(mealState?.social || '');
  const [nameError, setNameError] = useState(false);

  const handleHadIt = () => { onToggle(meal.id, true); setShowDetails(true); setNameError(false); };
  const handleSkipped = () => {
    onToggle(meal.id, false);
    setShowDetails(false);
    setFoodName(''); setFoodType(''); setMealMood(''); setSocialQuality('');
    onUpdateDetails(meal.id, { eaten: false, foodName: '', foodType: '', mood: '', social: '' });
  };

  const handleSave = () => {
    if (!foodName.trim()) { setNameError(true); return; }
    setNameError(false);
    onUpdateDetails(meal.id, { eaten: true, foodName: foodName.trim(), foodType, mood: mealMood, social: socialQuality });
    setShowDetails(false);
  };

  const isComplete = mealState?.eaten === true && mealState?.foodName;
  const isSkipped  = mealState?.eaten === false;

  const cardBg = dark
    ? isComplete ? 'bg-emerald-950/40' : isSkipped ? 'bg-rose-950/30' : 'bg-white/5'
    : isComplete ? 'bg-emerald-50'     : isSkipped ? 'bg-rose-50'     : 'bg-white';
  const cardBorder = dark
    ? `border-2 ${isComplete ? 'border-emerald-800' : isSkipped ? 'border-rose-900' : 'border-gray-800'}`
    : `border-2 ${isComplete ? 'border-emerald-300' : isSkipped ? 'border-rose-300' : 'border-slate-200'}`;
  const iconBg = dark
    ? isComplete ? 'bg-emerald-900' : isSkipped ? 'bg-rose-900' : 'bg-gray-800'
    : isComplete ? 'bg-emerald-200' : isSkipped ? 'bg-rose-200' : 'bg-slate-100';
  const iconColor = dark
    ? isComplete ? 'text-emerald-400' : isSkipped ? 'text-rose-400' : 'text-gray-500'
    : isComplete ? 'text-emerald-600' : isSkipped ? 'text-rose-600' : 'text-slate-500';

  const detailsBg    = dark ? 'bg-gray-900/60 border-gray-800' : 'bg-slate-50 border-slate-200';
  const labelColor   = dark ? 'text-gray-400' : 'text-slate-500';
  const inputClass   = dark
    ? `w-full rounded-xl px-3 py-2 text-sm bg-gray-900 text-gray-300 placeholder-gray-700 outline-none border ${nameError ? 'border-rose-700' : 'border-gray-700 focus:border-red-900'} mb-1`
    : `w-full rounded-xl px-3 py-2 text-sm bg-white text-slate-700 placeholder-slate-400 outline-none border ${nameError ? 'border-rose-400' : 'border-slate-200 focus:border-violet-400'} mb-1`;
  const inactiveBtn  = dark ? 'bg-gray-900 border-gray-700 text-gray-600 hover:border-gray-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400';
  const saveBtnClass = dark ? 'w-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-800 text-xs' : 'w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs';
  const hadItBtn     = isComplete
    ? dark ? 'bg-emerald-700 hover:bg-emerald-600 text-emerald-100 text-xs' : 'bg-emerald-500 hover:bg-emerald-600 text-white text-xs'
    : dark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs border border-gray-700' : 'bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-200 text-xs';
  const skippedBtn   = isSkipped
    ? dark ? 'bg-rose-800 hover:bg-rose-700 text-rose-200 text-xs' : 'bg-rose-500 hover:bg-rose-600 text-white text-xs'
    : dark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs border border-gray-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 text-xs';

  return (
    <motion.div layout className={`rounded-2xl overflow-hidden transition-all duration-300 ${cardBorder} ${cardBg}`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <span className={`font-semibold ${dark ? 'text-gray-300' : 'text-slate-700'}`}>{meal.name}</span>
            {isComplete && <p className={`text-xs truncate ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>{mealState.foodName}</p>}
            {isSkipped && <p className={`text-xs ${dark ? 'text-rose-400' : 'text-rose-500'}`}>Skipped</p>}
          </div>
          {isComplete && (
            <button onClick={() => setShowDetails(s => !s)} className={dark ? 'text-gray-600 hover:text-gray-400' : 'text-slate-400 hover:text-slate-600'}>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleHadIt}  className={hadItBtn}  variant={isComplete ? 'default' : 'outline'}>Had it ✓</Button>
          <Button size="sm" onClick={handleSkipped} className={skippedBtn} variant={isSkipped  ? 'default' : 'outline'}>Skipped</Button>
        </div>
      </div>

      {/* Skipped message */}
      <AnimatePresence>
        {isSkipped && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className={`px-4 pb-4 ${dark ? 'bg-rose-950/20' : 'bg-rose-50'}`}>
            <p className={`text-xs italic leading-relaxed border-l-2 pl-3 ${dark ? 'text-rose-300/70 border-rose-800' : 'text-rose-500 border-rose-300'}`}>
              {skippedReflections[defaultMeals.findIndex(m => m.id === meal.id) % skippedReflections.length]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details panel */}
      <AnimatePresence>
        {showDetails && mealState?.eaten === true && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className={`px-4 pb-4 border-t ${detailsBg}`}>

            {/* What did you have */}
            <p className={`text-xs mt-3 mb-1 font-medium ${labelColor}`}>What did you have? <span className="text-rose-500">*</span></p>
            <input value={foodName} onChange={e => { setFoodName(e.target.value); setNameError(false); }}
              placeholder="e.g. oatmeal with berries, rice & chicken..."
              className={inputClass} />
            {nameError && <p className="text-rose-500 text-xs mb-2">Please tell us what you ate 🙏</p>}

            {/* Food type */}
            <p className={`text-xs mb-2 mt-2 ${labelColor}`}>What kind of food?</p>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {foodTypes.map(t => (
                <button key={t.id} onClick={() => setFoodType(t.id === foodType ? '' : t.id)}
                  className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${foodType === t.id ? (dark ? t.darkColor : t.lightColor) : inactiveBtn}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* How were you feeling at this time */}
            <p className={`text-xs mb-2 font-medium ${labelColor}`}>How were you feeling around this time?</p>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {mealMoods.map(m => (
                <button key={m.id} onClick={() => setMealMood(m.id === mealMood ? '' : m.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all
                    ${mealMood === m.id
                      ? (dark ? 'bg-red-950/60 border-red-700 text-red-300' : 'bg-violet-100 border-violet-400 text-violet-700')
                      : inactiveBtn}`}>
                  <span>{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>

            {/* Social quality up to this point */}
            <p className={`text-xs mb-2 font-medium ${labelColor}`}>How were your interactions with people so far today?</p>
            <div className="grid grid-cols-1 gap-1.5 mb-4">
              {socialOptions.map(s => (
                <button key={s.id} onClick={() => setSocialQuality(s.id === socialQuality ? '' : s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all
                    ${socialQuality === s.id
                      ? (dark ? 'bg-red-950/60 border-red-700 text-red-300' : 'bg-violet-100 border-violet-400 text-violet-700')
                      : inactiveBtn}`}>
                  <span>{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>

            <Button onClick={handleSave} size="sm" className={saveBtnClass}>Save ✓</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FoodIntakeStep({ data, onUpdate, onNext }) {
  const dark = useDarkMode();
  const [mealDetails, setMealDetails] = useState(() => {
    const init = {};
    (data?.meals || []).forEach(m => { init[m.id] = m; });
    return init;
  });
  const [customMeals, setCustomMeals] = useState(data?.meals?.filter(m => m.isCustom) || []);
  const [customMeal, setCustomMeal] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const toggleMeal     = (mealId, eaten) => setMealDetails(prev => ({ ...prev, [mealId]: { ...prev[mealId], id: mealId, eaten } }));
  const updateDetails  = (mealId, details) => setMealDetails(prev => ({ ...prev, [mealId]: { id: mealId, ...prev[mealId], ...details } }));

  const addCustomMeal = () => {
    if (customMeal.trim()) {
      const id = `custom-${Date.now()}`;
      setCustomMeals(prev => [...prev, { id, name: customMeal, eaten: true, isCustom: true }]);
      setMealDetails(prev => ({ ...prev, [id]: { id, eaten: true, name: customMeal, isCustom: true } }));
      setCustomMeal('');
      setShowCustom(false);
    }
  };

  const removeCustomMeal = (id) => {
    setCustomMeals(prev => prev.filter(m => m.id !== id));
    setMealDetails(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const allMeals      = Object.values(mealDetails);
  const hasAny        = allMeals.length > 0;
  const hadItMeals    = allMeals.filter(m => m.eaten === true);
  const allFilled     = hadItMeals.every(m => m.foodName?.trim());
  const canContinue   = hasAny && allFilled;

  const handleNext = () => {
    const meals = [
      ...defaultMeals.map(m => mealDetails[m.id]).filter(Boolean),
      ...customMeals.map(m => ({ ...m, ...mealDetails[m.id] })),
    ];
    onUpdate({ meals });
    onNext();
  };

  const continueBtn = dark
    ? 'w-full h-12 bg-gradient-to-r from-red-900 to-gray-800 hover:from-red-800 text-gray-200 text-base font-medium border border-red-900/50 disabled:opacity-40'
    : 'w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-lg font-medium disabled:opacity-40';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br mb-4 ${dark ? 'from-orange-900 to-amber-900' : 'from-orange-200 to-amber-300'}`}>
          <Utensils className={`w-8 h-8 ${dark ? 'text-orange-400' : 'text-orange-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-gray-200' : 'text-slate-800'}`}>Let's talk about your day! 🍽️</h2>
        <p className={`text-sm ${dark ? 'text-gray-500' : 'text-slate-500'}`}>For each meal, tell us what you ate, how you felt, and how your day was going socially.</p>
      </div>

      <div className="space-y-3">
        {defaultMeals.map(meal => (
          <MealCard key={meal.id} meal={meal} mealState={mealDetails[meal.id]} onToggle={toggleMeal} onUpdateDetails={updateDetails} />
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {customMeals.map(meal => (
            <motion.div key={meal.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${dark ? 'bg-gray-900 border-gray-700' : 'bg-violet-50 border-violet-200'}`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${dark ? 'text-red-700' : 'text-violet-500'}`} />
                <span className={`text-sm ${dark ? 'text-gray-400' : 'text-slate-700'}`}>{meal.name}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => removeCustomMeal(meal.id)} className={dark ? 'text-gray-600 hover:text-rose-500' : 'text-slate-400 hover:text-rose-500'}>
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {showCustom ? (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
            <input value={customMeal} onChange={e => setCustomMeal(e.target.value)} placeholder="What else did you eat?"
              onKeyDown={e => e.key === 'Enter' && addCustomMeal()}
              className={dark ? 'flex-1 rounded-xl px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-gray-300 placeholder-gray-600 outline-none focus:border-red-900' : 'flex-1 rounded-xl px-3 py-2 text-sm bg-white border border-slate-200 text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400'} />
            <Button onClick={addCustomMeal} size="sm" className={dark ? 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-900' : 'bg-violet-500 hover:bg-violet-600 text-white'}>Add</Button>
            <Button variant="outline" size="sm" onClick={() => setShowCustom(false)} className={dark ? 'border-gray-700 text-gray-500' : ''}>Cancel</Button>
          </motion.div>
        ) : (
          <Button variant="outline" onClick={() => setShowCustom(true)}
            className={dark ? 'w-full border-dashed border-2 border-gray-700 text-gray-600 hover:border-red-900 hover:text-gray-400 bg-transparent' : 'w-full border-dashed border-2 hover:border-violet-300 hover:bg-violet-50'}>
            <Plus className="w-4 h-4 mr-2" /> Add more meals or snacks
          </Button>
        )}
      </div>

      <div className="pt-2">
        <Button onClick={handleNext} disabled={!canContinue} className={continueBtn}>
          Continue to Sleep 😴
        </Button>
        {!canContinue && hasAny && hadItMeals.length > 0 && !allFilled && (
          <p className="text-center text-xs text-rose-500 mt-2">Please fill in details for all meals marked "Had it" 🙏</p>
        )}
        {!hasAny && (
          <p className={`text-center text-xs mt-2 ${dark ? 'text-gray-600' : 'text-slate-400'}`}>Log at least one meal to continue</p>
        )}
      </div>
    </motion.div>
  );
}