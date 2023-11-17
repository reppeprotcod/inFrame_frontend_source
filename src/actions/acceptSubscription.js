import axios from "axios";
import { conf } from '../config';

export const acceptSubscription = async (id, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/acceptSubscription/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.message;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}