import { createContext } from "react";

const AuthContext = createContext({
    login: () => {},
    logout: () => {},
    token: null
});

export default AuthContext;