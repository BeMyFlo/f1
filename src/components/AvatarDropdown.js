import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { FaUser, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function AvatarDropdown() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div className="relative">
      <button
        type="button"
        className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="sr-only">Toggle dashboard menu</span>
        <img
          src={user.profile.imageUrl}
          alt="Avatar"
          className="h-10 w-10 rounded-full cursor-pointer object-cover"
        />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg" role="menu">
          <div className="p-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FaUser className="text-gray-500" />
              <span>Hồ sơ</span>
            </Link>

            <Link
              to="/history"
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FaHistory className="text-gray-500" />
              <span>Lịch sử đặt bàn</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <FaCog className="text-gray-500" />
              <span>Cài đặt</span>
            </Link>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                dispatch(logout());
                localStorage.removeItem('authToken');
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
            >
              <FaSignOutAlt className="text-red-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
