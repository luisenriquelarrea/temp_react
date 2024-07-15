"use client";

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUser } from '../api'
import MessageBox from '../ui/dashboard/MessageBox';
import Image from 'next/image'

const LoginPage = () => {
    const [inputs, setInputs] = useState({
        username: "", 
        password: ""
    });
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageData, setMessageData] = useState({
        messageType: "",
        message: ""
    });
    const { login } = useAuth();

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if(String(inputs.username).length === 0 || String(inputs.password).length === 0)
        {
            setMessageData({
                messageType: "danger",
                message: "Ingresa un usuario y contraseña."
            });
            setShowMessageBox(true);
            return;
        }
        getUser(inputs).then(response => {
            if(!response.ok){
                setMessageData({
                    messageType: "danger",
                    message: "Las credenciales ingresadas no son válidas."
                });
                setShowMessageBox(true);
                console.log(response);
                return;
            }
            response.json().then(data => {
                login(data)
                window.location.href = '/dashboard';
            })
        }).catch(error => console.error(error));
    }

    return(
        <div className="my-login">
            <Image 
                src="/logo.png" 
                width={100}
                height={200} 
                alt="Logo"
                loading="eager" 
                priority={true}
                style={{"marginBottom": "15px"}} />
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            name="username" 
                            value={ inputs.username || "" }
                            onChange={ handleChange }
                            placeholder="usuario" />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <input 
                            className="input" 
                            type="password" 
                            name="password"
                            value={ inputs.password || "" } 
                            onChange={ handleChange }
                            placeholder="contraseña" />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button type="submit" className="button is-fullwidth">Entrar</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;