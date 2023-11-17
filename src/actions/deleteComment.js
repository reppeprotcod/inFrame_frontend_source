import axios from "axios";
import { conf } from '../config';

export const deleteComment = async (id, token) => {
    try {
        const response = await axios.delete(`${conf.base_url}/inFrame/deleteComment/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        //alert(response.data.message);
        return response.data.message;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}