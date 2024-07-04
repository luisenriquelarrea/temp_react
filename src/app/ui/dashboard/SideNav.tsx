import { useState, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import DropDown from '@/app/ui/dashboard/DropDown';

const SideNav = () => {
    const { removeItem } = useLocalStorage();
    const { getItem } = useLocalStorage();
    const [username, setUsername] = useState("");

    const logOut = () => {
        removeItem("user");
        window.location.href = '/';
    }

    useEffect(() => {
        const user = JSON.parse(String(getItem("user")));
        setUsername(user.username);
    }, []);

    return (
        <nav className="w3-sidebar w3-collapse w3-white my-sidebar">
            <div className="w3-container w3-row">
                <div className="w3-col s4">
                    <i className="fa fa-users w3-xxxlarge"></i>
                </div>
                <div className="w3-col s8 w3-bar">
                    <span>Welcome, <strong>{ username }</strong></span><br/>
                    <a href="#" className="w3-bar-item w3-button"><i className="fa fa-envelope"></i></a>
                    <a href="#" className="w3-bar-item w3-button"><i className="fa fa-user"></i></a>
                    <a href="#" onClick={logOut} className="w3-bar-item w3-button"><i className="fa fa-power-off"></i></a>
                </div>
            </div>
            <hr></hr>
            <div className="w3-bar-block">
                <DropDown />
            </div>
        </nav>
    );
};

export default SideNav;