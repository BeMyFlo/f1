import React, { useEffect, useState } from 'react';
import Spinner from '../Spinner';
import cityApi from '../../api/city/cityApi';

function CitySelectorPopup({ onClose, onSelect }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCity = async () => {
    try {
      setLoading(true);
      const response = await cityApi.getCity();
      if (response) {
        setData(response.data);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCity();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Lỗi: {error.message}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/3 w-2/3">
        <h2 className="text-lg font-bold mb-4">Chọn Khu Vực</h2>
        <ul>
          {data.map((city) => (
            <li
              key={city.id}
              className="cursor-pointer py-2 px-4 hover:bg-gray-200"
              onClick={() => {
                onSelect(city);
                onClose();
              }}
            >
              {city.name}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-black text-white py-2 px-4 rounded shadow-md"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export default CitySelectorPopup;
