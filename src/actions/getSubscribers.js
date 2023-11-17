import axios from "axios";
import { conf } from '../config';

export const getSubscribers = async (userId, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getSubscribers/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.subscribers;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}