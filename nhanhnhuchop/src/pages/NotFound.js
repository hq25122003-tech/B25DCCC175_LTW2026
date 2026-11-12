import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>404 - Không tìm thấy trang</h1>
    <Link to="/">Về trang chủ</Link>
  </div>
);
export default NotFound;