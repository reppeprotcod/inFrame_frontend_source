import { useCallback, useState } from "react"


export const useAuth = () => {
    const [token, setToken] = useState(null);

    const login = useCallback((t) => {
        setToken(t);

        localStorage.setItem("userToken", JSON.stringify({
            t
        }));
        //console.log(JSON.parse(localStorage.getItem("userToken")));//ОДИН ТУТ
    }, []);

    const logout = useCallback(() => {
        setToken(null);

        localStorage.removeItem("userToken");
    }, []);

    const data = JSON.parse(localStorage.getItem("userToken"));
    if(data && data.t && !token){
        login(data.t);
    }

    return {
        login, token,
        logout
    }
}
