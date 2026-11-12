import React from 'react';

const History = ({ history, setHistory }) => {
  if (history.length === 0) return <h2>Chưa có lượt chơi nào</h2>;

  const sortedHistory = [...history].sort((a, b) => b.score - a.score || b.correctCount - a.correctCount);
  const totalPlays = history.length;
  const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalPlays);
  const totalCorrect = history.reduce((sum, h) => sum + h.correctCount, 0);
  const correctRate = Math.round((totalCorrect / (totalPlays * 15)) * 100);

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      <p>Số lượt chơi: {totalPlays}</p>
      <p>Điểm trung bình: {avgScore}</p>
      <p>Tỉ lệ trả lời đúng: {correctRate}%</p>
      <button onClick={() => setHistory([])} style={{ marginBottom: '15px', color: 'red' }}>Xóa lịch sử</button>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>Người chơi</th><th>Số câu đúng</th><th>Xếp loại</th><th>Điểm</th><th>Thời gian</th><th>Thao tác</th></tr></thead>
        <tbody>
          {sortedHistory.map(h => {
            const starStr = h.correctCount >= 13 ? '★★★' : h.correctCount >= 9 ? '★★☆' : h.correctCount >= 5 ? '★☆☆' : '☆☆☆';
            return (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{h.correctCount}/15</td>
                <td>{starStr}</td>
                <td>{h.score}</td>
                <td>{h.playedAt}</td>
                <td><button onClick={() => setHistory(history.filter(item => item.id !== h.id))}>Xóa</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default History;