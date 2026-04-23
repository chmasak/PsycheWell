const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useMutation } from '@tanstack/react-query';
import { Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ProgressTracker from '@/components/wellness/ProgressTracker';
import FoodIntakeStep from '@/components/wellness/FoodIntakeStep';
import SleepStep from '@/components/wellness/SleepStep';
import PhysicalActivityStep from '@/components/wellness/PhysicalActivityStep';

import MeditationStep from '@/components/wellness/MeditationStep';
import MedicationStep from '@/components/wellness/MedicationStep';
import HobbiesStep from '@/components/wellness/HobbiesStep';
import ScreenTimeStep from '@/components/wellness/ScreenTimeStep';
import AnalysisResult from '@/components/wellness/AnalysisResult';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    db.auth.me().then(user => {
      if (!user?.profile_complete) navigate('/ProfileSetup');
    }).catch(() => {});
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [wellnessData, setWellnessData] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const updateData = (newData) => {
    setWellnessData(prev => ({ ...prev, ...newData }));
  };

  const goNext = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const analysisMutation = useMutation({
    mutationFn: async (data) => {
      // Save entry to database
      const entry = await db.entities.WellnessEntry.create({
        date: new Date().toISOString().split('T')[0],
        ...data
      });

      // Generate analysis using AI
      const analysisResult = await db.integrations.Core.InvokeLLM({
        prompt: `Analyze this wellness data and provide insights on what affected the user's mood today:
        
        Data:
        - Meals with per-meal mood & social quality: ${JSON.stringify(data.meals)}
        - Sleep: ${data.sleep_hours} hours
        - Physical Activity: ${data.physical_activity_minutes} minutes
        - Meditates: ${data.meditates ? `Yes, ${data.meditation_minutes} minutes` : 'No'}
        - On Medication: ${data.on_medication ? `Yes - side effects noted: ${(data.medication_side_effects || []).join(', ') || 'none specified'}` : 'No'}
        - Hobbies today: ${data.has_hobbies ? `Yes, ${(data.selected_hobbies || []).join(', ')} for ${data.hobby_minutes} minutes` : 'No'}
        - Work Field: ${data.work_field ?? 'not specified'}
        - Screen Time: ${data.screen_time_minutes != null ? `${Math.round(data.screen_time_minutes / 60 * 10) / 10}h` : 'not specified'}
        - Overall moods felt today: ${(data.moods || []).join(', ') || 'not tracked'}

        Provide a thoughtful, empathetic analysis explaining:
        1. A summary of their overall wellness today
        2. Key factors that likely influenced their moods (both positive and negative)
        3. Practical recommendations for tomorrow

        Be warm, supportive, and non-judgmental. Use encouraging language.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string", description: "2-3 sentence overall summary" },
            factors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["sleep", "food", "activity", "social", "meditation", "hobbies", "medication", "medication_side_effects", "screen_time"] },
                  impact: { type: "string", enum: ["positive", "negative", "neutral"] },
                  explanation: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Update entry with analysis
      await db.entities.WellnessEntry.update(entry.id, {
        mood_analysis: analysisResult
      });

      return analysisResult;
    },
    onSuccess: (result) => {
      setAnalysis(result);
      setShowResult(true);
    }
  });

  const handleSubmit = (extraData) => {
    const finalData = extraData ? { ...wellnessData, ...extraData } : wellnessData;
    analysisMutation.mutate(finalData);
  };

  const startNewEntry = () => {
    setCurrentStep(1);
    setWellnessData({});
    setAnalysis(null);
    setShowResult(false);
  };

  const renderStep = () => {
    const stepProps = {
      data: wellnessData,
      onUpdate: updateData,
      onNext: goNext,
      onBack: goBack,
    };

    switch (currentStep) {
      case 1: return <FoodIntakeStep {...stepProps} />;
      case 2: return <SleepStep {...stepProps} />;
      case 3: return <PhysicalActivityStep {...stepProps} />;
      case 4: return <MeditationStep {...stepProps} />;
      case 5: return <MedicationStep {...stepProps} />;
      case 6: return <HobbiesStep {...stepProps} />;
      case 7: return <ScreenTimeStep {...stepProps} onSubmit={handleSubmit} isSubmitting={analysisMutation.isPending} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed top-32 left-[15%] w-32 h-32 bg-gradient-to-br from-violet-200 to-purple-300 rounded-full blur-3xl opacity-40 pointer-events-none gothic-hide-orb" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full blur-3xl opacity-40 pointer-events-none gothic-hide-orb" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {!showResult && (
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              How Are You Today?
            </h1>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          layout
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50 dark-gothic-card"
        >
          {showResult ? (
            <AnalysisResult 
              analysis={analysis} 
              data={wellnessData}
              onNewEntry={startNewEntry}
            />
          ) : (
            <>
              <ProgressTracker currentStep={currentStep} />
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-slate-400 text-sm flex items-center justify-center gap-2"
        >
          <span>Made with</span>
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>for your wellbeing</span>
        </motion.div>
      </div>
    </div>
  );
}