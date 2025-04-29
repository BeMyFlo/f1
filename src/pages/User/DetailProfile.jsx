import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import userApi from '../../api/user/userApi';
import { setUser } from '../../redux/userSlice';
import { setNotification } from '../../redux/notificationSlice';

function DetailProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.user);

    // Khởi tạo state cho email và name từ dữ liệu người dùng
    const [email, setEmail] = useState(user?.profile?.email || '');
    const [name, setName] = useState(user?.profile?.name || '');
    const [phone, setPhone] = useState(user?.profile?.phone || '');
    const [address, setAddress] = useState(user?.profile?.address || '');
    const [imageUrl, setImageUrl] = useState(user?.profile?.imageUrl || '');

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const handleSave = async () => {
        const updatedProfile = {
            user_id: user._id,
        };
    
        if (email !== user.profile.email) {
            updatedProfile.email = email;
        }
        if (name !== user.profile.name) {
            updatedProfile.name = name;
        }
        if (phone !== user.profile.phone) {
            updatedProfile.phone = phone;
        }

        if (address !== user.profile.address) {
            updatedProfile.address = address;
        }

        if (imageUrl !== user.profile.imageUrl) {
            updatedProfile.imageUrl = imageUrl;
        }
    
        console.log("Updated profile data:", updatedProfile);
    
        const response = await userApi.updateUserInfo(updatedProfile);
        if (response.error) {
            dispatch(setNotification({ message: "Cập nhập thất bại!", type: "fail" }));
            return;
        }
        if (response.user) {
            const updatedUser = response.user;
            dispatch(setUser({ user: updatedUser, token }));
            dispatch(setNotification({ message: "Cập nhật thông tin thành công!", type: "success" }));
        }
    };
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
                    <p className="font-semibold text-xl text-gray-800">{name || 'Người dùng mới'}</p>
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
                        <div>
                            <label htmlFor="UserEmail" className="block text-xs font-medium text-gray-700 text-left"> Email </label>
                            <input
                                type="email"
                                id="UserEmail"
                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm h-[50px] p-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="UserName" className="block text-xs font-medium text-gray-700 text-left"> Tên </label>
                            <input
                                type="text"
                                id="UserName"
                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm h-[50px] p-3"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="UserPhone" className="block text-xs font-medium text-gray-700 text-left"> Số điện thoại </label>
                            <input
                                type="text"
                                id="UserPhone"
                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm h-[50px] p-3"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="UserAddress" className="block text-xs font-medium text-gray-700 text-left"> Địa chỉ </label>
                            <input
                                type="text"
                                id="UserAddress"
                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm h-[50px] p-3"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="UserAvatar" className="block text-xs font-medium text-gray-700 text-left"> Link Avatar </label>
                            <input
                                type="text"
                                id="UserAvatar"
                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm h-[50px] p-3"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="mt-4 bg-red-500 text-white p-2 rounded w-full"
                        >
                            Save
                        </button>
                    </fieldset>
                </div>
            </div>
        </div>
    );
}

export default DetailProfile;
