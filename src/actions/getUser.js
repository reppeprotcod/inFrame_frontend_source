import axios from "axios";
import { conf } from '../config';

export const getUser = async (userId, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getUser/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.user;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}