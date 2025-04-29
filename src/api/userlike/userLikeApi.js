import { publicClient, privateClient } from '../../config/axiosConfig';
import userLikeEndpoints from './userLikeEndpoints';

const userLikeApi = {
  like: async (id) => {
    try {
      const url = userLikeEndpoints.like.replace(':id', id);
      const response = await privateClient.post(url, { id });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
  unlike: async (id) => {
    try {
      const url = userLikeEndpoints.unlike.replace(':id', id);
      const response = await privateClient.post(url, { id });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
};

export default userLikeApi;