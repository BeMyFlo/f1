import CitySelectorPopup from '../../components/Popup/CitySelectorPopup.js';
import { CiFilter } from "react-icons/ci";
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/helper.js';
import Spinner from '../../components/Spinner.js';
import BilliardBarCard from '../../components/BilliardBarCard.js';
import barApi from '../../api/bar/barApi.js';
import { useSelector, useDispatch } from 'react-redux';
import userLikeApi from '../../api/userlike/userLikeApi.js';
import FilterPopup from '../../components/Popup/FilterPopup.js';

const ITEMS_PER_PAGE = 9;

// Các loại bàn
const TYPE_POOL = 1;
const TYPE_CAROM = 2;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Bar() {
  // const [showCityPopup, setShowCityPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  // const [selectedCity, setSelectedCity] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);
  const { user } = useSelector((state) => state.user);

  const query = useQuery();
  const type = query.get('type') || TYPE_POOL;

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (filter) {
      console.log(filter);
    }
  }, [filter]);

  const getBar = async () => {
    setLoading(true);
    try {
      const response = await barApi.getListBar(user?._id);
      if (response) {
        setData(response.data.map(item => ({ ...item, liked: item.liked || false })));
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getBarByFilter = async () => {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Trình duyệt của bạn không hỗ trợ Geolocation.');
      }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
              const userLongitude = position.coords.longitude;
              const userLatitude = position.coords.latitude;

              const updatedFilter = {
                  ...filter,
                  userLongitude,
                  userLatitude,
              };

              const response = await barApi.getListBarByCity(user?._id, updatedFilter);
              
              if (response) {
                  setData(response.data.map(item => ({ ...item, liked: item.liked || false })));
              } else {
                  throw new Error('Dữ liệu không hợp lệ');
              }
          },
          (error) => {
              throw new Error('Không thể lấy vị trí của bạn.');
          }
      );
    } catch (error) {
      console.error('Lỗi:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!filter) {
      getBar();
    } else {
      getBarByFilter();
    }
  }, [filter]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="mt-40">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Lỗi: {error.message}</div>;
  }

  const toggleLike = async (id) => {
    const item = data.find((bar) => bar._id === id);
    if (!item) return;
  
    try {
      if (item.liked) {
        await userLikeApi.unlike(id);
      } else {
        await userLikeApi.like(id);
      }
  
      setData((prevData) =>
        prevData.map((bar) =>
          bar._id === id ? { ...bar, liked: !bar.liked } : bar
        )
      );
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái like:', error);
    }
  };

  return (
    <div className=''>
      {/* Nút Lọc */}
      <div className='flex justify-center'>
        <div className='mt-5 md:mt-10 h-14 w-4/5 flex items-center'>
          <div className='bg-white ml-20 w-40 h-full rounded-[15px] flex items-center justify-center border border-gray-20 cursor-pointer hover:bg-gray-50 shadow-md' onClick={() => setShowFilterPopup(true)}>
            <div className='flex justify-center items-center gap-2 mr-2'>
              <CiFilter className='text-2xl' />
              <p className='black text-xl'>Lọc</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách quán */}
      {selectedItems.length > 0 ? (
      <div className='flex justify-center'>
        <div className='mt-5 md:mt-8 px-3 md:px-20 w-4/5'>
          <div className='flex flex-wrap justify-center md:justify-start w-full gap-x-3 gap-y-3'>
            {selectedItems.map((item) => (
              <BilliardBarCard
                key={item._id}
                item={item}
                toggleLike={toggleLike}
                formatPrice={formatPrice}
              />
            ))}
          </div>
          
          
          {/* Phân trang */}
          <div className='flex justify-center mt-8'>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handleClick(index + 1)}
                className={`mx-1 px-3 py-1 border rounded shadow-md ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-white text-red-500'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>) : (
        <div className="mt-5">
          <p className="text-gray-500">Không có kết quả phù hợp</p>
        </div>
      )}

      {/* Popup chọn thành phố */}

      {showFilterPopup && (
        <FilterPopup
          onClose={() => setShowFilterPopup(false)}
          onSelect={(filter) => setFilter(filter)}
          filter = {filter}
        />
      )}
    </div>
  );
}

export default Bar;
