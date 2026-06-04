"use client";

import React, { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { getUser } from '@/app/utils/api'
import MessageBox from '@/app/ui/MessageBox';
import Image from 'next/image'
import { MessageBoxT } from '@/app/utils/types';

const LoginPage = () => {
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
    const [messageData, setMessageData] = useState<MessageBoxT>({});
    
    const { login } = useAuth();
    const { getItem, removeItem } = useLocalStorage();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if(buttonDisabled){
            console.log("Waiting for task...");
            return;
        }
        setButtonDisabled(true);

        if (!inputs.username || !inputs.password) {
            setButtonDisabled(false);

            setMessageData({
                messageType: "danger",
                message: "Ingresa un usuario y contraseña."
            });
            setShowMessageBox(true);
            return;
        }

        try {
            const response = await getUser(inputs);
            if (!response.ok) {
                setButtonDisabled(false);

                setMessageData({
                    messageType: "danger",
                    message: "Acceso denegado."
                });
                setShowMessageBox(true);
                return;
            }

            const data = await response.json();
            
            setMessageData({
                messageType: "success",
                message: "Acceso permitido..."
            });

            setShowMessageBox(true);

            login(data);

            let location = "/dashboard";

            const redirect =
                getItem("redirectAfterLogin");

            if (redirect) {
                removeItem("redirectAfterLogin");
                location = `/dashboard/${redirect}/`;
            }

            setTimeout(() => {
                window.location.href = location;
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <style>
            {`
                .login-wrapper {
                    min-height: 100dvh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f6fa;
                    padding: 1rem;
                }

                .login-card {
                    width: 100%;
                    max-width: 420px;
                    padding: 1.5rem;
                }

                .login-logo {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }

                @media (max-width: 768px) {
                    .login-card {
                        padding: 1rem;
                        border-radius: 12px;
                    }

                    .login-logo img {
                        width: 90px !important;
                        height: 90px !important;
                    }

                    .label {
                        font-size: 0.95rem;
                    }

                    .input {
                        height: 48px;
                        font-size: 16px; /* prevents iOS zoom */
                    }

                    .button {
                        height: 48px;
                        font-size: 1rem;
                    }
                }

                .login-card .input:focus {
                    border-color: #3273dc;
                    box-shadow: 0 0 0 1px #3273dc;
                }
            `}
            </style>
            <section className="login-wrapper">
                <div className="login-card box">

                    <div className="has-text-centered mb-5">
                        <Image
                            src="/logo.png"
                            width={120}
                            height={120}
                            alt="Logo"
                            priority
                        />
                    </div>

                    {showMessageBox && <MessageBox data={messageData} />}

                    <form onSubmit={handleSubmit}>

                        <div className="field">
                            <label className="label">Usuario</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="username"
                                    value={inputs.username}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu usuario"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Contraseña</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    name="password"
                                    value={inputs.password}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu contraseña"
                                />
                            </div>
                        </div>

                        <div className="field mt-5">
                            <div className="control">
                                <button disabled={ buttonDisabled } className="button is-fullwidth w3-light-gray">
                                    Entrar
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </section>
        </>
    );
};

export default LoginPage;