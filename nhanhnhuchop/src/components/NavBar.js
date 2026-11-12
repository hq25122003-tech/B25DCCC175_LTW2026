import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const activeStyle = { color: 'orange', fontWeight: 'bold' };
  
  return (
    <nav style={{ padding: '15px', borderBottom: '2px solid #ccc', marginBottom: '20px' }}>
      <NavLink to="/" end style={({ isActive }) => isActive ? activeStyle : { marginRight: '20px' }}>Trang chủ</NavLink>
      <NavLink to="/questions" style={({ isActive }) => isActive ? activeStyle : { marginRight: '20px', marginLeft: '10px' }}>Ngân hàng câu hỏi</NavLink>
      <NavLink to="/history" style={({ isActive }) => isActive ? activeStyle : { marginLeft: '10px' }}>Lịch sử</NavLink>
    </nav>
  );
};

export default NavBar;