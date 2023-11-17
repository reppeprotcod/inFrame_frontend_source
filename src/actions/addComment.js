import axios from "axios";
import { conf } from '../config';

export const addComment = async (postId, text, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/addComment/${postId}`, {
            text
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.comment;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}