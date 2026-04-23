const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { User, Brain, Palette, Briefcase, ChevronRight, Check, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-gothic'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark-gothic')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

const mbtiTypes = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
];

const professionTree = {
  student: {
    label: '🎓 Student',
    desc: 'School, university, or online learning',
    subs: [
      { id: 'student_school', label: '🏫 School / High School' },
      { id: 'student_university', label: '🎓 University / College' },
      { id: 'student_online', label: '💻 Online / Self-taught' },
      { id: 'student_vocational', label: '🔧 Vocational / Trade' },
    ],
  },
  working: {
    label: '💼 Working',
    desc: 'Employed, freelancing, or running a business',
    subs: [
      { id: 'work_tech', label: '💻 Tech / Software' },
      { id: 'work_medical', label: '🏥 Medical / Healthcare' },
      { id: 'work_architecture', label: '🏗️ Architecture / Engineering' },
      { id: 'work_creative', label: '🎨 Creative / Design / Arts' },
      { id: 'work_finance', label: '📈 Finance / Banking' },
      { id: 'work_education', label: '📚 Education / Teaching' },
      { id: 'work_legal', label: '⚖️ Legal / Law' },
      { id: 'work_business', label: '🤝 Business / Management' },
      { id: 'work_manual', label: '🔨 Manual / Trades / Construction' },
      { id: 'work_service', label: '🍽️ Hospitality / Service' },
      { id: 'work_other', label: '🗂️ Other' },
    ],
  },
  retired: {
    label: '🌅 Retired',
    desc: 'Retired or not currently working',
    subs: [
      { id: 'retired_active', label: '🏃 Active & engaged' },
      { id: 'retired_relaxed', label: '🛋️ Taking it easy' },
      { id: 'retired_volunteering', label: '🤲 Volunteering / Community' },
      { id: 'retired_caregiving', label: '👨👩👧 Caregiving / Family' },
    ],
  },
};

const hobbyOptions = [
  '🎨 Drawing / Painting','🎵 Music','📚 Reading','🎮 Gaming',
  '📷 Photography','🍳 Cooking','🧘 Yoga','🌱 Gardening',
  '✍️ Writing','🏃 Running / Walking','🎬 Movies','🧩 Puzzles',
  '🎭 Acting / Theatre','🎸 Guitar','🏊 Swimming','🧗 Climbing',
  '🚴 Cycling','🌍 Travelling','🐾 Pets','🤸 Dance',
];

const STEPS = ['personal', 'personality', 'hobbies', 'profession'];

