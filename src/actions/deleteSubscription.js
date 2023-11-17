import axios from "axios";
import { conf } from '../config';

export const deleteSubscription = async (id, token) => {
    try {
        const response = await axios.delete(`${conf.base_url}/inFrame/deleteSubscription/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.message;
    } catch (e) {
        console.log(e);
        // alert(e.response.data.message);
    }
}