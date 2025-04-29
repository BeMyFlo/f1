import { publicClient, privateClient } from '../../config/axiosConfig';
import bookingEndpoints from './bookingEndpoints';

const bookingApi = {
    create: async (paymentData) => {
        try {
        const response = await privateClient.post(bookingEndpoints.create, paymentData);
        return response.data;
        } catch (err) {
        throw new Error(err.response?.data?.message || "Booking failed");
        }
    },
    history: async () => {
        try {
        const response = await privateClient.get(bookingEndpoints.history);
        return response.data;
        } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to fetch booking history");
        }
    },
    detail: async (bookingId) => {
        try {
        const response = await privateClient.get(bookingEndpoints.detail.replace(":id", bookingId));
        return response.data;
        } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to fetch booking detail");
        }
    },
    ratingBooking: async (ratingData) => {
        try {
        const response = await privateClient.post(bookingEndpoints.ratingBooking, ratingData);
        return response.data;
        } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to rate booking");
        }
    }
};

export default bookingApi;