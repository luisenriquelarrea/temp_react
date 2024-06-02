"use client";

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUser } from '../api'

const LoginPage = () => {
    const [inputs, setInputs] = useState({
        name: "", 
        password: ""
    });
    const { login } = useAuth();

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if(String(inputs.name).length === 0 || String(inputs.password).length === 0)
        {
            console.log('inputs required');
            return;
        }
        getUser(inputs).then(response => {
            if(!response.ok){
                console.log("Bad credentials!");
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
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            name="name" 
                            value={ inputs.name || "" }
                            onChange={ handleChange }
                            placeholder="username" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="password" 
                            name="password"
                            value={ inputs.password || "" } 
                            onChange={ handleChange }
                            placeholder="Password" />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button type="submit" className="button is-info is-fullwidth">Login</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;