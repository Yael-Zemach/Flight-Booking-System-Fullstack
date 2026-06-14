import { createContext, useContext, useState } from "react";
import { login as apiLogin, register as apiRegister } from "../API/authAPI.js";
import { UI_MESSAGES } from "../constants/messages.js";
const AuthContext = createContext(null);


export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {


    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    function updateLocalUser(updatedFields) {
        setUser(prevUser => {
            const newUser = { ...prevUser, ...updatedFields };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    }

    async function login(email, password) {
        try {

            const result = await apiLogin({ email, password });


            const myUser = {
                name: result.user.name,
                email: result.user.email,

                userType: result.user.userType
            };


            setUser(myUser);


            localStorage.setItem("user", JSON.stringify(myUser));
            localStorage.setItem("token", result.token);


            return { ok: true, userType: myUser.userType, msg: result.message };
        } catch (err) {
            return { ok: false, msg: err.message };
        }
    }


    async function register(name, email, password) {
        try {
            const result = await apiRegister({ name, email, password });

            const myUser = {
                name: result.user.name,
                email: result.user.email,
                userType: "CUSTOMER"
            };

            setUser(myUser);
            localStorage.setItem("user", JSON.stringify(myUser));
            localStorage.setItem("token", result.token);

            return { ok: true, userType: myUser.userType, msg: result.message || UI_MESSAGES.auth.registrationSuccess };
        } catch (err) {
            return { ok: false, msg: err.message };
        }
    }


    function logout() {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }


    const value = { user, login, logout, register   , updateLocalUser };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}