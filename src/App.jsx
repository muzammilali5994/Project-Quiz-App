import { useState, useEffect } from 'react';
import { quizQuestions } from './quizQuestions';
import SceneBackground from './SceneBackground';
import { Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizState, setQuizState] = useState('idle'); // 'idle' | 'answered' | 'answered-wrong' | 'completed'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  const activeQuestion = quizQuestions[currentIdx];

  // Timer loop logic
  useEffect(() => {
    if (quizState === 'completed' || quizState === 'answered' || quizState === 'answered-wrong') return;
    
    if (timeLeft === 0) {
      handleAnswerSelection(null); // Force timeout fail state
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quizState]);

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
    const isCorrect = option === activeQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setQuizState('answered');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
    } else {
      setQuizState('answered-wrong');
    }
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setQuizState('idle');
      setTimeLeft(15);
    } else {
      setQuizState('completed');
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setQuizState('idle');
    setScore(0);
    setTimeLeft(15);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-purple-500/30">
      {/* 3D WebGL Canvas Backdrop */}
      <SceneBackground 
        isCorrect={selectedAnswer === activeQuestion?.correctAnswer} 
        quizState={quizState} 
      />

      {/* Glassmorphism Quiz Card Container */}
      <main className="w-full max-w-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300">
        
        {quizState !== 'completed' ? (
          <>
            {/* Header / Stats Status Row */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold tracking-wider text-purple-400 uppercase bg-purple-950/50 px-3 py-1.5 rounded-full border border-purple-800/50">
                Question {currentIdx + 1} of {quizQuestions.length}
              </span>
              
              <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-800 text-sm">
                <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-sky-400'}`} />
                <span className={timeLeft <= 5 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentIdx) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-semibold leading-snug mb-8 text-slate-100 drop-shadow-sm">
              {activeQuestion.question}
            </h2>

            {/* Answer Options Stack */}
            <div className="space-y-3.5 mb-8">
              {activeQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === activeQuestion.correctAnswer;
                const hasAnswered = selectedAnswer !== null;

                let optionStyles = "border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 hover:border-slate-700";
                
                if (hasAnswered) {
                  if (isCorrect) optionStyles = "border-green-500/50 bg-green-950/30 text-green-200";
                  else if (isSelected && !isCorrect) optionStyles = "border-red-500/50 bg-red-950/30 text-red-200";
                  else optionStyles = "border-slate-800/40 bg-slate-950/10 text-slate-500 opacity-60 pointer-events-none";
                }

                return (
                  <button
                    key={option}
                    disabled={hasAnswered}
                    onClick={() => handleAnswerSelection(option)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left font-medium transition-all duration-200 ${optionStyles}`}
                  >
                    <span>{option}</span>
                    {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                    {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end h-12">
              {selectedAnswer !== null && (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-purple-900/30 transition-all"
                >
                  {currentIdx === quizQuestions.length - 1 ? 'Finish' : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Quiz Finished / Result Screen View */
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl mb-6">
              <Trophy className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Quiz Completed!</h2>
            <p className="text-slate-400 mb-8">Excellent effort. Here is how you performed:</p>
            
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-6 max-w-sm mx-auto mb-8">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Final Score</div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {score} / {quizQuestions.length}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Normalized Accuracy: {Math.round((score / quizQuestions.length) * 100)}%
              </div>
            </div>

            <button
              onClick={restartQuiz}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}