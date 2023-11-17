import axios from "axios";
import { conf } from '../config';

export const getPostsLikesNotifications = async (token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getPostsLikesNotifications`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.postsLikesNotifications;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}