export default function ProfileSetup() {
  const dark = useDark();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Personal
  const [displayName, setDisplayName] = useState('');

  // Personality
  const [personalityType, setPersonalityType] = useState(''); // introvert | extrovert | ambivert | mbti
  const [knowsMbti, setKnowsMbti] = useState(null);
  const [selectedMbti, setSelectedMbti] = useState('');
  const [mbtiQuizStep, setMbtiQuizStep] = useState(0);
  const [mbtiAnswers, setMbtiAnswers] = useState({});

  // Hobbies
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState('');
  const [showNewHobby, setShowNewHobby] = useState(false);

  // Profession
  const [profCategory, setProfCategory] = useState(''); // student | working | retired
  const [profSub, setProfSub] = useState('');

  useEffect(() => {
    db.auth.me().then(u => {
      if (u?.profile_complete) navigate('/');
      if (u?.full_name) setDisplayName(u.full_name);
    }).catch(() => {});
  }, []);

  const card = dark ? 'bg-red-950/40 border border-red-900/50' : 'bg-white border border-slate-100 shadow-sm';
  const inputClass = dark
    ? 'w-full rounded-xl px-4 py-2.5 text-sm bg-gray-950 border border-gray-800 text-gray-300 placeholder-gray-700 outline-none focus:border-red-900'
    : 'w-full rounded-xl px-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400';
  const optBtn = (active) => dark
    ? `px-3 py-2 rounded-xl border text-sm font-medium transition-all ${active ? 'bg-red-950/70 border-red-700 text-red-300' : 'bg-red-950/20 border-red-950 text-red-800 hover:border-red-900'}`
    : `px-3 py-2 rounded-xl border text-sm font-medium transition-all ${active ? 'bg-violet-100 border-violet-400 text-violet-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`;

  const toggleHobby = (h) => setSelectedHobbies(p => p.includes(h) ? p.filter(x => x !== h) : [...p, h]);
  const addHobby = () => {
    const t = newHobby.trim();
    if (t && !selectedHobbies.includes(t)) setSelectedHobbies(p => [...p, t]);
    setNewHobby(''); setShowNewHobby(false);
  };

  // Simple 4-question MBTI quiz
  const mbtiQuestions = [
    { q: 'After a long day, you prefer to...', a: ['Spend time with friends (E)', 'Recharge alone at home (I)'], key: 'EI' },
    { q: 'You tend to focus on...', a: ['Concrete facts & details (S)', 'Big ideas & possibilities (N)'], key: 'SN' },
    { q: 'When making decisions, you rely on...', a: ['Logic and objectivity (T)', 'Values and feelings (F)'], key: 'TF' },
    { q: 'Your lifestyle tends to be...', a: ['Planned and organized (J)', 'Flexible and spontaneous (P)'], key: 'JP' },
  ];

  const handleMbtiAnswer = (key, choice) => {
    const updated = { ...mbtiAnswers, [key]: choice };
    setMbtiAnswers(updated);
    if (mbtiQuizStep < mbtiQuestions.length - 1) {
      setMbtiQuizStep(s => s + 1);
    } else {
      // Calculate result
      const result = [
        updated['EI'] === 'E' ? 'E' : 'I',
        updated['SN'] === 'N' ? 'N' : 'S',
        updated['TF'] === 'F' ? 'F' : 'T',
        updated['JP'] === 'J' ? 'J' : 'P',
      ].join('');
      setSelectedMbti(result);
      setPersonalityType('mbti');
      setKnowsMbti('quiz_done');
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    await db.auth.updateMe({
      hobbies: selectedHobbies,
      personality_type: personalityType === 'mbti' ? selectedMbti : personalityType,
      work_field: profSub || profCategory,
      profile_complete: true,
    });
    navigate('/');
  };

  const steps = [
    { label: 'You', icon: User },
    { label: 'Personality', icon: Brain },
    { label: 'Hobbies', icon: Palette },
    { label: 'Profession', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 ${dark ? 'bg-gradient-to-br from-red-900 to-gray-900' : 'bg-gradient-to-br from-violet-400 to-purple-500'}`}>
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-red-200' : 'text-slate-800'}`}>Welcome to PsycheWell</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-red-900' : 'text-slate-400'}`}>Let's set up your profile in 4 quick steps</p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${done ? (dark ? 'bg-emerald-900' : 'bg-emerald-400') : active ? (dark ? 'bg-red-800 ring-4 ring-red-900/40' : 'bg-violet-500 ring-4 ring-violet-200') : (dark ? 'bg-red-950/40' : 'bg-slate-200')}`}>
                    {done ? <Check className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 ${active ? 'text-white' : (dark ? 'text-red-900' : 'text-slate-400')}`} />}
                  </div>
                  <span className={`text-[10px] ${active ? (dark ? 'text-red-400 font-medium' : 'text-violet-600 font-medium') : (dark ? 'text-red-900' : 'text-slate-400')}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-px w-8 mb-4 ${i < step ? (dark ? 'bg-emerald-800' : 'bg-emerald-300') : (dark ? 'bg-red-950' : 'bg-slate-200')}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <motion.div layout className={`rounded-3xl p-6 ${card}`}>
          <AnimatePresence mode="wait">

            {/* Step 0 — Personal */}
            {step === 0 && (
              <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">👋</div>
                  <h2 className={`text-xl font-bold ${dark ? 'text-red-200' : 'text-slate-800'}`}>Tell us about yourself</h2>
                  <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-400'}`}>What should we call you?</p>
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${dark ? 'text-red-700' : 'text-slate-500'}`}>Your Name</label>
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Alex"
                    className={inputClass} />
                </div>
                <Button onClick={() => setStep(1)} disabled={!displayName.trim()}
                  className={`w-full h-12 ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 text-red-100 border border-red-800 hover:from-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50'}`}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Step 1 — Personality */}
            {step === 1 && (
              <motion.div key="personality" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">🧠</div>
                  <h2 className={`text-xl font-bold ${dark ? 'text-red-200' : 'text-slate-800'}`}>Your Personality</h2>
                  <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-400'}`}>This helps us analyse your social interactions better</p>
                </div>

                {/* Basic type */}
                {!['mbti', 'quiz'].includes(personalityType) && knowsMbti === null && (
                  <div className="space-y-3">
                    <p className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-slate-700'}`}>How would you describe yourself socially?</p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'introvert', label: '🌙 Introvert', desc: 'I recharge alone & prefer small groups' },
                        { id: 'extrovert', label: '☀️ Extrovert', desc: 'I thrive around people & social energy' },
                        { id: 'ambivert', label: '⚡ Ambivert', desc: 'A mix — depends on the situation' },
                      ].map(o => (
                        <button key={o.id} onClick={() => setPersonalityType(o.id)}
                          className={`${optBtn(personalityType === o.id)} text-left px-4 py-3 flex flex-col gap-0.5`}>
                          <span className="font-semibold">{o.label}</span>
                          <span className={`text-xs ${dark ? 'text-red-900' : 'text-slate-400'}`}>{o.desc}</span>
                        </button>
                      ))}
                    </div>
                    {personalityType && (
                      <button onClick={() => setKnowsMbti(false)}
                        className={`w-full text-xs text-center mt-1 underline ${dark ? 'text-red-800 hover:text-red-600' : 'text-slate-400 hover:text-violet-500'}`}>
                        Want to add your MBTI type for deeper insights?
                      </button>
                    )}
                  </div>
                )}

                {/* MBTI prompt */}
                {personalityType && knowsMbti === false && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <p className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-slate-700'}`}>Do you know your MBTI type?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setKnowsMbti('yes')} className={optBtn(knowsMbti === 'yes')}>✅ Yes, I know it</button>
                      <button onClick={() => { setKnowsMbti('quiz'); setMbtiQuizStep(0); setMbtiAnswers({}); }} className={optBtn(false)}>❓ Take a quick quiz</button>
                    </div>
                    <button onClick={() => setKnowsMbti(null)} className={`text-xs ${dark ? 'text-red-900 hover:text-red-700' : 'text-slate-400 hover:text-slate-600'}`}>← Skip MBTI</button>
                  </motion.div>
                )}

                {/* MBTI selector */}
                {knowsMbti === 'yes' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <p className={`text-sm font-medium ${dark ? 'text-red-300' : 'text-slate-700'}`}>Select your MBTI type:</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {mbtiTypes.map(t => (
                        <button key={t} onClick={() => { setSelectedMbti(t); setPersonalityType('mbti'); }}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all
                            ${selectedMbti === t ? (dark ? 'bg-red-950 border-red-700 text-red-300' : 'bg-violet-100 border-violet-400 text-violet-700') : (dark ? 'bg-red-950/20 border-red-950 text-red-800 hover:border-red-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* MBTI Quiz */}
                {knowsMbti === 'quiz' && mbtiQuizStep < mbtiQuestions.length && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className={`text-xs text-center mb-1 ${dark ? 'text-red-800' : 'text-slate-400'}`}>Question {mbtiQuizStep + 1} of {mbtiQuestions.length}</div>
                    <p className={`text-sm font-medium text-center ${dark ? 'text-red-200' : 'text-slate-700'}`}>{mbtiQuestions[mbtiQuizStep].q}</p>
                    <div className="space-y-2">
                      {mbtiQuestions[mbtiQuizStep].a.map((ans, ai) => (
                        <button key={ai} onClick={() => handleMbtiAnswer(mbtiQuestions[mbtiQuizStep].key, ans[ans.length - 2])}
                          className={`${optBtn(false)} w-full text-left px-4 py-3`}>{ans}</button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Quiz result */}
                {knowsMbti === 'quiz_done' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-2xl p-4 text-center ${dark ? 'bg-red-950/60 border border-red-900' : 'bg-violet-50 border border-violet-200'}`}>
                    <div className="text-4xl mb-2">🎉</div>
                    <p className={`text-lg font-bold ${dark ? 'text-red-200' : 'text-slate-800'}`}>You're an <span className={dark ? 'text-red-400' : 'text-violet-600'}>{selectedMbti}</span>!</p>
                    <p className={`text-xs mt-1 ${dark ? 'text-red-800' : 'text-slate-400'}`}>This is just an estimate based on 4 questions</p>
                  </motion.div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setStep(0)} className={`flex-1 ${dark ? 'border-red-900 text-red-400 bg-transparent' : ''}`}>Back</Button>
                  <Button onClick={() => setStep(2)} disabled={!personalityType}
                    className={`flex-1 h-11 ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 text-red-100 border border-red-800 hover:from-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50'}`}>
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Hobbies */}
            {step === 2 && (
              <motion.div key="hobbies" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">🎨</div>
                  <h2 className={`text-xl font-bold ${dark ? 'text-red-200' : 'text-slate-800'}`}>Your Hobbies</h2>
                  <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-400'}`}>Pick everything you enjoy — add your own too!</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {hobbyOptions.map(h => (
                    <button key={h} onClick={() => toggleHobby(h)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all
                        ${selectedHobbies.includes(h) ? (dark ? 'bg-red-950/60 border-red-700 text-red-300' : 'bg-violet-100 border-violet-400 text-violet-700') : (dark ? 'bg-red-950/20 border-red-950 text-red-800 hover:border-red-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}`}>
                      <span className="flex-1 truncate">{h}</span>
                      {selectedHobbies.includes(h) && <Check className="w-3 h-3 flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Custom hobby */}
                <AnimatePresence>
                  {showNewHobby ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                      <input value={newHobby} onChange={e => setNewHobby(e.target.value)} placeholder="Type your hobby..."
                        onKeyDown={e => e.key === 'Enter' && addHobby()}
                        className={`${inputClass} flex-1`} />
                      <Button size="sm" onClick={addHobby} className={dark ? 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-900' : 'bg-violet-500 hover:bg-violet-600 text-white'}>Add</Button>
                      <Button variant="outline" size="sm" onClick={() => setShowNewHobby(false)} className={dark ? 'border-gray-700 text-gray-500' : ''}>✕</Button>
                    </motion.div>
                  ) : (
                    <button onClick={() => setShowNewHobby(true)}
                      className={`w-full border-2 border-dashed rounded-xl py-2 text-xs font-medium transition-all ${dark ? 'border-red-950 text-red-900 hover:border-red-800 hover:text-red-700' : 'border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-500'}`}>
                      <Plus className="w-3.5 h-3.5 inline mr-1" /> Add something else
                    </button>
                  )}
                </AnimatePresence>

                {selectedHobbies.length > 0 && (
                  <p className={`text-xs text-center ${dark ? 'text-red-800' : 'text-slate-400'}`}>{selectedHobbies.length} selected ✓</p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className={`flex-1 ${dark ? 'border-red-900 text-red-400 bg-transparent' : ''}`}>Back</Button>
                  <Button onClick={() => setStep(3)} disabled={selectedHobbies.length === 0}
                    className={`flex-1 h-11 ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 text-red-100 border border-red-800 hover:from-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50'}`}>
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Profession */}
            {step === 3 && (
              <motion.div key="profession" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">💼</div>
                  <h2 className={`text-xl font-bold ${dark ? 'text-red-200' : 'text-slate-800'}`}>Your Profession</h2>
                  <p className={`text-sm ${dark ? 'text-red-900' : 'text-slate-400'}`}>This helps personalise your screen time insights</p>
                </div>

                {/* Top-level category */}
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(professionTree).map(([key, val]) => (
                    <button key={key} onClick={() => { setProfCategory(key); setProfSub(''); }}
                      className={`${optBtn(profCategory === key)} text-left px-4 py-3 flex flex-col gap-0.5`}>
                      <span className="font-semibold">{val.label}</span>
                      <span className={`text-xs ${dark ? 'text-red-900' : 'text-slate-400'}`}>{val.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Sub-options */}
                {profCategory && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <p className={`text-xs font-medium ${dark ? 'text-red-700' : 'text-slate-500'}`}>
                      {profCategory === 'working' ? 'What field?' : profCategory === 'student' ? 'What kind of student?' : 'How would you describe yourself?'}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {professionTree[profCategory].subs.map(s => (
                        <button key={s.id} onClick={() => setProfSub(s.id)}
                          className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition-all
                            ${profSub === s.id
                              ? (dark ? 'bg-red-950/70 border-red-700 text-red-300' : 'bg-violet-100 border-violet-400 text-violet-700')
                              : (dark ? 'bg-red-950/20 border-red-950 text-red-800 hover:border-red-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setStep(2)} className={`flex-1 ${dark ? 'border-red-900 text-red-400 bg-transparent' : ''}`}>Back</Button>
                  <Button onClick={handleFinish} disabled={saving || !profCategory}
                    className={`flex-1 h-11 ${dark ? 'bg-gradient-to-r from-red-900 to-red-950 text-red-100 border border-red-800 hover:from-red-800 disabled:opacity-40' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50'}`}>
                    {saving ? 'Setting up...' : "Let's go! 🚀"}
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}