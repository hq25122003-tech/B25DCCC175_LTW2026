import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
// Chúng ta sẽ tạo các file này sau
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ltw_chop_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Gọi API lấy câu hỏi
  useEffect(() => {
    const controller = new AbortController();
    axios.get("/data/questions.json", { signal: controller.signal })
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          setError(err);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  // Lưu lịch sử
  useEffect(() => {
    localStorage.setItem('ltw_chop_history', JSON.stringify(history));
  }, [history]);

  if (loading) return <h2>Đang tải câu hỏi...</h2>;
  if (error) return <h2>Không tải được câu hỏi</h2>;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />} />
        <Route path="play" element={<Play questions={questions} playerName={playerName} setHistory={setHistory} />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History history={history} setHistory={setHistory} />} />
        <Route path="questions" element={<QuestionBank questions={questions} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App; 