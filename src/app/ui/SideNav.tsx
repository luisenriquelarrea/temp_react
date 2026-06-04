import { useState, useEffect } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import Image from 'next/image'
import Accordion from '@/app/ui/Accordion';

const SideNav = () => {
    const { removeItem, getItem } = useLocalStorage();

    const [username, setUsername] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logOut = () => {
        removeItem("user");
        window.location.href = "/";
    };

    useEffect(() => {
        try {
            const storedUser = getItem("user");

            if (storedUser) {
                const user = JSON.parse(String(storedUser));
                setUsername(user?.username ?? "");
            }
        } catch (error) {
            console.error("Error reading user from localStorage", error);
        }
    }, [getItem]);

    return (
        <>
            <style>
                {`
                .sidebar-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                }
                .sidebar-user {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-greeting {
                    font-size: 0.8rem;
                    opacity: 0.7;
                }
                .sidebar-logout {
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 1.1rem;
                }
                .my-container {
                    max-height: calc(100dvh - 200px);
                    overflow-y: auto;
                }
                .my-sidebar {
                    width: ${sidebarOpen ? "280px" : "0"};
                    display: ${sidebarOpen ? "block" : "none"};
                    transition: width 0.2s ease;
                }
                .my-main {
                    margin-left: ${sidebarOpen ? "280px" : "0"};
                    transition: margin-left 0.2s ease;
                }
                `}
            </style>

            <div
                className="w3-bar w3-top w3-deep-orange w3-large my-top-bar no-print"
                style={{
                    display: "flex",
                    alignItems: "center",
                }} >
                <button
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="w3-bar-item w3-button w3-hover-none w3-hover-text-light-grey" >
                    <i className="fa fa-bars"></i> Menu
                </button>

                <span
                    style={{
                        flexGrow: 1,
                        textAlign: "center",
                        fontStyle: "italic",
                    }} />

                <span className="w3-bar-item w3-right">
                    ...::: contpp :::...
                </span>
            </div>

            <nav className="no-print w3-sidebar my-sidebar">
                <div className="sidebar-header">
                    <Image
                        src="/logo.png"
                        width={48}
                        height={48}
                        alt="Logo"
                        priority />

                    <div className="sidebar-user">
                        <span className="sidebar-greeting">Bienvenido</span>
                        <strong>{username}</strong>
                    </div>

                    <button
                        type="button"
                        onClick={logOut}
                        className="sidebar-logout"
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión" >
                        <i className="fa fa-power-off" />
                    </button>
                </div>

                <hr />

                <div className="my-container">
                    <Accordion />
                </div>
            </nav>

            <div
                className="w3-overlay w3-hide-large w3-animate-opacity"
                title="close side menu"
                style={{
                    display: sidebarOpen ? "block" : "none",
                }}
                onClick={() => setSidebarOpen(false)} />
        </>
    );
};

export default SideNav;