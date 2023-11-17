import axios from "axios";
import { conf } from '../config';

export const addRepost = async (postId, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/addRepost/${postId}`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        alert('репост сделан');
        return response.data.repost;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}