import axios from "axios";
import { conf } from '../config';

export const getUserPhoto = async (token, userId ) => {
    try {
            const response = await axios.get(`${conf.base_url}/inFrame/getUser/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data.user.user_photo;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}