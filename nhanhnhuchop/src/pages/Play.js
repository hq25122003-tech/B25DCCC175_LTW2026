import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPoints } from '../utils';

const Play = ({ questions, playerName, setHistory }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("countdown"); 
  const [countdown, setCountdown] = useState(3);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);
  
  const [activeQuestion, setActiveQuestion] = useState(null); 
  const [isDouble, setIsDouble] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [usedPower, setUsedPower] = useState({ swap: false, double: false, stop: false });
  const [focusIdx, setFocusIdx] = useState(0); 

  const officialQuestions = questions.filter(q => !q.reserve);
  const reserveQuestions = questions.filter(q => q.reserve);

  useEffect(() => {
    if (!activeQuestion && officialQuestions.length > 0) setActiveQuestion(officialQuestions[currentIdx]);
  }, [currentIdx, officialQuestions, activeQuestion]);

  useEffect(() => {
    if (status === "countdown") {
      if (countdown > 0) {
        const id = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(id);
      } else {
        setStatus("answering");
      }
    }
  }, [countdown, status]);

  useEffect(() => {
    if (status === "answering" && !isStopped && timeLeft > 0) {
      const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(id);
    }
    if (timeLeft === 0 && status === "answering") handleAnswer(null);
  }, [timeLeft, status, isStopped]);

  useEffect(() => {
    if (status === "revealed") {
      const id = setTimeout(() => {
        if (currentIdx < 14) {
          setCurrentIdx(i => i + 1);
          setActiveQuestion(officialQuestions[currentIdx + 1]);
          setTimeLeft(TIME_PER_QUESTION);
          setStatus("answering");
          setIsDouble(false); setIsStopped(false); setFocusIdx(0);
        } else {
          const correctCount = answers.filter(a => a.correct).length;
          const totalScore = answers.reduce((sum, a) => sum + a.points, 0);
          setHistory(prev => [...prev, { id: Date.now(), name: playerName, score: totalScore, correctCount, playedAt: new Date().toLocaleString("vi-VN") }]);
          navigate("/result", { replace: true, state: { playerName, answers, score: totalScore, correctCount } });
        }
      }, 1500);
      return () => clearTimeout(id);
    }
  }, [status, currentIdx, answers]);

  useEffect(() => {
    if (status !== "answering") return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight" && (focusIdx === 0 || focusIdx === 2)) setFocusIdx(i => i + 1);
      if (e.key === "ArrowLeft" && (focusIdx === 1 || focusIdx === 3)) setFocusIdx(i => i - 1);
      if (e.key === "ArrowDown" && focusIdx < 2) setFocusIdx(i => i + 2);
      if (e.key === "ArrowUp" && focusIdx > 1) setFocusIdx(i => i - 2);
      if (e.key === "Enter") handleAnswer(focusIdx);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, focusIdx, timeLeft]);

  useEffect(() => {
    if (status !== "countdown") document.title = `Câu ${currentIdx + 1}/15 - đúng ${answers.filter(a => a.correct).length} câu`;
    return () => { document.title = "Nhanh như chớp"; };
  }, [currentIdx, answers, status]);

  if (!playerName) return <Navigate to="/" replace />;
  if (status === "countdown") return <h1 style={{fontSize: 100, textAlign: 'center'}}>{countdown}</h1>;
  if (!activeQuestion) return null;

  const handleAnswer = (chosenOpt) => {
    if (status !== "answering") return;
    setStatus("revealed");
    const isCorrect = chosenOpt === activeQuestion.answer;
    let pts = isCorrect ? calcPoints(activeQuestion, timeLeft) : 0;
    if (isCorrect && isDouble) pts *= 2;
    setAnswers(prev => [...prev, { question: activeQuestion, chosen: chosenOpt, correct: isCorrect, timeLeft, points: pts, isSwapped: usedPower.swap && activeQuestion.reserve }]);
  };

  const handleSwap = () => {
    if (usedPower.swap || status !== "answering") return;
    setActiveQuestion(reserveQuestions.find(q => q.level === activeQuestion.level));
    setTimeLeft(TIME_PER_QUESTION);
    setUsedPower({...usedPower, swap: true});
  };

  const totalScoreNow = answers.reduce((sum, a) => sum + a.points, 0);
  const correctNow = answers.filter(a => a.correct).length;
  const lastAns = answers[answers.length - 1];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Câu {currentIdx + 1}/15 - Mức độ {activeQuestion.level}</h2>
        <div style={{ textAlign: 'right' }}>
          <h3>Điểm: {totalScoreNow}</h3>
          <p>Số câu đúng: {correctNow}</p>
          {status === "revealed" && lastAns?.correct && <p style={{ color: 'green', fontWeight: 'bold' }}>+{lastAns.points} điểm</p>}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button disabled={usedPower.swap} onClick={handleSwap}>Đổi câu hỏi</button>
        <button disabled={usedPower.double} onClick={() => { setIsDouble(true); setUsedPower({...usedPower, double: true}) }}>{isDouble ? "Đang nhân đôi" : "Nhân đôi"}</button>
        <button disabled={usedPower.stop} onClick={() => { setIsStopped(true); setUsedPower({...usedPower, stop: true}) }}>Dừng giờ</button>
      </div>

      <p style={{ color: timeLeft <= 5 ? 'red' : 'black', fontWeight: 'bold' }}>
        {isStopped ? `Còn ${timeLeft} giây (đã dừng)` : `Còn ${timeLeft} giây`}
      </p>
      <div style={{ width: '100%', backgroundColor: '#eee', height: '10px', marginBottom: '20px' }}>
        <div style={{ width: `${(timeLeft/TIME_PER_QUESTION)*100}%`, height: '100%', backgroundColor: timeLeft <= 5 ? 'red' : 'green', transition: 'width 1s linear' }}></div>
      </div>

      <h3>{activeQuestion.question}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {activeQuestion.options.map((opt, idx) => {
          let bg = 'white';
          if (status === "revealed") {
            if (idx === activeQuestion.answer) bg = 'lightgreen';
            else if (idx === lastAns?.chosen) bg = 'lightpink';
          }
          const isFocused = status === "answering" && focusIdx === idx;
          return (
            <button key={idx} disabled={status !== "answering"} style={{ padding: '15px', fontSize: '16px', backgroundColor: bg, border: isFocused ? '3px solid blue' : '1px solid gray', cursor: 'pointer' }} onClick={() => handleAnswer(idx)}>
              {LETTERS[idx]}. {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default Play; 