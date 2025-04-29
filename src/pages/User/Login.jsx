import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { setNotification } from '../../redux/notificationSlice';
import userApi from '../../api/user/userApi';

function Login() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ phone: false, password: false });
  const [rememberMe, setRememberMe] = useState(false);

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
    if (id === "phone" && !/^\d*$/.test(value)) return;
    setFormData({
      ...formData,
      [id]: value,
    });

    setErrors({
      ...errors,
      [id]: false,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = {
      phone: !formData.phone,
      password: !formData.password,
    };

    if (newErrors.phone || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await userApi.signin({ username: `+84${formData.phone}`, password: formData.password });
      if (response.token) {
        const token = response.token;
        const user = response.user;
        setAuthToken(token);
        dispatch(setUser({ user, token }));
        dispatch(setNotification({ message: "Đăng nhập thành công!", type: "success" }));
        navigate("/");
      } else {
        dispatch(setNotification({ message: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!", type: "fail" }));
      }
    } catch (error) {
      dispatch(setNotification({ message: "Đã xảy ra lỗi khi đăng nhập!", type: "fail" }));
      console.error("Đã xảy ra lỗi", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="mt-44">
      <div className="p-3 md:h-[500px] md:w-[480px] md:mx-auto bg-backgroundColor md:bg-white md:rounded-3xl md:shadow-md">
        <div className="flex justify-center mt-[-50px]">
          <div className="h-32 w-[200px] md:w-[360px] flex justify-center items-center bg-red-500 rounded-3xl shadow-md">
            <h3 className="block antialiased tracking-normal font-sans text-3xl font-extrabold leading-snug text-white">Đăng nhập</h3>
          </div>
        </div>
        <div className="flex justify-center w-full h-full mt-10">
          <div className="w-full h-full">
            <form onSubmit={handleLogin} className="flex flex-col gap-5 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="spinner"></div>
                </div>
              )}
              <div className="flex flex-col justify-center w-full items-center">
                {errors.phone && <p className="text-red-500 mb-1">Vui lòng nhập số điện thoại</p>}
                <div className="flex items-center border p-3 rounded-lg w-3/4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="Vietnam Flag" className="w-6 h-4 mr-2" />
                  <span className="text-gray-500 mr-2">+84</span>
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className={`outline-none w-full ${errors.phone ? 'border-red-500' : ''}`}
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center w-full items-center">
                {errors.password && <p className="text-red-500 mb-1">Vui lòng nhập mật khẩu</p>}
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className={`border p-3 rounded-lg w-3/4 ${errors.password ? 'border-red-500' : ''}`}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center">
                <div className="w-3/4 h-9 flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded-3xl"
                      checked={rememberMe}
                      onChange={handleRememberMeChange} // Track checkbox state
                    />
                  </div>
                  <div className="flex items-center">
                    <p className="text-black">Remember me</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button className="bg-red-500 p-4 rounded-xl text-cyan-50 font-semibold w-3/4 shadow-md">
                  Đăng nhập
                </button>
              </div>
              <div className="flex justify-center gap-2">
                <p>Bạn không có tài khoản?</p>
                <a href="/register" className="font-bold text-blue-600">Đăng ký</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
