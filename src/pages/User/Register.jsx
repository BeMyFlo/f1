import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import userApi from '../../api/user/userApi';
import { Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ phone: false, password: false });

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === "phone") {
            // Allow only numbers and limit to 9 digits
            if (!/^\d*$/.test(value) || value.length > 9) return;
        }

        setFormData({
            ...formData,
            [id]: value,
        });

        setErrors({
            ...errors,
            [id]: false,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for phone number length
        let newErrors = {
            phone: !formData.phone || formData.phone.length !== 9,
            password: !formData.password,
        };

        if (newErrors.phone || newErrors.password) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const formattedData = { ...formData, phone: `+84${formData.phone}` };
            console.log("Formatted data:", formattedData);
            const res = await userApi.signup(formattedData);

            if (res && !res.error) {
                dispatch(setNotification({ message: "Đăng ký thành công!", type: "success" }));
                navigate("/login");
            } else {
                dispatch(setNotification({ message: res.error || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!", type: "fail" }));
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Lỗi từ API:", error.response.data);
                dispatch(setNotification({ message: error.response.data.error || "Đã xảy ra lỗi khi đăng ký!", type: "fail" }));
            } else {
                console.error("Đã xảy ra lỗi", error);
                dispatch(setNotification({ message: "Đã xảy ra lỗi khi đăng ký!", type: "fail" }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mt-44">
            <div className="p-3 md:h-[500px] md:w-[480px] md:mx-auto bg-backgroundColor md:bg-white md:rounded-3xl md:shadow-md">
                <div className="flex justify-center mt-[-50px]">
                    <div className="h-32 w-[200px] md:w-[360px] flex justify-center items-center bg-red-500 rounded-3xl shadow-md">
                        <h3 className="block antialiased tracking-normal font-sans text-3xl font-extrabold leading-snug text-white">Đăng kí</h3>
                    </div>
                </div>
                <div className="flex justify-center w-full h-full mt-10">
                    <div className="w-full h-full">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative">
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                    <div className="spinner"></div>
                                </div>
                            )}
                            <div className="flex flex-col justify-center w-full items-center">
                                {errors.phone && (
                                    <p className="text-red-500 mb-1">
                                        Vui lòng nhập số điện thoại hợp lệ (9 chữ số)
                                    </p>
                                )}
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
                                <button
                                    className="bg-red-500 p-4 rounded-xl text-cyan-50 font-semibold w-3/4 shadow-md"
                                    disabled={isLoading}
                                >
                                    Đăng kí
                                </button>
                            </div>
                            <div className="flex justify-center gap-2">
                                <p>Đã có tài khoản ?</p>
                                <Link to="/login" className="font-bold text-blue-600">Đăng nhập</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
