import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);

  const question = questions.find(q => q.id === Number(id));

  if (!question) return <h2>Không tìm thấy câu hỏi</h2>;

  return (
    <div>
      <h2>Câu hỏi số {question.id} - {LEVELS[question.level]} - {question.reserve ? "Dự bị" : "Chính thức"}</h2>
      <h3>{question.question}</h3>
      <ul>
        {question.options.map((opt, idx) => {
          const isCorrect = showAnswer && idx === question.answer;
          return (
            <li key={idx} style={{ backgroundColor: isCorrect ? 'lightgreen' : 'transparent', padding: '5px', listStyle: 'none' }}>
              {LETTERS[idx]}. {opt} {isCorrect && "(Đáp án đúng)"}
            </li>
          );
        })}
      </ul>
      {showAnswer && <p><b>Giải thích:</b> {question.explain}</p>}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setShowAnswer(!showAnswer)} style={{ marginRight: '10px' }}>
          {showAnswer ? "Ẩn đáp án" : "Xem đáp án"}
        </button>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
};
export default QuestionDetail;