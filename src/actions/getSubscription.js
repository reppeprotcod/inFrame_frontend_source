import axios from "axios";
import { conf } from '../config';

export const getSubscription = async (userId, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getSubscription/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.subscription;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}