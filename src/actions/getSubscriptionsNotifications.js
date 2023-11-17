import axios from "axios";
import { conf } from '../config';

export const getSubscriptionsNotifications = async (token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getSubscriptionsNotifications`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.subscriptionsNotifications;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}