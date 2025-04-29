import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaMoneyBillWave, FaRegStar, FaStar } from 'react-icons/fa';
import bookingApi from '../../api/booking/bookingApi';
import Spinner from '../../components/Spinner';
import LoginPopup from '../../components/Popup/LoginPopup';
import { useNavigate } from 'react-router-dom';

function History() {
    const STATUS_NEW = 1;

    const listStatus = [
        { id: STATUS_NEW, name: 'Mới' },
    ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedBookingIndex, setSelectedBookingIndex] = useState(null);
    const [comment, setComment] = useState('');

    const { isAuthenticated } = useSelector((state) => state.user);
    const navigate = useNavigate();

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const getStatus = (status) => {
        return listStatus.find((item) => item.id === status)?.name;
    };

    const getBgColor = (status) => {
        switch (status) {
            case STATUS_NEW:
                return 'bg-blue-200';
            default:
                return 'bg-gray-200';
        }
    };

    const getTextColor = (status) => {
        switch (status) {
            case STATUS_NEW:
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setShowLoginPopup(true);
            setLoading(false);
            return;
        }

        const getHistory = async () => {
            try {
                const response = await bookingApi.history();
                if (response) {
                    const dataWithRating = response.data.map(item => ({ ...item, rating: 0 }));
                    setData(dataWithRating);
                } else {
                    throw new Error('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        getHistory();
    }, [isAuthenticated]);

    const handleNavigate = (bookingId) => {
        navigate('/detail-booking', { state: { bookingId } });
    };

    const handleStarClick = (bookingIndex, barId, rating) => {
        setSelectedRating(rating);
        setSelectedBookingIndex(bookingIndex);
        setShowRatingPopup(true);
        setComment('');
    };
    

    const handleSubmitRating = async () => {
        if (selectedBookingIndex !== null) {
            try {
                const bookingId = data[selectedBookingIndex]._id;
                await bookingApi.ratingBooking({ bookingId, rating: selectedRating, comment });
                setData(prevData =>
                    prevData.map((item, index) =>
                        index === selectedBookingIndex
                            ? {
                                ...item,
                                rating_booking: { rating: selectedRating, comment },
                            }
                            : item
                    )
                );
                setShowRatingPopup(false);
                setComment('');
            } catch (error) {
                console.error('Lỗi khi gửi đánh giá:', error);
                alert('Gửi đánh giá thất bại!');
            }
        }
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
        <div className="mt-24">
            {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}

            <div className="flex justify-center mt-36">
                <h1 className="text-3xl font-bold">Lịch Sử Đặt Bàn</h1>
            </div>
            {data.length === 0 ? (
                <div className="flex flex-col items-center mt-12">
                    <p className="text-xl font-semibold">Hãy nhanh tay đặt bàn lần đầu tiên tại Bpool để nhận nhiều ưu đãi hấp dẫn!</p>
                    <button
                        className="mt-6 px-6 py-3 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 focus:outline-none"
                        onClick={() => navigate('/bar/?type=1')}
                    >
                        Đặt bàn ngay!
                    </button>
                </div>
            ) : (
                <div className="h-full flex flex-col mx-5 md:justify-center md:items-center space-y-4 mt-12">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="h-[180px] md:h-[200px] w-full md:w-3/5 rounded-lg overflow-hidden shadow-md flex border border-gray-200"
                        >
                            <div
                                className="w-1/3 md:w-1/5 h-full bg-blue-400 rounded-l-lg overflow-hidden cursor-pointer"
                                onClick={() => handleNavigate(item._id)}
                            >
                                <img
                                    src={item.bar_id.imageUrl}
                                    alt="logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="w-4/5 h-full rounded-r-lg flex justify-between md:p-2 ml-3">
                                <div className="h-full w-full p-2 md:p-4 flex flex-col items-start gap-1">
                                    <p className="text-gray-500">{item._id}</p>
                                    <p className="font-bold text-lg">{item.bar_id.name}</p>
                                    <p className="text-gray-500">
                                        {new Date(item.date).toLocaleDateString('vi-VN')} - {item.hour}:00
                                    </p>
                                    <p className="font-bold text-gray-500 flex items-center">
                                        <FaMoneyBillWave className="mr-2 text-red-500" /> {formatPrice(item.price)}
                                    </p>
                                    <div className="flex w-full justify-between">
                                        <div className={`border border-gray-200 rounded-sm ${getBgColor(item.status)} flex items-center justify-center mt-1 w-32`}>
                                            <p className={`${getTextColor(item.status)} font-bold flex items-center gap-1 text-xs p-3`}>
                                                {getStatus(item.status)}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            {item.rating_booking ? (
                                                [...Array(5)].map((_, i) => (
                                                    <span key={i}>
                                                        {i < item.rating_booking.rating ? (
                                                            <FaStar className="text-yellow-500" />
                                                        ) : (
                                                            <FaRegStar className="text-gray-400" />
                                                        )}
                                                    </span>
                                                ))
                                            ) : (
                                                [...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        onClick={() => handleStarClick(index, item.bar_id._id, i + 1)}
                                                        className="cursor-pointer"
                                                    >
                                                        {i < selectedRating ? (
                                                            <FaStar className="text-yellow-500" />
                                                        ) : (
                                                            <FaRegStar className="text-gray-400" />
                                                        )}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showRatingPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Đánh giá</h2>
                        <div className="flex items-center justify-center mb-4">
                            {[...Array(5)].map((star, i) => (
                                <span
                                    key={i}
                                    onClick={() => setSelectedRating(i + 1)}
                                    className="cursor-pointer"
                                >
                                    {i < selectedRating ? (
                                        <FaStar className="text-yellow-500" />
                                    ) : (
                                        <FaRegStar className="text-gray-400" />
                                    )}
                                </span>
                            ))}
                        </div>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                            rows="4"
                            placeholder="Nhập đánh giá của bạn..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => setShowRatingPopup(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={handleSubmitRating}
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default History;
