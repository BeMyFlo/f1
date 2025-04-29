// DiscountPopup.js
import React, { useEffect, useState } from 'react';
import discountApi from '../../api/discount/discountApi';
import { formatPriceWithPoint } from '../../utils/helper';

const DiscountPopup = ({ barId, isOpen, onClose, onSelectDiscount }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDiscounts = async () => {
    setLoading(true);
    try {
      const response = await discountApi.getListDiscountByBarId(barId);
      if (response) {
        setDiscounts(response.data);
        console.log(response.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
        getDiscounts();
    }
  }, [isOpen, barId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
        >
          &times;
        </button>
  
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">Danh sách mã giới thiệu</h2>
  
        {/* Loading/Error States */}
        {loading && <p className="text-center text-gray-500">Đang tải...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
  
        {/* Discount List */}
        {!loading && !error && discounts.length > 0 ? (
          <div className="space-y-4">
            {discounts.map((discount) => (
              <div
                key={discount._id}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow transition cursor-pointer"
                onClick={() => {
                  onSelectDiscount(discount._id);
                  onClose();
                }}
              >
                <div className="flex items-center h-28">
                  {/* Image Section */}
                  <div className="w-1/3 h-full">
                    <img
                      src="https://storage.googleapis.com/ops-shopee-files-live/live/shopee-blog/2023/10/998b7f4a-1.png"
                      alt={discount.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Info Section */}
                  <div className="w-2/3 h-full flex flex-col justify-between p-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">{discount.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatPriceWithPoint(discount.price)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      *Áp dụng từ {discount.start_time} đến {discount.end_time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-center text-gray-500">Không có mã ưu đãi nào.</p>
        )}
      </div>
    </div>
  );
};

export default DiscountPopup;
