"use client"

import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SideNav from '@/app/ui/dashboard/SideNav';
import Header from '@/app/ui/dashboard/Header';
 
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
                <Header />
                <SideNav />
                <div className="w3-main my-main" >
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