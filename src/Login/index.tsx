import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logIn } from "../firebase";

const Login = () => {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/welcome");
        }
    }, [user, navigate]);

    return (
        <>
            <h1>Login with Google!</h1>
            {
                loading ? (
                    <p>Loading...</p>
                ) : (
                    <button onClick={() => logIn()} type='button'>Login</button>
                )
            }
            {
                error && (
                    <p>Error: {error.message}</p>
                )
            }
        </>
    )
}

export default Login;
