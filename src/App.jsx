import { useState } from 'react';
import { quizQuestions } from './quizQuestions';
import ThreeScene from './ThreeScene'; // <--- 3D Scene Import kiya

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState(null);

  const question = quizQuestions[currentIdx];

  // Yeh variable pata lagayega ke click karne ke baad status kya hai
  let answerStatus = 'idle'; // idle | correct | wrong
  if (answer !== null) {
    answerStatus = answer === question?.correctAnswer ? 'correct' : 'wrong';
  }

  const handleReset = () => {
    setCurrentIdx(0);
    setAnswer(null);
  };

  if (currentIdx >= quizQuestions.length) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Quiz Completed!
          </h1>
          <p className="text-slate-400 mb-6">Aapne saare sawaal mukammal kar liye hain.</p>
          <button 
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer"
          >
            Reset / Play Again
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (option) => {
    if (answer !== null) return;
    setAnswer(option);
  };

  const handNext = () => {
    setAnswer(null);
    setCurrentIdx(currentIdx + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8">
      
      {/* Flex Layout Container jo 3D elements aur Quiz Card ko line mein rakhega */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-12">
        
        {/* 1. LEFT SIDE 3D ELEMENT (CUBE) */}
        <ThreeScene type="cube" answerStatus={answerStatus} question={currentIdx} />

        {/* 2. MIDDLE QUIZ CARD CONTAINER */}
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300 z-10">
          
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold tracking-wider text-purple-400 uppercase bg-purple-950/50 px-3 py-1.5 rounded-full border border-purple-800/50">
              Question {currentIdx + 1} of {quizQuestions.length}
            </span>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentIdx) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-semibold leading-snug mb-8 text-slate-100">
            {question.question}
          </h2>

          {/* Options Stack */}
          <div className="space-y-3.5 mb-8">
            {question.options.map((x) => {
              const isSelected = answer === x;
              const isCorrect = x === question.correctAnswer;
              const hasAnswered = answer !== null;

              let buttonStyles = "border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 hover:border-slate-700 text-slate-200";

              if (hasAnswered) {
                if (isCorrect) {
                  buttonStyles = "border-green-500/50 bg-green-950/40 text-green-300 font-semibold";
                } else if (isSelected && !isCorrect) {
                  buttonStyles = "border-red-500/50 bg-red-950/40 text-red-300 font-semibold";
                } else {
                  buttonStyles = "border-slate-900 bg-slate-950/10 text-slate-500 opacity-40 pointer-events-none";
                }
              }

              return (
                <button
                  key={x}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(x)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${buttonStyles}`}
                >
                  <span>{x}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex justify-end h-12">
            {answer !== null && (
              <button 
                onClick={handNext}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
              >
                Next Question →
              </button>
            )}
          </div>
        </div>

        {/* 3. RIGHT SIDE 3D ELEMENT (SPHERE) */}
        <ThreeScene type="sphere" answerStatus={answerStatus} question={currentIdx} />

      </div>
    </div>
  );
}