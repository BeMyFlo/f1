// components/InvestmentPopup.js
import React from 'react';

function InvestmentPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gọi Vốn Đầu Tư</h2>
        <p className="text-gray-700 mb-6">
          Chúng tôi đang cần nguồn vốn để triển khai dự án! Nếu bạn quan tâm và muốn tham gia cùng chúng tôi hãy liên hệ qua email:
          <strong> haminhthong0811@gmail.com</strong>
        </p>
        <button
          onClick={onClose}
          className="block w-full rounded bg-red-500 px-4 py-2 text-white font-bold hover:bg-red-600 focus:outline-none"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export default InvestmentPopup;
