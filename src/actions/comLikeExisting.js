import axios from 'axios';
import { conf } from '../config';

export const comLikeExisting = async (comId, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/comLikeExisting/${comId}`, {}, {
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