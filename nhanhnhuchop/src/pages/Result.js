import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { getStars } from '../utils';
import { LETTERS } from '../data';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) return <Navigate to="/" replace />;
  const { playerName, answers, score, correctCount } = location.state;
  const starResult = getStars(correctCount);
  const starString = '★'.repeat(starResult.stars) + '☆'.repeat(3 - starResult.stars);

  return (
    <div>
      <h2 style={{ color: 'blue' }}>{starResult.message}</h2>
      <p>Người chơi: <b>{playerName}</b></p>
      <p>Số câu trả lời đúng: <b>{correctCount}/15</b></p>
      <p>Điểm: <b>{score}</b></p>
      <p>Xếp loại: <b>{starResult.stars} sao {starString}</b></p>

      <h3>Xem lại:</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
        <thead><tr><th>Câu</th><th>Bạn chọn</th><th>Đáp án đúng</th><th>Còn lại</th><th>Điểm</th></tr></thead>
        <tbody>
          {answers.map((ans, idx) => (
            <tr key={idx} style={{ backgroundColor: ans.correct ? 'lightgreen' : 'lightpink' }}>
              <td>Câu {idx + 1} {ans.isSwapped ? "(đổi sang câu dự bị)" : ""}</td>
              <td>{ans.chosen !== null ? LETTERS[ans.chosen] : '-'}</td>
              <td>{LETTERS[ans.question.answer]}</td>
              <td>{ans.timeLeft} giây</td>
              <td>{ans.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate("/play")} style={{ marginRight: '10px', padding: '10px' }}>Chơi lại</button>
        <button onClick={() => navigate("/")} style={{ padding: '10px' }}>Về trang chủ</button>
      </div>
    </div>
  );
};
export default Result;