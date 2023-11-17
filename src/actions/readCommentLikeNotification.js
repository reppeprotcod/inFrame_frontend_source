import axios from 'axios';
import { conf } from '../config';

export const readCommentLikeNotification = async (notifId, token) => {
    try {
        const response = await axios.put(
            `${conf.base_url}/inFrame/readCommentLikeNotification`,
            { notif_com_like_id: notifId },
            { headers: { "Authorization": `Bearer ${token}` } },
        );
        return response.data;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}