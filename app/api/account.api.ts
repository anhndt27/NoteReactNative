import axios from "axios"
import baseUrl from "./api"

export const userInformation = async (token: string, userId: string) => {
    try {
        const userInfor = await axios.get(`${baseUrl}/User/${userId}`,  {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        return userInfor.data;
    } catch (e) {
        return {error: true, msg: (e as any).response.data.msg };
    }
}