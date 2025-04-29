import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import userApi from '../../api/user/userApi';
import axios from 'axios';

function LoginPopup({ onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Restrict username input to numbers only
    if (id === "username" && !/^\d*$/.test(value)) return;
    
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    const newErrors = {
      username: !username,
      password: !password,
    };
    
    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Prepend +84 to the username before sending
      const response = await userApi.signin({ username: `+84${username}`, password });
      if (response.token) {
        setAuthToken(response.token);
        dispatch(setUser({ user: response.user, token: response.token }));
        onClose();
      } else {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi đăng nhập!");
      console.error("Đã xảy ra lỗi", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-[300px] md:w-[480px] relative">
        <button onClick={onClose} className="absolute top-2 right-2">X</button>
        <h3 className="text-2xl font-bold text-center mb-4">Đăng nhập</h3>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
              <div className="spinner"></div>
            </div>
          )}

          <div className="flex flex-col">
            {errors.username && <p className="text-red-500 mb-1">Vui lòng nhập số điện thoại</p>}
            <div className="flex items-center border p-3 rounded-lg">
              {/* Vietnam Flag Icon */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="Vietnam Flag" className="w-6 h-4 mr-2" />
              {/* +84 Prefix */}
              <span className="text-gray-500 mr-2">+84</span>
              <input
                type="text"
                placeholder="Số điện thoại"
                className={`outline-none w-full ${errors.username ? 'border-red-500' : ''}`}
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            {errors.password && <p className="text-red-500 mb-1">Vui lòng nhập mật khẩu</p>}
            <input
              type="password"
              placeholder="Mật khẩu"
              className={`border p-3 rounded-lg ${errors.password ? 'border-red-500' : ''}`}
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 p-4 rounded-xl text-white font-semibold w-full shadow-md"
          >
            Đăng nhập
          </button>
          <p>Bạn không có tài khoản? <a href="/register" className="text-blue-500">Đăng kí ngay</a></p>
        </form>
      </div>
    </div>
  );
}

export default LoginPopup;
