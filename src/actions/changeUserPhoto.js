import axios from "axios";
import { conf } from '../config';

export const changeUserPhoto = async (form, token) => {
    try {
        const response = await axios.put(`${conf.base_url}/inFrame/changeUserPhoto`, form, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        //alert(response.data.message);
        return response.data.user.user_photo;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}