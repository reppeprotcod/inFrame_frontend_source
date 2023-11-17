import axios from "axios";
import { conf } from '../config';

export const getPost = async (id, token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getPost/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.post;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}