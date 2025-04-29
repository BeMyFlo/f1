import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { DistanceFromUser } from '../utils/helper.js';

const BilliardBarCard = ({ item, toggleLike, formatPrice }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden' style={{ width: '320px' }}>
      <Link to={`/detail/${item._id}`}>
        <img src={item.imageUrl} alt={item.name} className='w-full h-72 object-cover shadow-lg' />
      </Link>
      <div className='p-4 flex flex-col items-start'>
        <Link to={`/detail/${item._id}`}>
          <h3 className='font-bold text-lg text-left'>{item.name}</h3>
        </Link>
        <div className='text-gray-500 text-left'>
          Khoảng cách: <DistanceFromUser x={item.position_x} y={item.position_y} />
        </div>
        <div className='text-gray-500 flex items-center text-left'>Đánh giá: {item.rating} 4.5/5</div>
        <p className='text-gray-500 text-left'>Địa chỉ: {item.address}</p>
        <div className='flex w-full justify-between'>
          <p className='text-red-500 font-bold text-left'>Price: {formatPrice(item.price)} / h</p>
          {isAuthenticated && (
            <button onClick={() => toggleLike(item._id)} className='ml-1 mt-3 text-red-500'>
              {item.liked ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BilliardBarCard;
