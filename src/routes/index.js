// src/routes/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Bar from '../pages/Bar/Bar';
import Detail from '../pages/Bar/Detail';
import Login from '../pages/User/Login';
import Register from '../pages/User/Register';
import Payment from '../pages/Booking/Payment';
import Home from '../pages/Home';
import History from '../pages/History/History';
import Profile from '../pages/User/Profile';
import DetailProfile from '../pages/User/DetailProfile';
import DetailHistory from '../pages/History/DetailHistory';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/bar' element={<Bar />} />
      <Route path='/detail' element={<Detail />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/payment' element={<Payment />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/detail-profile" element={<DetailProfile />} />
      <Route path="/detail-booking" element={<DetailHistory />} />
    </Routes>
  );
};

export default AppRoutes;