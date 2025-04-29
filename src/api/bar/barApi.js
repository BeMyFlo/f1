import { publicClient, privateClient } from '../../config/axiosConfig';
import barEndpoints from './barEndpoints';

const barApi = {
  getBarById: async (id) => {
    try {
      const url = barEndpoints.getBarById.replace(':id', id);
      const response = await publicClient.get(url, { id });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
  getListBar: async (userId) => {
    try {
      let url = barEndpoints.getBar;
      if (userId) {
        url += `?userId=${userId}`;
      }
      const response = await publicClient.get(url);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
  getListBarByCity: async (userId, filter) => {
    try {
      let url = barEndpoints.getBarByFilter;
      if (userId) {
        url += `?userId=${userId}`;
      }
      const response = await publicClient.post(url, filter);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
  getBarTopRating: async () => {
    try {
      const response = await publicClient.get(barEndpoints.getBarTopRating);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
  getTablesByHour: async (barId, date, hour) => {
    try {
      const response = await publicClient.post(barEndpoints.getTablesByHour, { barId, date, hour });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  }
};

export default barApi;