import { publicClient, privateClient } from '../../config/axiosConfig';
import discountEndpoints from './discountEndpoints';

const discountApi = {
  getListDiscountByBarId: async (id) => {
    try {
      const url = discountEndpoints.getListDiscountByBarId.replace(":barId", id);
      const response = await publicClient.get(url, { id });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed");
    }
  },
};

export default discountApi;