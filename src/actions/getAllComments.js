import axios from "axios";
import { conf } from '../config';

export const getAllComments = async (postId, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getAllComments/${postId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.comments;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}