import axios from "axios";
import { conf } from '../config';

export const getUserSettings = async (userId, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getUserSettings/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.userSettings;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}