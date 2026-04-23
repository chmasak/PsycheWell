import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

import { Send } from 'lucide-react';

const EMOTION_TAGS = ['Anxiety', 'Worry', 'Fear', 'Anger', 'Sadness', 'Stress', 'Regret', 'Doubt', 'Overwhelm', 'Frustration'];

const COLORS = [
  'rgba(167, 139, 250, 0.7)',
  'rgba(129, 140, 248, 0.7)',
  'rgba(99, 179, 237, 0.7)',
  'rgba(129, 230, 217, 0.7)',
  'rgba(196, 181, 253, 0.7)',
  'rgba(165, 180, 252, 0.7)',
];

function FloatingThought({ thought, onDissolve }) {
  const [dissolving, setDissolving] = useState(false);
  const [particles, setParticles] = useState([]);
  const x = useMotionValue(thought.x);
  const y = useMotionValue(thought.y);

  useEffect(() => {
    const timer = setTimeout(() => startDissolve(), thought.lifetime);
    return () => clearTimeout(timer);
  }, []);

  const startDissolve = useCallback(() => {
    if (dissolving) return;
    setDissolving(true);
    const pts = Array.from({ length: 12 }, (_, i) => ({