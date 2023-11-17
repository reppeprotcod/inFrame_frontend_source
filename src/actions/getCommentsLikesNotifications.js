import axios from "axios";
import { conf } from '../config';

export const getCommentsLikesNotifications = async (token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getCommentsLikesNotifications`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.commentsLikesNotifications;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}