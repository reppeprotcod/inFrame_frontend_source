import axios from "axios";
import { conf } from '../config';

export const getRepostsNotifications = async (token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getRepostsNotifications`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.repostsNotifications;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}