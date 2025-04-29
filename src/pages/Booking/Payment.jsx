import React, { useState } from 'react';
import Slider from "../../components/Slider.js";
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutConfirmation from '../../components/Popup/CheckoutConfirm.js';
import bookingApi from '../../api/booking/bookingApi.js';
import Spinner from '../../components/Spinner.js';
import DiscountPopup from '../../components/Popup/DiscountPopup.js';
import { MdDiscount } from "react-icons/md";
import { BsPersonVcard } from "react-icons/bs";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { barId, tables, imageUrl, date, hour, price, time_play } = location.state || { barId: null, tables: [], imageUrl: null, date: null, hour: null, price: null, time_play: null };
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDiscountPopupOpen, setIsDiscountPopupOpen] = useState(false);
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);

    const paymentMethods = [
        { id: 1, name: 'cash' },
        { id: 2, name: 'momo' },
        { id: 3, name: 'bank' },
    ];

    const handlePayment = () => {
        const paymentMethod = getPaymentMethod(selectedPaymentMethod);
        
        const paymentData = {
          barId,
          tableId: tables,
          date: date,
          hour: hour,
          discount: selectedDiscountId,
          price: price,
          payment_method: paymentMethod,
          time_play: time_play,
        };

        console.log(paymentData);

        setIsLoading(true);
        
        bookingApi.create(paymentData)
          .then(response => {
              setIsPopupOpen(true);
          })
          .catch(error => {
              alert('Có lỗi xảy ra khi tạo booking.');
          })
          .finally(() => {
              setIsLoading(false);
          });
    };

    const getPaymentMethod = (method) => {
        const paymentMethod = paymentMethods.find((item) => item.name === method);
        return paymentMethod ? paymentMethod.id : null;
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };

    const openDiscountPopup = () => {
        setIsDiscountPopupOpen(true);
    };

    const handleSelectDiscount = (discountId) => {
        setSelectedDiscountId(discountId);
    };

    return (
        <div>
            {isPopupOpen && <CheckoutConfirmation />}
            
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Spinner />
                </div>
            )}
            
            <div className='mt-36 text-3xl font-bold font-sans'>
                <h1>Thông tin đặt bàn</h1>
            </div>
            <Slider img={imageUrl} /> 
            <div className="flex justify-center mt-20 w-full">
                <div className='flex flex-col gap-2 w-full items-center'>
                    {/* First Block with Icon */}
                    <div 
                        className='w-4/5 h-[50px] rounded-[5px] md:w-[850px] md:h-[100px] md:rounded-[10px] flex shadow-md border border-gray-200'
                        onClick={openDiscountPopup}
                    >
                        <div className='w-2/12 flex items-center justify-center px-5'>
                            {/* Icon Placeholder - replace with desired icon */}
                            <MdDiscount className='md:text-5xl text-2xl text-blue-500'/>
                            {/* <i className="fas fa-gift text-2xl md:text-3xl text-blue-500"></i>  */}
                        </div>
                        <div className='w-10/12 h-full rounded-l-[40px] flex items-center justify-start cursor-pointer'>
                            <div className='h-3/4 w-3/4 flex flex-col items-start justify-center px-5 gap-4'>
                                <div className='text-left'>
                                    <p className="font-bold md:text-2xl">Mã giảm giá</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Second Block with Icon */}
                    <div className='w-4/5 h-[50px] rounded-[5px] md:w-[850px] md:h-[100px] md:rounded-[10px] flex shadow-md border border-gray-200'>
                        <div className='w-2/12 flex items-center justify-center px-5'>
                            {/* Icon Placeholder - replace with desired icon */}
                            <BsPersonVcard className='md:text-5xl text-2xl text-red-500'/>
                        </div>
                        <div className='w-full h-full rounded-l-[40px] flex items-center justify-start cursor-pointer'>
                            <div className='h-3/4 w-full flex flex-col items-start justify-center px-5 gap-4'>
                                <div className='text-left'>
                                    <p className="font-bold md:text-2xl">BPool Card</p>
                                    <p className="text-gray-400 md:text-base text-xs">Sử dụng thẻ thành viên BPool</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DiscountPopup 
              barId={barId} 
              isOpen={isDiscountPopupOpen} 
              onClose={() => setIsDiscountPopupOpen(false)}
              onSelectDiscount={handleSelectDiscount}
            />
            <div className="flex justify-center mt-10 md:mt-20 px-16">
                <fieldset className="w-[550px]">
                    <legend className="sr-only">Checkboxes</legend>

                    <div className="space-y-2">
                    {/* Thanh toán tại chỗ */}
                    <label
                        htmlFor="Option1"
                        onClick={() => handlePaymentMethodChange('cash')}
                        className={`flex items-center gap-2 rounded-lg border p-4 transition cursor-pointer hover:bg-gray-50 shadow-md ${
                        selectedPaymentMethod === 'cash' ? 'border-blue-500' : 'border-gray-200'
                        }`}
                    >
                        <input
                        type="radio"
                        className="h-5 w-5 rounded border-gray-300"
                        id="Option1"
                        checked={selectedPaymentMethod === 'cash'}
                        onChange={() => handlePaymentMethodChange('cash')}
                        />
                        <div className="flex items-start flex-col ml-3">
                        <strong className="font-medium text-gray-900 text-sm md:text-base">Thanh toán tại chỗ</strong>
                        <p className="mt-1 text-xs text-gray-700 leading-tight text-left md:text-sm">
                            Bàn sẽ bị huỷ nếu bạn đến trễ hơn 15 phút.
                        </p>
                        </div>
                    </label>

                    {/* Momo */}
                    <label
                        htmlFor="Option2"
                        onClick={() => handlePaymentMethodChange('momo')}
                        className={`flex items-center gap-2 rounded-lg border p-4 transition cursor-pointer hover:bg-gray-50 shadow-md ${
                        selectedPaymentMethod === 'momo' ? 'border-blue-500' : 'border-gray-200'
                        }`}
                    >
                        <input
                        type="radio"
                        className="h-5 w-5 rounded border-gray-300"
                        id="Option2"
                        checked={selectedPaymentMethod === 'momo'}
                        onChange={() => handlePaymentMethodChange('momo')}
                        />
                        <div className="flex items-start flex-col ml-3">
                        <strong className="font-medium text-gray-900 text-sm md:text-base">Momo</strong>
                        <p className="mt-1 md:text-sm text-xs text-gray-700 leading-tight">Giảm 15%</p>
                        </div>
                    </label>

                    {/* Chuyển khoản ngân hàng */}
                    <label
                        htmlFor="Option3"
                        onClick={() => handlePaymentMethodChange('bank')}
                        className={`flex items-center gap-2 rounded-lg border p-4 transition cursor-pointer hover:bg-gray-50 shadow-md ${
                        selectedPaymentMethod === 'bank' ? 'border-blue-500' : 'border-gray-200'
                        }`}
                    >
                        <input
                        type="radio"
                        className="h-5 w-5 rounded border-gray-300"
                        id="Option3"
                        checked={selectedPaymentMethod === 'bank'}
                        onChange={() => handlePaymentMethodChange('bank')}
                        />
                        <div className="flex items-start flex-col ml-3">
                        <strong className="font-medium text-gray-900 text-sm md:text-base">Chuyển khoản ngân hàng</strong>
                        <p className="mt-1 md:text-sm text-xs text-gray-700 leading-tight">Giảm 15%</p>
                        </div>
                    </label>
                    </div>
                </fieldset>
            </div>


            <div onClick={handlePayment} className={`md:mt-20 mt-10 flex justify-center`}>
                <div className="h-[40px] w-[150px] text-lg rounded-[10px] md:h-[78px] md:w-[298px] bg-red-500 flex items-center justify-center md:rounded-[20px] md:text-4xl cursor-pointer text-white shadow-md">
                    <p>Đặt bàn</p>
                </div>
            </div>
        </div>
    );
}

export default Payment;
