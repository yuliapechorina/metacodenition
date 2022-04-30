import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logOut } from "../firebase";

const Welcome = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <>
            <h1>Welcome, {user?.displayName}!</h1>
            <img src={user?.photoURL === null ? undefined : user?.photoURL} alt="Profile" />
            <ul>
                <li>Email: {user?.email}</li>
                <li>Verified: {user?.emailVerified}</li>
                <li>Name: {user?.displayName}</li>
                <li>uid: {user?.uid}</li>
            </ul>
            <button onClick={() => logOut()} type='button'>Logout</button>
        </>
    )
}

export default Welcome;
