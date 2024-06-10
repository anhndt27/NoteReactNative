import axios from "axios"
import baseUrl from "./api"
export interface INodeListWithoutGroup {
  id: number;
  title: string;
}

export const getNodeListWithoutGroup = async (token: string, userId: string): Promise<INodeListWithoutGroup[]> => {
  try {
    if (!token || !userId) return [];

    const response = await axios.get(`${baseUrl}/Note/GetList?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('nodeList: ', response.data);
    return response.data;
  } catch (e) {
    return [];
  }
};