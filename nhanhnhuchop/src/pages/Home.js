import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const highestRecord = history.length > 0 
    ? [...history].sort((a, b) => b.score - a.score)[0] 
    : null;

  return (
    <div>
      <h1>Nhanh như chớp - Web Version</h1>
      {highestRecord && (
        <h3 style={{ color: 'red' }}>
          Kỷ lục: {highestRecord.score} điểm - {highestRecord.name}
        </h3>
      )}
      <p>Luật chơi: Trả lời 15 câu hỏi. Mỗi câu 15 giây. Trả lời càng nhanh điểm càng cao!</p>
      
      <div style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          value={playerName} 
          onChange={(e) => setPlayerName(e.target.value)} 
          placeholder="Nhập tên người chơi..."
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button 
          onClick={() => navigate("/play")} 
          disabled={!playerName.trim()} 
          style={{ padding: '8px 15px' }}
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
};

export default Home;