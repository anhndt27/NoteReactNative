import axios from "axios"
import baseUrl from "./api"
export interface INodeListWithGroup {
  id: number;
  title: string;
  category: string;
  dateTime: Date
}

export interface INoteList {
  category: string;
  data: {
    id: number;
    title: string;
    dateTime: Date;
    category: string;
  }[];
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

export const searchNoteList = async (
  token: string,
  userId: string,
  groupId: number | null = null,
  filter: string = '',
  orderby: string = ''
): Promise<INoteList> => {
  try {
    if (!token || !userId){
      return {
        category: '',
        data: [],
      };
    }  
    const response = await axios.get(`${baseUrl}/Note/Search`, {
      params: {
        userId,
        groupId,
        filter,
        orderby
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data as INoteList;
  } catch (e) {
    console.error('Error fetching note list:', e);
    return {
      category: '',
      data: [],
    };
  }
};

export const createNote = async(token: string, data: any) =>  {
  try {
    const response = await axios.post(`${baseUrl}/Note/Create`, data, {
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

export const updateNote = async(token: string, id: number, data: any) => {
  try {
    const response = await axios.put(`${baseUrl}/Note/Update?id=${id}`, data, {
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

export const getNote = async(token: string, id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/Note/Get?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch {
    return {error: true}
  }
}

export const deleteNote = async(token: string, id: number) => {
  try {
    const response = await axios.delete(`${baseUrl}/Note/Delete?id=${id}`, {
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


export const updateCategory = async(token: string, id: number, data: any) => {
  try {
    const response = await axios.put(`${baseUrl}/Note/UpdateCategory?id=${id}`, data, {
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

