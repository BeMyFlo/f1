import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="">
            {/* Banner Background */}
            <div className="h-[200px] w-full bg-gray-800 relative">
                <img
                    src="https://inkythuatso.com/uploads/thumbnails/800/2022/04/top-50-hanh-anh-hanh-na-n-mau-trang-aap-nhayt-14-04-16-13-21.jpg"
                    alt="Banner"
                    className="h-full w-full object-cover"
                />
                {/* Button Edit trên góc phải */}
                <button className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded">
                    Edit
                </button>
            </div>

            {/* Avatar và Thông tin người dùng */}
            <div className="relative flex flex-col items-center -mt-16">
                <img
                    src={user.profile.imageUrl || "https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-photo-700-205577532.jpg"}
                    alt="Avatar"
                    className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
                />
                <div className="text-center mt-4">
                    <p className="font-semibold text-xl text-gray-800">{user.profile.name || 'Người dùng mới'}</p>
                    <p className="font-medium text-gray-500">{user.profile.phone}</p>
                </div>
            </div>

            {/* Thông tin số lượng bài đăng, người theo dõi, và đang theo dõi */}
            <div className="flex justify-center space-x-8 mt-4">
                <div className="text-center">
                    <p className="font-bold text-gray-800">259</p>
                    <p className="text-gray-500">Bookings</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-800">20</p>
                    <p className="text-gray-500">Likes</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-800">30</p>
                    <p className="text-gray-500">Ratings</p>
                </div>
            </div>

            {/* About Me Section */}
            <div className="mt-6 text-center px-6">
                <h3 className="font-semibold text-gray-700">About Me</h3>
                <p className="text-gray-500 mt-2">
                    Đã thực hiện 50 bookings.
                </p>
            </div>

            {/* Phần cài đặt tùy chọn ở dưới cùng */}
            <div className="h-auto w-full flex justify-center items-center mt-8">
                <div className="flex justify-center w-full">
                    <fieldset className="w-4/5 md:w-[550px] space-y-2">
                        <Link to="/history">
                            <label
                                htmlFor="Option1"
                                className="flex items-center gap-2 rounded-lg border p-4 transition cursor-pointer hover:bg-gray-50 bg-white shadow-md mt-2"
                            >
                                <div className="flex items-start flex-col ml-3">
                                    <strong className="font-medium text-gray-900">Xem lịch sử</strong>
                                    <p className="mt-1 text-sm text-gray-700 leading-tight">
                                        Quản lý đơn đặt bàn.
                                    </p>
                                </div>
                            </label>
                        </Link>

                        <Link to="/detail-profile">
                            <label
                                htmlFor="Option2"
                                className="flex items-center gap-2 rounded-lg border p-4 transition cursor-pointer hover:bg-gray-50 bg-white shadow-md mt-2"
                            >
                                <div className="flex items-start flex-col ml-3">
                                    <strong className="font-medium text-gray-900">Xem hồ sơ</strong>
                                    <p className="mt-1 text-sm text-gray-700 leading-tight">Quản lý thông tin cá nhân</p>
                                </div>
                            </label>
                        </Link>

                        <Link to='/'>
                            <label
                                htmlFor="Option3"
                                className="flex items-center gap-2 rounded-lg border p-4 transition cursor-pointer hover:bg-gray-50 bg-white shadow-md mt-2"
                            >
                                <div className="flex items-start flex-col ml-3">
                                    <strong className="font-medium text-gray-900">Cài đặt</strong>
                                    <p className="mt-1 text-sm text-gray-700 leading-tight">Tuỳ chỉnh ứng dụng</p>
                                </div>
                            </label>
                        </Link>
                    </fieldset>
                </div>
            </div>
        </div>
    );
}

export default Profile;
