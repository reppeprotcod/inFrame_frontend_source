import axios from "axios";
import { conf } from '../config';

export const addComLike = async (id, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/addComLike/${id}`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        //alert(response.data.message);
        return response.data.like;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}