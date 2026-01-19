import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    // Axios interceptor to add token
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (currentUser?.accessToken) {
                    config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for refreshing token
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error.config;
                if (error.response?.status === 403 && !prevRequest._retry) {
                    prevRequest._retry = true;
                    try {
                        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });
                        setCurrentUser((prev) => ({ ...prev, accessToken: res.data.accessToken }));
                        prevRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                        return axios(prevRequest);
                    } catch (err) {
                        logout();
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [currentUser]);

    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
            setCurrentUser(null);
            localStorage.removeItem("user");
            toast.success("Logout Successful");
        } catch (err) {
            console.log(err);
            toast.error("Logout Failed");
        }
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
