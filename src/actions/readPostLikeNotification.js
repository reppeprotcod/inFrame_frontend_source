import axios from 'axios';
import { conf } from '../config';

export const readPostLikeNotification = async (notifId, token) => {
    try {
        const response = await axios.put(
            `${conf.base_url}/inFrame/readPostLikeNotification`,
            { notif_like_id: notifId },
            { headers: { "Authorization": `Bearer ${token}` } },
        );
        return response.data;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}