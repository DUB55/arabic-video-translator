/**
 * useProcessing Hook
 * Manages video processing state and workflow
 */

import { useState, useCallback } from 'react';
import { preprocessArabicText } from '../utils/textProcessor';
import { createTranslationPrompt } from '../services/translationService';
import { createDuaExtractionPrompt } from '../services/duaService';
import { PROCESSING_STEPS } from '../utils/constants';
import { saveResultToHistory } from '../utils/storage';
import { useDub5 } from './useDub5';
import { transcribeReel } from '../services/supadataService';

// Lightweight ID generator (avoids adding a new dependency)
const makeId = () => `res_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

export function useProcessing() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const dub5 = useDub5();

  /**
   * Updates processing progress
   */
  const updateProgress = useCallback((progressValue, stepMessage) => {
    setProgress(progressValue);
    setCurrentStep(stepMessage);
  }, []);

  /**
   * Processes a video file through the complete pipeline
   */
  const processVideo = useCallback(async (reelUrl, duaEnabled) => {
    try {
      setProcessing(true);
      setProgress(0);
      setError(null);
      setResults(null);
      setCancelled(false);

      // Step 1: Fetch transcript via backend
      updateProgress(
        PROCESSING_STEPS.TRANSCRIBING.progress,
        PROCESSING_STEPS.TRANSCRIBING.message
      );
      let arabicText = await transcribeReel(reelUrl);
      
      if (cancelled) {
        setProcessing(false);
        return null;
      }

      // Step 3: Preprocess Arabic text
      updateProgress(
        PROCESSING_STEPS.PREPROCESSING.progress,
        PROCESSING_STEPS.PREPROCESSING.message
      );
      arabicText = preprocessArabicText(arabicText);
      
      if (cancelled) {
        setProcessing(false);
        return null;
      }

      // Step 3: Translate to Dutch (DUB5 streaming client)
      updateProgress(
        PROCESSING_STEPS.TRANSLATING.progress,
        PROCESSING_STEPS.TRANSLATING.message
      );
      const translationPrompt = createTranslationPrompt(arabicText);
      let dutchTranslation = '';
      try {
        dutchTranslation = await dub5.send(translationPrompt, 'translate', { language: 'nl' });
      } catch (e) {
        throw new Error(`Translation failed: ${e.message}`);
      }
      
      if (cancelled) {
        setProcessing(false);
        return null;
      }

      // Step 4: Extract duas (if enabled) via DUB5
      let duaResults = '';
      if (duaEnabled) {
        updateProgress(
          PROCESSING_STEPS.EXTRACTING_DUAS.progress,
          PROCESSING_STEPS.EXTRACTING_DUAS.message
        );
        const duaPrompt = createDuaExtractionPrompt(arabicText);
        try {
          duaResults = await dub5.send(duaPrompt, 'extract');
        } catch (e) {
          duaResults = 'Geen dua gevonden.';
        }
      }
      
      if (cancelled) {
        setProcessing(false);
        return null;
      }

      // Complete
      updateProgress(
        PROCESSING_STEPS.COMPLETE.progress,
        PROCESSING_STEPS.COMPLETE.message
      );

      const finalResults = {
        id: makeId(),
        timestamp: new Date().toISOString(),
        model: 'supadata',
        arabicTranscript: arabicText,
        dutchTranslation: dutchTranslation,
        duaResults: duaResults,
      };

      setResults(finalResults);
      // Save to history (best effort; non-blocking)
      saveResultToHistory(finalResults);
      setProcessing(false);
      return finalResults;
    } catch (err) {
      const errorMessage = err.message || 'Processing failed';
      setError(errorMessage);
      setProcessing(false);
      throw err;
    }
  }, [cancelled, updateProgress]);

  /**
   * Cancels ongoing processing
   */
  const cancelProcessing = useCallback(() => {
    setCancelled(true);
    try { dub5.abort(); } catch (_) {}
    setProcessing(false);
    setProgress(0);
    setCurrentStep('');
  }, []);

  /**
   * Resets processing state
   */
  const reset = useCallback(() => {
    setProcessing(false);
    setProgress(0);
    setCurrentStep('');
    setError(null);
    setResults(null);
    setCancelled(false);
    try { dub5.abort(); } catch (_) {}
  }, []);

  return {
    processing,
    progress,
    currentStep,
    error,
    results,
    processVideo,
    cancelProcessing,
    reset,
  };
}

