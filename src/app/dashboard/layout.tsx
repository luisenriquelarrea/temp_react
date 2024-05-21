"use client";
import { useState, useEffect } from "react";
import SideNav from '@/app/ui/dashboard/SideNav';
import { useLocalStorage } from "../hooks/useLocalStorage";
 
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { getItem } = useLocalStorage();
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    //Runs only on the first render
    setUser(JSON.parse(String(getItem("user"))));
  }, []);
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