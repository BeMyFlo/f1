import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutConfirmation = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Đặt bàn thành công!</h2>
            </div>
            <p className="text-gray-600 text-center mt-4">
                Cảm ơn bạn đã sử dụng dịch vụ đặt bàn tại Bpool. Bàn của bạn sẽ được chuẩn bị sẵn sàng cho bạn, vui lòng đến nhận bàn đúng thời gian đã đặt.
            </p>
            <div className="flex justify-center mt-6 space-x-4">
                <Link 
                    to="/history"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none text-center"
                >
                    Xem booking của bạn
                </Link>
                <Link 
                    to="/"
                    className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none text-center"
                >
                    Tiếp tục đặt bàn
                </Link>
            </div>
        </div>
    </div>
);

export default CheckoutConfirmation;
