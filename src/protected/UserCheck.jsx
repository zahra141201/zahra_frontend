import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function UserCheck(){
    const {token} = useContext(AuthContext);
    const {msg, setMsg} = useState("");
    const config = {
        'method' : 'get',
        'url': `${URL_BACK}/scope-example/protecteduser`,
        'headers': {
            'Authorization': `Bearer ${token}`
        }
    };
    useEffect(()=> {
        axios(config).then((response) => {
            console.log("Enviaste un token bueno y estas logueado");
            console.log(response);
            setMsg(response.data.message);
        }).catch((error) => {
            console.log("hubo un error, no estas logueado o el token expiro");
            console.log(error);
            setMsg(error.message);
        })
    }, [])
    return (
        <h1>{msg}</h1>
    )
}

export default UserCheck;