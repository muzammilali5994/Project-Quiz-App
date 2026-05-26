import { useState } from 'react';
import { quizQuestions } from './quizQuestions';

export default function App(){
  // Current question ka index (0 matlab pehla question)
  const [currentIdx, setCurrentIdx] = useState(0);

  // User ne kaunsa option select kiya hai
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Total score track karne ke liye
  const [score, setScore] = useState(0);


  const activeQuestion = quizQuestions[currentIdx];


}