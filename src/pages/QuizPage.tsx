import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Question } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import DraggableCard from '../components/DraggableCard';
import DropSlot from '../components/DropSlot';
import Timer from '../components/Timer';
import { ChevronRight, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

interface QuizPageProps {
  questions: Question[];
  onFinish: () => void;
  onRestart: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ questions, onFinish, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<(string | null)[]>([]);
  const [availableChars, setAvailableChars] = useState<{ id: string, char: string, isUsed: boolean }[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  
  const timerRef = useRef<number>(0);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      const chars = currentQuestion.fixedShuffled.split('').map((char, i) => ({
        id: `${currentQuestion.id}-${char}-${i}`,
        char,
        isUsed: false
      }));
      setAvailableChars(chars);
      setCurrentAnswer(new Array(currentQuestion.answer.length).fill(null));
      setIsCorrect(false);
      setHintsUsed(0);
      setTimeTaken(null);
      timerRef.current = Date.now();
    }
  }, [currentQuestion]);

  const handleDrop = useCallback((item: { id: string, char: string, originalIndex: number, fromSlot?: boolean }, targetIndex: number) => {
    if (isCorrect) return;

    setCurrentAnswer((prev) => {
      const next = [...prev];
      
      // If it's from another slot
      if (item.fromSlot) {
        const sourceIndex = item.originalIndex;
        const targetId = next[targetIndex];
        
        next[targetIndex] = item.id;
        next[sourceIndex] = targetId; // Swap or null if target was empty
      } else {
        // From character pool
        const existingIdAtTarget = next[targetIndex];
        if (existingIdAtTarget) {
          setAvailableChars(avail => avail.map(a => a.id === existingIdAtTarget ? { ...a, isUsed: false } : a));
        }
        
        next[targetIndex] = item.id;
        setAvailableChars(avail => avail.map(a => a.id === item.id ? { ...a, isUsed: true } : a));
      }
      
      return next;
    });
  }, [isCorrect]);

  const handleRemove = (slotIndex: number) => {
    if (isCorrect) return;
    
    const charId = currentAnswer[slotIndex];
    if (!charId) return;

    setCurrentAnswer(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });

    setAvailableChars(avail => avail.map(a => a.id === charId ? { ...a, isUsed: false } : a));
  };

  const checkAnswer = () => {
    const userAnswer = currentAnswer.map(id => {
      const charObj = availableChars.find(a => a.id === id);
      return charObj ? charObj.char : '';
    }).join('');

    // Normalize for comparison (handle hidden chars or slightly different unicode)
    const normalize = (str: string) => str.normalize('NFKC').trim();

    if (normalize(userAnswer) === normalize(currentQuestion.answer)) {
      setIsCorrect(true);
      const now = Date.now();
      const elapsed = Math.floor((now - timerRef.current) / 1000);
      setTimeTaken(elapsed);
      
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.play().catch(() => {});
    } else {
      setShowIncorrect(true);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-xl font-black bg-white/50 px-6 py-2 rounded-full card-shadow border-2 border-yobel-green/20">
          第 {currentIndex + 1} / {questions.length} 問
        </div>
        <Timer resetKey={currentIndex} />
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-zinc-700 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-all font-bold"
        >
          <RotateCcw size={20} /> 初めから
        </button>
      </div>

      {/* Question Area */}
      <div className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl card-shadow border-4 border-yobel-green/10 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="text-yobel-green/60 text-lg font-black px-2">
            【{currentQuestion.category}】
          </div>
        </div>

        {currentQuestion.caption && (
          <div className="text-xl md:text-2xl font-black text-zinc-600 mb-2 px-2 italic">
            {currentQuestion.caption}
          </div>
        )}

        <h3 className="text-2xl md:text-4xl font-black mb-6 leading-relaxed">
          {currentQuestion.problemText}
        </h3>
        
        {isCorrect && (
          <div className="animate-bounce mb-6">
            <div className="inline-flex items-center gap-3 bg-yobel-gold text-white px-8 py-3 rounded-full text-2xl font-black card-shadow">
              <CheckCircle2 size={32} /> 正解！ {currentQuestion.reading}
            </div>
            {currentQuestion.caption && (
              <div className="mt-4 text-xl font-black text-zinc-600">
                {currentQuestion.caption}
              </div>
            )}
            <div className="mt-2 text-2xl font-black text-yobel-gold yobel-gold-glow">
              要した時間： {formatTime(timeTaken || 0)}
            </div>
          </div>
        )}

        {/* Answer Slots */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {currentAnswer.map((id, i) => {
            const charObj = availableChars.find(a => a.id === id);
            return (
              <div key={i} onClick={() => handleRemove(i)} className="cursor-pointer">
                <DropSlot
                  index={i}
                  char={charObj?.char}
                  charId={charObj?.id}
                  isCorrect={isCorrect}
                  onDrop={handleDrop}
                />
              </div>
            );
          })}
        </div>

        {/* Character Pool */}
        {!isCorrect && (
          <div className="flex flex-wrap justify-center gap-3 p-6 bg-white/30 rounded-2xl border-2 border-dashed border-yobel-green/20">
            {availableChars.map((item, i) => (
              !item.isUsed && (
                <DraggableCard
                  key={item.id}
                  id={item.id}
                  char={item.char}
                  index={i}
                />
              )
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {!isCorrect ? (
          <>
            <button
              onClick={checkAnswer}
              disabled={currentAnswer.some(a => a === null)}
              className="bg-yobel-green text-white px-10 py-4 rounded-2xl text-2xl font-black card-shadow hover:bg-yobel-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              チェック！
            </button>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  onClick={() => setHintsUsed(prev => Math.max(prev, i + 1))}
                  className={cn(
                    "px-4 py-2 rounded-xl font-black transition-all border-2",
                    hintsUsed > i 
                      ? "bg-yobel-gold text-white border-yobel-gold" 
                      : "bg-white text-yobel-green border-yobel-green/20 hover:border-yobel-green"
                  )}
                >
                  ヒント {i + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button
            onClick={nextQuestion}
            className="group bg-yobel-gold text-white px-12 py-5 rounded-2xl text-2xl font-black card-shadow hover:bg-yobel-gold/90 transition-all flex items-center gap-3"
          >
            次へ <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Hints List */}
      {hintsUsed > 0 && (
        <div className="mt-8 space-y-2 max-w-lg mx-auto">
          {currentQuestion.hints.slice(0, hintsUsed).map((hint, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/60 p-4 rounded-xl border-l-8 border-yobel-gold font-bold animate-in slide-in-from-left-4">
              <HelpCircle className="text-yobel-gold shrink-0" />
              <span>{hint}</span>
            </div>
          ))}
        </div>
      )}
      {/* Incorrect Feedback Overlay */}
      {showIncorrect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full card-shadow border-4 border-red-200 text-center animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-black text-zinc-800 mb-4">？ もう一度よく見直して・・</h2>
            <button
              onClick={() => setShowIncorrect(false)}
              className="bg-yobel-green text-white px-8 py-3 rounded-2xl text-xl font-black card-shadow hover:bg-yobel-green/90 transition-all w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
