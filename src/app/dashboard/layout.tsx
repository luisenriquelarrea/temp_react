"use client";
import { useState, useEffect } from "react";
import SideNav from '@/app/ui/dashboard/SideNav';
import { useAuth } from '../hooks/useAuth';
import { User } from "../hooks/useUser";
 
const Layout = ({ children }: { children: React.ReactNode }) => {
  let user: any = [];
  useEffect(() => {
    //Runs only on the first render
    const { getItem } = useAuth();
    user = getItem("user");
  }, []);
  //const { getItem } = useAuth();
  console.log(user);
  return (
    <div className="columns">
        <div className="column is-one-quarter no-print">
            <SideNav />
        </div>
        <div className="column">
            {children}
        </div>
    </div>
  );
}

export default Layout;