"use client";

import { useState } from 'react';

const LoginPage = () => {
    const [inputs, setInputs] = useState({});

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(inputs);
    }

    return(
        <div className="container is-fluid">
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
                        <button type="submit" className="button is-success">Login</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;