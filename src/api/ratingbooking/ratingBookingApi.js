import { publicClient, privateClient } from '../../config/axiosConfig';
import ratingBookingEndpoints from './ratingBookingEndpoints';

const ratingBookingApi = {
  getRatingBookingByBarId: async (barId) => {
    try {
      const url = ratingBookingEndpoints.getRatingBookingByBarId.replace(':barId', barId);
      const response = await publicClient.get(url, { barId });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  }
};

export default ratingBookingApi;