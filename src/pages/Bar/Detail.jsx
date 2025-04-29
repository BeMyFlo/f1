import React, { useState, useEffect } from 'react';
import Slider from "../../components/Slider.js";
import { useParams, useNavigate } from 'react-router-dom';
import DateSelectorPopup from '../../components/Popup/DateSelector/DateSelectorPopup.js';
import HourSelectorPopup from '../../components/Popup/HourSelectorPopup.js';
import { format } from 'date-fns';
import Spinner from '../../components/Spinner.js';
import LoginPopup from '../../components/Popup/LoginPopup.js';
import { useSelector } from 'react-redux';
import barApi from '../../api/bar/barApi.js';
import ratingBookingApi from '../../api/ratingbooking/ratingBookingApi.js';
import { FaMoneyBillWave, FaRegStar, FaStar } from 'react-icons/fa';
import { use } from 'react';

function Detail() {
  const { id } = useParams();
  const TYPE_HOLE = 1;
  const TYPE_CAROM = 2;
  const BG_COLOR_HOLE = 'bg-green-600';
  const BG_COLOR_CAROM = 'bg-blue-600';
  const BG_COLOR_UNAVAILABLE = 'bg-gray-400';
  const BG_COLOR_IS_SELECTED = 'bg-red-600';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [colors, setColors] = useState([]);
  const [selected, setSelected] = useState('booking');
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showHourPopup, setShowHourPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedTimePlay, setSelectedTimePlay] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [listComment, setListComment] = useState([]);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await barApi.getBarById(id);
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
    };

    fetchData();
    getRatingBooking();
  }, [id]);

  const getRatingBooking = async () => {
    try {
      const response = await ratingBookingApi.getRatingBookingByBarId(id);
      if (response) {
        setListComment(response.data);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setError(error);
    }
  };

  useEffect(() => {
    if (data && data.tables) {
      const updatedColors = data.tables.map((table) => {
        if (table.type === TYPE_HOLE) {
          return BG_COLOR_HOLE;
        } else if (table.type === TYPE_CAROM) {
          return BG_COLOR_CAROM;
        }
        return BG_COLOR_UNAVAILABLE;
      });

      setColors(updatedColors);
    }
  }, [data]);
    
  const handleClick = (index) => {
    const tableId = data.tables[index].tableId;
  
    if (colors[index] === BG_COLOR_UNAVAILABLE) {
      return;
    }
  
    const newColors = colors.map((color, i) => {
      if (i === index) {
        if (color === BG_COLOR_HOLE || color === BG_COLOR_CAROM) {
          return BG_COLOR_IS_SELECTED;
        } 
        else {
          return data.tables[i].type === TYPE_HOLE ? BG_COLOR_HOLE : BG_COLOR_CAROM;
        }
      }
      return color;
    });
  
    setColors(newColors);
  
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter((id) => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    if (!selectedHour) {
      alert('Vui lòng chọn giờ trước khi đặt.');
      return;
    }

    if (!selectedDate) {
      alert('Vui lòng chọn ngày trước khi đặt.');
      return;
    }

    if (selectedTables.length === 0) {
      alert('Vui lòng chọn ít nhất một bàn trước khi đặt.');
      return;
    }

    const imageUrl = data.imageUrl;
    const price = data.price * selectedTimePlay;
    navigate('/payment', { state: { barId: id, tables: selectedTables, imageUrl: imageUrl, date: selectedDate, hour: selectedHour, price: price, time_play: selectedTimePlay } });
  };

  const handleTimeChange = (e) => {
    setSelectedTimePlay(Number(e.target.value));
  };

  useEffect(() => { 
    if (selectedHour === null) {
      return;
    }
    getTablesByHour(selectedDate, selectedHour);
  }, [selectedHour, selectedDate]);

  const getTablesByHour = async (date, hour) => {
    try {
      setLoadingTable(true);
      const response = await barApi.getTablesByHour(id, date, hour);
      if (response) {
        const availableTableIds = response.data.tables.map(table => table.tableId);
        //Clear các bàn đã chọn nhưng không còn available
        const updatedSelectedTables = selectedTables.filter(tableId => availableTableIds.includes(tableId));
        setSelectedTables(updatedSelectedTables);

        updateTableColors(response.data.tables);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setError(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateTableColors = (newTables) => {
    const availableTableIds = newTables.map(table => table.tableId);
    
    const updatedColors = colors.map((color, index) => {
      const table = data.tables[index];

      if (selectedTables.includes(table.tableId)) {
        return BG_COLOR_IS_SELECTED;
      }
      
      if (availableTableIds.includes(table.tableId)) {
        if (table.type === TYPE_HOLE) {
          return BG_COLOR_HOLE;
        } else if (table.type === TYPE_CAROM) {
          return BG_COLOR_CAROM;
        }
      }
      
      return BG_COLOR_UNAVAILABLE; 
    });
  
    setColors(updatedColors);
  };

  const handleClickChooseHour = () => {
    if (!selectedDate) {
      alert('Vui lòng chọn ngày trước khi chọn giờ.');
      return;
    }
    setShowHourPopup(true);
  };


  if (loading) {
    return (
      <div className="mt-80">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Lỗi: {error.message}</div>;
  }

  return (
    <div className="mt-20">
      {/* Hình */}
      <Slider img={data.imageUrl} />
      {/* Tên quán */}
      <div>
        <h1 className="text-3xl md:text-6xl text-center font-bold text-black md:mt-10">{data.name}</h1>
      </div>
      {/* Menu con */}
      <div className="flex flex-row justify-center gap-10 mt-6">
        <div
          className={`hover:text-grayText ${selected === 'booking' ? 'bg-primaryGray rounded-2xl shadow-xl cursor-pointer' : ''}`}
          onClick={() => setSelected('booking')}
        >
          <div className="h-[46px] w-[116px] flex items-center justify-center ">
            <p className={`font-bold font-inter text-2xl cursor-pointer ${selected === 'booking' ? 'text-grayText' : ''}`}>Đặt bàn</p>
          </div>
        </div>
        <div
          className={`hover:text-grayText ${selected === 'describe' ? 'bg-primaryGray rounded-2xl shadow-xl' : ''}`}
          onClick={() => setSelected('describe')}
        >
          <div className="h-[46px] w-[116px] flex items-center justify-center ">
            <p className={`font-bold font-inter text-2xl cursor-pointer ${selected === 'describe' ? 'text-grayText' : ''}`}>Mô tả</p>
          </div>
        </div>
      </div>
      {/* Thông tin chi tiết */}
      <div className={`mt-6 mx-8 content-center ${selected === 'booking' ? 'hidden' : ''}`}>
        <p>{data.content}</p>
      </div>
      <div className={`flex justify-center mt-6 ${selected === 'describe' ? 'hidden' : ''}`}>
        <div className="h-[60px] w-[300px] md:h-[95px] md:w-[560px] bg-lightYellow rounded-[10px] flex justify-center items-center shadow-xl">
          <div className={`p-2 bg-lightYellow h-[60px] w-[300px] md:h-[90px] md:w-[530px] flex gap-1 rounded-[40px]`}>
            <div className="bg-lightYellow h-full w-1/2 rounded-xl flex items-center" onClick={() => setShowDatePopup(true)}>
              <div className="flex flex-col items-start p-2 cursor-pointer">
                <p className="font-bold">Ngày</p>
                <p className={`${!selectedDate ? 'blink' : ''}`}>{selectedDate ? format(new Date(selectedDate), 'dd/MM/yyyy') : 'Chưa chọn ngày'}</p>
              </div>
            </div>
            <div className="h-full w-[1px] BG_COLOR_UNAVAILABLE"></div>
            <div className="bg-lightYellow h-full w-1/2 rounded-xl flex items-center " onClick={() => handleClickChooseHour()}>
              <div className="flex flex-col items-start p-2 cursor-pointer">
                <p className="font-bold">Giờ</p>
                <p className={`${!selectedHour ? 'blink' : ''}`}>
                  {selectedHour ? `${selectedHour}:00` : 'Chưa chọn giờ'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ô chọn số giờ chơi */}
      <div className='flex justify-center mt-6'>
        <div className="flex items-center space-x-2">
          <label htmlFor="hours" className="text-lg font-bold">Chọn số giờ chơi:</label>
          <input 
              id="hours" 
              type="number" 
              min="1" 
              max="24" 
              step="1" 
              className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="1"
              onChange={handleTimeChange}
          />
          <span className="text-md text-gray-500">giờ</span>
        </div>
      </div>
      {/* Các ô chọn bàn */}
      <div className={`flex flex-col h-full w-full mt-10 justify-center md:h-full md:w-full ${selected === 'describe' ? 'hidden' : ''}`}>
        <div className="grid grid-cols-2 gap-2 px-5 ml-10 md:flex md:flex-row justify-center items-center md:gap-5 md:p-2">
          <div className="flex items-center md:mb-2 justify-start md:justify-start">
            <div className={`h-4 w-4 ${BG_COLOR_HOLE} rounded-full mr-2`}></div>
            <p>Bida lỗ</p>
          </div>
          <div className="flex items-center md:mb-2 justify-start md:justify-start">
            <div className={`h-4 w-4 ${BG_COLOR_CAROM} rounded-full mr-2`}></div>
            <p>Bida 3 băng</p>
          </div>
          <div className="flex items-center md:mb-2 justify-start md:justify-start">
            <div className={`h-4 w-4 ${BG_COLOR_UNAVAILABLE} rounded-full mr-2`}></div>
            <p>Đã được đặt</p>
          </div>
          <div className="flex items-center md:mb-2 justify-start md:justify-start">
            <div className={`h-4 w-4 ${BG_COLOR_IS_SELECTED} rounded-full mr-2`}></div>
            <p>Đang chọn</p>
          </div>
        </div>

        {/* Các bàn */}
        <div className="relative flex justify-center">
          <div className="grid grid-cols-5 gap-2 md:gap-3 mt-6 justify-center w-fit">
            {colors.map((color, index) => (
              <div key={data.tables[index].tableId} className="flex justify-center">
              <div
                className={`h-10 w-10 md:h-16 md:w-16 ${color} rounded-xl shadow-lg cursor-pointer
                  ${color === BG_COLOR_UNAVAILABLE ? '' : 
                    color === BG_COLOR_HOLE ? 'hover:bg-green-700' : 
                    color === BG_COLOR_CAROM ? 'hover:bg-blue-700' : 
                    color === BG_COLOR_IS_SELECTED ? 'hover:bg-red-700' : ''
                  }`}
                onClick={() => handleClick(index)}
                style={{ cursor: color === BG_COLOR_UNAVAILABLE ? 'not-allowed' : 'pointer' }}
              ></div>
              </div>
            ))}
          </div>
          {loadingTable && (
            <div className="absolute inset-0 flex items-center justify-cente bg-opacity-50 z-10">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      {/* Nút đặt bàn */}
      <div className={`mt-10 flex justify-center ${selected === 'describe' ? 'hidden' : ''}`}>
        <div
          className="h-[40px] w-[150px] text-lg rounded-[10px] md:h-[78px] md:w-[298px] shadow-xl bg-red-500 flex items-center justify-center md:rounded-[20px] md:text-4xl cursor-pointer text-white"
          onClick={handleBooking}
        >
          <p>Đặt bàn</p>
        </div>
      </div>

      {/* Đánh giá */}
      <div className="mt-10 md:mt-28 px-5 md:px-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Đánh giá từ khách hàng</h2>
        {listComment.length > 0 ? (
          <div className="overflow-x-auto whitespace-nowrap flex space-x-4">
            {listComment.map((commentData, index) => (
              <div
                key={index}
                className="flex-none w-[300px] md:w-[400px] bg-gray-100 rounded-lg p-4 shadow-md"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={commentData.user_profile.imageUrl}
                    alt={commentData.user_profile.name}
                    className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover bg-gray-300"
                  />
                  <p className="text-lg md:text-xl font-semibold text-gray-800">
                    {commentData.user_profile.name}
                  </p>
                </div>
                <div className="flex items-center my-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <span key={starIndex}>
                      {starIndex < commentData.rating_booking.rating ? (
                        <FaStar className="text-yellow-500" />
                      ) : (
                        <FaRegStar className="text-gray-400" />
                      )}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mt-3 overflow-hidden text-ellipsis whitespace-normal text-left">
                  {commentData.rating_booking.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>Chưa có đánh giá nào</p>
          </div>
        )}
      </div>
      
      {showDatePopup && (
        <DateSelectorPopup
          selectedDate={selectedDate ? new Date(selectedDate) : null}
          onClose={() => setShowDatePopup(false)}
          onSelect={(timestamp) => setSelectedDate(timestamp)}
        />
      )}
      {showHourPopup && (
        <HourSelectorPopup
          selectedHour={selectedHour}
          onClose={() => setShowHourPopup(false)}
          onSelect={(hour) => setSelectedHour(hour)}
        />
      )}
      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
}

export default Detail;
