import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generate a smooth spiral path
function generateSpiralPath(cx, cy, turns = 2.5, startR = 20, endR = 110, points = 120) {
  const pts = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = t * turns * Math.PI * 2;
    const r = startR + (endR - startR) * t;
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return pts;
}

// Generate a mandala petal path
function generatePetalPath(cx, cy, radius = 90, petals = 6, points = 120) {
  const pts = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = t * Math.PI * 2;
    const r = radius * Math.abs(Math.cos(petals / 2 * angle)) * 0.6 + radius * 0.4;
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return pts;
}

// Generate wave path
function generateWavePath(width, height, points = 120) {
  const pts = [];