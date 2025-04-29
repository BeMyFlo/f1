import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import bookingApi from '../../api/booking/bookingApi';
import Spinner from '../../components/Spinner';
import { baseUrl } from '../../config/axiosConfig';
import { formatPriceWithPoint } from '../../utils/helper.js';

function DetailHistory() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = location.state || { bookingId: null };

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    
    useEffect(() => {
        if (!bookingId) {
            navigate('/history');
        } else {
            getBookingDetail();
        }
    }, [bookingId]);

    const getBookingDetail = async () => {
        try {
            const response = await bookingApi.detail(bookingId);
            if (response && response.data) {
                setData(response.data);
            } else {
                setError(new Error("Dữ liệu không hợp lệ"));
            }
        } catch (error) {
            setError(error);
        }
    };

    if (error) {
        return <div>Lỗi: {error.message}</div>;
    }

    if (!data) {
        return (
            <div className="mt-80">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center md:mt-24">
            <div className='mt-20 w-full md:w-3/5 md:bg-white flex justify-center items-center md:shadow-md'>
                <div className="md:w-3/5">
                    <div className="flex justify-center md:mt-12">
                        <h1 className="text-3xl md:text-4xl font-bold">Chi tiết Đặt Bàn</h1>
                    </div>
                    <div className="w-full mt-5 flex justify-center items-center md:ml-10">
                        <div className="w-full text-left">
                            <div className="p-4 md:mt-3 md:p-0">
                                <p className="text-md md:text-xl mt-1">
                                    <span className="font-bold md:text-xl">Mã thanh toán: </span>
                                    <span className="text-gray-500 font-bold md:text-xl">{data._id}đ</span>
                                </p>
                                <p className="text-md md:text-lg">
                                    <span className="font-bold">Tên người đặt: </span>
                                    <span className=" text-gray-500">{user.profile.name}</span>
                                </p>
                                <p className="text-md md:text-lg mt-1">
                                    <span className="font-bold">Số điện thoại </span>
                                    <span className="text-gray-500">{user.profile.phone}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Hiển thị chi tiết booking */}
                    <div className="w-full mt-5 flex justify-center items-center">
                        <div className="h-[150px] md:h-[300px] w-11/12 flex shadow-lg rounded-[10px] overflow-hidden">
                            <div className="w-2/5 h-full">
                                <img 
                                    src={data.bar_id.imageUrl}  // Lấy từ data sau khi đã set
                                    alt="Lỗi ảnh" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            
                            <div className="w-3/5 h-full text-left p-5 bg-white">
                                <h1 className="text-xl md:text-2xl font-bold">{data.bar_id.name}</h1>
                                <p className="text-md md:text-lg">Địa chỉ: {data.bar_id.address}</p>
                                <p className="text-md md:text-lg mt-3 text-red-500 cursor-pointer">Xem chi tiết</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-5 flex justify-center items-center">
                        <div className="h-[150px] md:h-[300px] w-11/12 flex rounded-[10px] space-x-4">
                            <div className="w-1/3 h-full bg-red-500 rounded-[10px] flex items-center justify-center">
                                <p className="text-4xl md:text-5xl font-bold text-white">{data.time_play}h</p>
                            </div>
                            
                            <div className="w-2/3 h-full text-left p-5 bg-white rounded-[10px] shadow">
                                <h1 className="text-xl md:text-2xl font-bold">Thời gian sử dụng</h1>
                                <p className="text-lg md:text-xl font-bold text-gray-700">{new Date(data.date).toLocaleDateString('vi-VN')}</p>
                                <p className="text-md md:text-lg text-gray-500">{data.hour}:00 - 15:00</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-5 flex justify-center items-center">
                        <div className="h-auto w-11/12 flex shadow-lg rounded-[10px] overflow-hidden bg-white p-5">
                            <div className="w-full text-left">
                                <h1 className="text-xl md:text-2xl font-bold">Thông tin thanh toán</h1>
                                <div className="mt-3">
                                    <p className="text-md md:text-lg">
                                        <span className="font-bold">Giá gốc: </span>
                                        <span className="line-through text-gray-500">1,000,000đ</span>
                                    </p>
                                    <p className="text-md md:text-lg mt-1">
                                        <span className="font-bold">Giá giảm: </span>
                                        <span className="text-green-600">200,000đ</span>
                                    </p>
                                    <p className="text-md md:text-lg mt-1">
                                        <span className="font-bold">Giá thanh toán: </span>
                                        <span className="text-black font-bold">{formatPriceWithPoint(data.price)}đ</span>
                                    </p>
                                    <p className="text-md md:text-lg mt-3">
                                        <span className="font-bold">Trạng thái thanh toán: </span>
                                        <span className="text-blue-500 font-bold">Đã thanh toán</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mã QR cho xác nhận booking */}
                    {/* Tạm thời để vậy nhưng sau này sẽ chuyển tới trang admin sau đó mới gọi api này để đổi status */}
                    <div className="w-full mt-10 flex justify-center items-center md:mb-10">
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl md:text-2xl font-bold mb-4">Quét mã QR để xác nhận booking</h2>
                                <QRCodeCanvas
                                    value={`${baseUrl}/api/booking/update-status?id=${bookingId}&status=2&redirect=false`}
                                    size={150}
                                    level="H"
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailHistory;
