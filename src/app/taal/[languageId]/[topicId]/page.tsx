"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/ui/Layout";
import { getTopic } from "@/lib/dataLoader";
import { useProgress } from "@/hooks/useProgress";
import FillInExercise from "@/components/grammar/FillInExercise";
import TranslationExercise from "@/components/grammar/TranslationExercise";
import ErrorDetectionExercise from "@/components/grammar/ErrorDetectionExercise";
import WordOrderExercise from "@/components/grammar/WordOrderExercise";
import FeedbackPanel from "@/components/grammar/FeedbackPanel";
import ExerciseSummary from "@/components/grammar/ExerciseSummary";
import XPPopup from "@/components/gamification/XPPopup";
import LevelUpModal from "@/components/gamification/LevelUpModal";

export default function ExercisePage() {
  const params = useParams();
  const languageId = params.languageId as string;
  const topicId = params.topicId as string;
  const topic = getTopic(languageId, topicId);
  const {
    addXP,
    completeExercise,
    updateStreak,
    pendingXPEvents,
    clearXPEvents,
    levelUpEvent,
    dismissLevelUp,
  } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    userAnswer: string;
  } | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  if (!topic) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-stone-800">
            Onderwerp niet gevonden
          </h2>
          <Link
            href={`/taal/${languageId}`}
            className="text-indigo-600 hover:underline mt-2 inline-block"
          >
            Terug naar overzicht
          </Link>
        </div>
      </Layout>
    );
  }

  const exercises = topic.exercises;
  const current = exercises[currentIndex];
  const progress = ((currentIndex + (feedback ? 1 : 0)) / exercises.length) * 100;

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (isCorrect) {
      const xp = 10;
      setScore((s) => s + 1);
      setTotalXP((t) => t + xp);
      addXP(xp, "correct");
    }
    setFeedback({ isCorrect, userAnswer: answer });
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex + 1 >= exercises.length) {
      const finalScore = Math.round(
        ((score + (feedback?.isCorrect ? 0 : 0)) / exercises.length) * 100
      );
      completeExercise(languageId, topicId, finalScore, exercises.length);
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const renderExercise = () => {
    if (!current) return null;
    const key = `exercise-${currentIndex}`;
    switch (current.type) {
      case "invullen":
        return <FillInExercise key={key} exercise={current} onAnswer={handleAnswer} />;
      case "vertalen":
        return <TranslationExercise key={key} exercise={current} onAnswer={handleAnswer} />;
      case "foutherkenning":
        return <ErrorDetectionExercise key={key} exercise={current} onAnswer={handleAnswer} />;
      case "zinsvolgorde":
        return <WordOrderExercise key={key} exercise={current} onAnswer={handleAnswer} />;
      default:
        return <FillInExercise key={key} exercise={current} onAnswer={handleAnswer} />;
    }
  };

  return (
    <Layout>
      {/* XP popups */}
      {pendingXPEvents.map((evt, i) => (
        <XPPopup key={i} amount={evt.amount} onComplete={clearXPEvents} />
      ))}

      {/* Level up modal */}
      {levelUpEvent && (
        <LevelUpModal
          oldLevel={levelUpEvent.oldLevel}
          newLevel={levelUpEvent.newLevel}
          onDismiss={dismissLevelUp}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/taal/${languageId}`}
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-stone-800">{topic.name}</h1>
            {!finished && (
              <p className="text-xs text-stone-500">
                Vraag {currentIndex + 1} van {exercises.length}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!finished && (
          <div className="w-full bg-stone-200 rounded-full h-2">
            <motion.div
              className="bg-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {finished ? (
            <ExerciseSummary
              correct={score}
              total={exercises.length}
              xpEarned={totalXP}
              languageId={languageId}
            />
          ) : feedback ? (
            <FeedbackPanel
              exercise={current}
              isCorrect={feedback.isCorrect}
              userAnswer={feedback.userAnswer}
              onNext={handleNext}
              languageId={languageId}
            />
          ) : (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderExercise()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
