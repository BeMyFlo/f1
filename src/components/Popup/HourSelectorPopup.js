import React from 'react';

function HourSelectorPopup({ onClose, onSelect }) {
  // Tạo mảng giờ từ 1 đến 24
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Chọn giờ</h2>
        <div className="grid grid-cols-4 gap-2">
          {hours.map((hour) => (
            <button
              key={hour}
              onClick={() => {
                onSelect(hour); // Chuyển thành số nguyên và gọi hàm onSelect
                onClose(); // Đóng popup
              }}
              className="bg-gray-200 hover:bg-blue-500 text-gray-700 hover:text-white py-2 px-4 rounded transition duration-300"
            >
              {hour}:00
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default HourSelectorPopup;
