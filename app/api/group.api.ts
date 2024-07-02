import axios from 'axios';
import baseUrl from './api';

export const getGroupCode = async (token: string, groupId: number) => {
  try {
    if (!token || !groupId) return;

    const response = await axios.get(`${baseUrl}/Group/Get?id=${groupId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (e) {
    return;
  }
};

export const submitGroupCode = async(token: string, data: any) =>  {
  try {
    const response = await axios.put(`${baseUrl}/Group/Join`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return response.data;
  }
  catch (e) {
    return {error: true}
  }
}

export const outGroup = async(token: string, data: any) =>  {
  try {
    const response = await axios.put(`${baseUrl}/Group/Out`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return response.data;
  }
  catch (e) {
    return {error: true}
  }
}

export const createGroup = async(token: string, data: any) =>  {
  try {
    const response = await axios.post(`${baseUrl}/Group/Create`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return response.data;
  }
  catch (e) {
    return {error: true}
  }
}