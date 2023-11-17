import axios from 'axios';
import { conf } from '../config';

export const login = async (form) => {
    const {username, password} = form;

    try {
        const response = await axios.post(`${conf.base_url}/inFrame/login`, {
            username,
            password
        });
        //alert(response.data.token);
        return response.data.token;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}

export default login;