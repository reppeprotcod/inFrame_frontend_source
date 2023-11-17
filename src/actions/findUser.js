import axios from 'axios';
import { conf } from '../config';

export const findUser = async (username, token) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/findUser`, {username}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.users;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}