import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setIsAuthorized(false);
                return;
            }

            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) await refreshToken();
            else setIsAuthorized(true);
        };
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            } else setIsAuthorized(false);
        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) return <div>Loading...</div>;
    return isAuthorized ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
