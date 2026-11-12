import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("id_asc"); 
  const [search, setSearch] = useState("");

  const offCount = questions.filter(q => !q.reserve).length;
  const resCount = questions.filter(q => q.reserve).length;

  let displayQ = [...questions];

  if (filter === "official") displayQ = displayQ.filter(q => !q.reserve);
  if (filter === "reserve") displayQ = displayQ.filter(q => q.reserve);
  if (search) displayQ = displayQ.filter(q => q.question.toLowerCase().includes(search.toLowerCase()));

  if (sort === "level_asc") displayQ.sort((a, b) => a.level - b.level || a.id - b.id);
  if (sort === "level_desc") displayQ.sort((a, b) => b.level - a.level || a.id - b.id);

  const activeBtnStyle = { backgroundColor: 'orange', color: 'white' };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button style={filter === 'all' ? activeBtnStyle : {}} onClick={() => setFilter("all")}>Tất cả ({questions.length})</button>
        <button style={filter === 'official' ? activeBtnStyle : {}} onClick={() => setFilter("official")}>Chính thức ({offCount})</button>
        <button style={filter === 'reserve' ? activeBtnStyle : {}} onClick={() => setFilter("reserve")}>Dự bị ({resCount})</button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginRight: '10px' }} />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="id_asc">Theo số thứ tự</option>
          <option value="level_asc">Mức độ: Dễ {'->'} Khó</option>
          <option value="level_desc">Mức độ: Khó {'->'} Dễ</option>
        </select>
      </div>
      <p>Có {displayQ.length} câu hỏi</p>
      
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>STT</th><th>Mức độ</th><th>Loại</th><th>Câu hỏi</th></tr></thead>
        <tbody>
          {displayQ.map(q => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{q.reserve ? "Dự bị" : "Chính thức"}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default QuestionBank;