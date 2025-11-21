import { useState, useEffect } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import Image from 'next/image'
import Accordion from '@/app/ui/Accordion';

const SideNav = () => {
    const { removeItem } = useLocalStorage();
    const { getItem } = useLocalStorage();
    const [username, setUsername] = useState("");

    // Get the Sidebar
    var mySidebar = document.getElementById("mySidebar");
    var myMain = document.getElementById("myMain");

    // Get the DIV with overlay effect
    var overlayBg = document.getElementById("myOverlay");

    const logOut = () => {
        removeItem("user");
        window.location.href = '/';
    }

    // Toggle between showing and hiding the sidebar, and add overlay effect
    const w3Open = () => {
        if (mySidebar!.style.display === 'block')
            w3Close();
        else{
            mySidebar!.style.width = '280px';
            myMain!.style.marginLeft = '280px';
            mySidebar!.style.display = 'block';
            overlayBg!.style.display = "block";
        }
    }

    // Close the sidebar with the close button
    const w3Close = () => {
        mySidebar!.style.width = '0';
        myMain!.style.marginLeft = '0';
        mySidebar!.style.display = "none";
        overlayBg!.style.display = "none";
    }

    useEffect(() => {
        const user = JSON.parse(String(getItem("user")));
        setUsername(user.username);
    }, []);

    return (
        <>
            <div className="w3-bar w3-top w3-deep-orange w3-large my-top-bar no-print">
                <button
                    onClick={ w3Open } 
                    className="w3-bar-item w3-button w3-hover-none w3-hover-text-light-grey">
                    <i className="fa fa-bars"></i> Menu
                </button>
                <span className="w3-bar-item w3-right">Logistica</span>
            </div>
            <nav className="no-print w3-sidebar my-sidebar" id="mySidebar">
                <div className="w3-container w3-row">
                    <div className="w3-col s3">
                        <Image 
                            src="/logo.png" 
                            width={40}
                            height={60} 
                            alt="Logo"
                            loading="eager" 
                            priority={true} />
                    </div>
                    <div className="w3-col s9 w3-bar">
                        <span>Bienvenido, <strong>{ username }</strong></span><br/>
                        <a href="#" className="w3-bar-item w3-button"><i className="fa fa-envelope"></i></a>
                        <a href="#" className="w3-bar-item w3-button"><i className="fa fa-user"></i></a>
                        <a href="#" onClick={logOut} className="w3-bar-item w3-button"><i className="fa fa-power-off"></i></a>
                    </div>
                </div>
                <hr></hr>
                <div className="w3-bar-block">
                    <Accordion />
                </div>
            </nav>

            <div className="w3-overlay w3-hide-large w3-animate-opacity" onClick={ w3Close } title="close side menu" id="myOverlay"></div>
        </>
    );
};

export default SideNav;