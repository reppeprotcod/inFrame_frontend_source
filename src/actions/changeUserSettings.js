import axios from "axios";
import { conf } from '../config';

export const changeUserSettings = async (theme, private_profile, token) => {
    try {
        const response = await axios.put(`${conf.base_url}/inFrame/userSettings`, {
            theme,
            private_profile
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.userSettings;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}