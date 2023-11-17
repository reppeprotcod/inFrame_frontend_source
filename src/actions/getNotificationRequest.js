import axios from "axios";
import { conf } from '../config';

export const getNotificationRequest = async (userId, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getNotificationRequest/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.status;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}