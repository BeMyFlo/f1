import { publicClient, privateClient } from '../../config/axiosConfig';
import cityEndpoints from './cityEndpoints';

const cityApi = {
  getCity: async () => {
    try {
      const response = await publicClient.get(cityEndpoints.getCity);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
  getDistrict: async () => {
    try {
      const response = await publicClient.get(cityEndpoints.getDistrict);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  }
};

export default cityApi;