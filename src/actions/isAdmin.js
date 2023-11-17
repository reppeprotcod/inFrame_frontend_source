import axios from "axios";
import { conf } from '../config';

export const isAdmin = async (token) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/isAdmin`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.admin;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}