import React, { useEffect, useState } from 'react';
import Spinner from '../Spinner';
import cityApi from '../../api/city/cityApi';
import { use } from 'react';

function FilterPopup({ onClose, onSelect, filter }) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(''); // Thay đổi thành 1 giá trị thay vì mảng
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (filter) {
      setSelectedCities(filter.cities || []);
      setSelectedDistricts(filter.districts || []);
      setSelectedCategories(filter.categories || []);
      setSelectedOrder(filter.order || '');
    }
  }, [filter]);
      

  // Các loại bàn
  const TYPE_POOL = 1;
  const TYPE_CAROM = 2;
  const BOTH = 3;

  const categories = [
    { id: TYPE_POOL, name: 'Bida Lỗ' },
    { id: TYPE_CAROM, name: 'Bida 3 băng' },
  ];

  const orders = [
    { id: 1, name: 'Gần nhất' },
    { id: 2, name: 'Giá giảm dần' },
    { id: 3, name: 'Giá tăng dần' },
    { id: 4, name: 'Số lượt yêu thích' },
  ];

  const getCityData = async () => {
    try {
      setLoading(true);
      const response = await cityApi.getCity();
      if (response) {
        setCities(response.data);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const getDistrictData = async () => {
    try {
      setLoading(true);
      const response = await cityApi.getDistrict();
      if (response) {
        setDistricts(response.data);
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
    getCityData();
    getDistrictData();
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

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCities(prevState => {
      if (prevState.includes(cityId)) {
        return prevState.filter(id => id !== cityId); // Bỏ chọn
      } else {
        return [...prevState, cityId]; // Thêm vào
      }
    });
  };

  const handleDistrictChange = (event) => {
    console.log(event.target.value);
    
    const districtId = event.target.value;
    setSelectedDistricts(prevState => {
      if (prevState.includes(districtId)) {
        return prevState.filter(id => id !== districtId); // Bỏ chọn
      } else {
        return [...prevState, districtId]; // Thêm vào
      }
    });
  };

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10); // Đảm bảo categoryId là số
    setSelectedCategories(prevState => {
      if (prevState.includes(categoryId)) {
        return prevState.filter(id => id !== categoryId); // Bỏ chọn
      } else {
        return [...prevState, categoryId]; // Thêm vào
      }
    });
  };

  const handleOrderChange = (event) => {
    // Chỉ một giá trị
    setSelectedOrder(event.target.value);
  };

  const applyFilter = () => {
    const filters = {
      cities: selectedCities,
      districts: selectedDistricts,
      categories: selectedCategories,
      order: selectedOrder,
    };
    onSelect(filters);
    onClose();
  };

  const resetFilter = () => {
    setSelectedCities([]);
    setSelectedDistricts([]);
    setSelectedCategories([]);
    setSelectedOrder('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg sm:w-3/4 md:w-2/3 lg:w-1/2 w-full max-h-full overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Lọc</h2>
  
        {/* Sắp xếp theo */}
        <div className="mb-4 mt-10">
          <h3 className="font-semibold mb-2 text-left">Sắp xếp theo</h3>
          <div className="flex flex-wrap">
            {orders.map(order => (
              <label
                key={order.id}
                htmlFor={`order-${order.id}`}
                className="flex items-center w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 p-2"
              >
                <input
                  type="radio"
                  id={`order-${order.id}`}
                  name="order"
                  value={order.id}
                  checked={selectedOrder == order.id}
                  onChange={handleOrderChange}
                  className="mr-2"
                />
                {order.name}
              </label>
            ))}
          </div>
        </div>
  
        {/* Thể loại */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-left">Thể loại</h3>
          <div className="flex flex-wrap">
            {categories.map(category => (
              <label
                key={category.id}
                className="flex items-center w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 p-2"
              >
                <input
                  type="checkbox"
                  value={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onChange={handleCategoryChange}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
  
        {/* Địa điểm */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-left">Địa điểm</h3>
          <div className="flex flex-wrap">
            {cities.map(city => (
              <label
                key={city._id}
                className="flex items-center w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 p-2"
              >
                <input
                  type="checkbox"
                  value={city._id}
                  checked={selectedCities.includes(city._id)}
                  onChange={handleCityChange}
                  className="mr-2"
                />
                {city.name}
              </label>
            ))}
          </div>
        </div>
  
        {/* Quận */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-left">Quận</h3>
          <div className="flex flex-wrap">
            {districts.map(district => (
              <label
                key={district._id}
                className="flex items-center w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 p-2"
              >
                <input
                  type="checkbox"
                  value={district._id}
                  checked={selectedDistricts.includes(district._id)}
                  onChange={handleDistrictChange}
                  className="mr-2"
                />
                {district.name}
              </label>
            ))}
          </div>
        </div>
  
        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
          <div className="flex gap-4">
            <button
              className="bg-gray-300 text-black py-2 px-4 rounded"
              onClick={resetFilter}
            >
              Reset
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={applyFilter}
            >
              Lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  
}

export default FilterPopup;
