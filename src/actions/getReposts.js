import axios from "axios";
import { useContext } from "react";
import { conf } from '../config';
import AuthContext from "../contexts/AuthContext";

export const getReposts = async (token, userId) => {
    try {
        const response = await axios.get(`${conf.base_url}/inFrame/getReposts/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.reposts;
    } catch (e) {
        console.log(e);
        alert(e.response.data.message);
    }
}