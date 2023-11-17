import axios from 'axios';
import { conf } from '../config';

export const readRepostNotification = async (notifId, token) => {
    try {
        const response = await axios.put(
            `${conf.base_url}/inFrame/readRepostNotification`,
            { notif_repost_id: notifId },
            { headers: { "Authorization": `Bearer ${token}` } },
        );
        return response.data;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}