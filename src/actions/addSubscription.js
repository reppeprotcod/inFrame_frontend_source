import axios from "axios";
import { conf } from '../config';

export const addSubscription = async (userId, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/addSubscription/${userId}`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.subscription;
    } catch (e) {
        console.log(e);
        // alert(e.response.data.message);
    }
}