import axios from "axios";
import { conf } from '../config';

export const getSubscriptions = async (userId, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getSubscriptions/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.subscriptions;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}