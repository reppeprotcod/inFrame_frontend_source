import axios from 'axios';
import { conf } from '../config';

export const chechUserName = async (username) => {
    try {
        const response = await axios.post(`${conf.base_url}/inFrame/checkUserName`, {username});
        //alert(response.data.message);
        return response.data.availableName;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}