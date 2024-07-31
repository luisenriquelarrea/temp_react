"use client"

import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SideNav from '@/app/ui/dashboard/SideNav';
 
const Layout = ({ children }: { children: React.ReactNode }) => {
    const { getItem } = useLocalStorage();
    const [isAuth, setIsAuth] = useState(false);
    
    useEffect(() => {
      if(getItem("user") === null){
          window.location.href = '/';
      }
      setIsAuth(true);
    }, []);

    const isAuthRender = () => {
        return (
            <div>
                <SideNav />
                <div className="w3-main my-main" id="myMain" >
                    {children}
                </div>
            </div>
        );
    }
    
    return (
        <>
            {
                Boolean(isAuth) ? isAuthRender() : null
            }
        </>
    );
}

export default Layout;