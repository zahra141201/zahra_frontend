import React, { useContext, useState } from "react";
import './LogInForm.css'
import { AuthContext } from "../../auth/AuthContext";


const LogoutButton = () => {
    const {logout} = useContext(AuthContext);
    const [msg, setMsg] = useState("");

    const handleLogout = () => {
        logout();
        setMsg("Has hecho logout con exito");

    }
    return (
        <>
        {msg.length>0 && <div className="succesMsg"> {msg} </div>}
        <button onClick={handleLogout}>
            cerrar sesion
        </button>
        </>
    );
}

export default LogoutButton;