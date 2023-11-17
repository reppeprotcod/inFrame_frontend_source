import axios from 'axios';
import { conf } from '../config';

export const likeExisting = async (postId, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/likeExisting/${postId}`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        //alert(response.data.message);
        return response.data.isLikeExisting;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}