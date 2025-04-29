import { useState, useEffect } from 'react';

export function formatPrice(price) {
    if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K';
    }
    return price;
}

export function formatPriceWithPoint(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Bán kính Trái Đất tính bằng km
  const dLat = toRad(lat2 - lat1); // Tính chênh lệch vĩ độ
  const dLon = toRad(lon2 - lon1); // Tính chênh lệch kinh độ

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return parseFloat(distance.toFixed(1)); // Trả về khoảng cách làm tròn 1 chữ số sau dấu thập phân
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Component tính khoảng cách từ người dùng đến địa điểm
export function DistanceFromUser({ x, y }) {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          const kmDistance = calculateDistance(userLat, userLon, x, y);
          setDistance(kmDistance);  // Cập nhật khoảng cách vào state
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [x, y]);

  if (distance === null) {
    return <span>Đang tải...</span>; // Hoặc bạn có thể trả về "Loading..." trong lúc chưa có khoảng cách
  }

  return <span>{distance} km</span>;
}
