import axios from "axios"
import baseUrl from "./api"
export interface INodeListWithGroup {
  id: number;
  title: string;
  category: string;
  dataTime: string
}

export const getNodeListWithoutGroup = async (token: string, userId: string): Promise<INodeListWithGroup[]> => {
  try {
    if (!token || !userId) return [];

    const response = await axios.get(`${baseUrl}/Note/GetList?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (e) {
    return [];
  }
};

export const getNoteListWithGroup = async (token: string, userId: string, groupId: number): Promise<INodeListWithGroup[]> => {
  try {
    if (!token || !userId) return [];

    const response = await axios.get(`${baseUrl}/Note/GetList?userId=${userId}&groupId=${groupId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (e) {
    return [];
  }
};