import axios from "axios";
import { conf } from '../config';

export const createPost = async (form, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/createPost`, form, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        alert(response.data.message);
        return response.data;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}