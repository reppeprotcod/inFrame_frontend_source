import axios from "axios";
import { conf } from '../config';

export const getCommentsNotifications = async (token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getCommentsNotifications`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.commentsNotifications;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}