import axios from 'axios';
import { conf } from '../config';

export const registration = async (form) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/registration`, form);
        alert(response.data.message);
        return response.data;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}