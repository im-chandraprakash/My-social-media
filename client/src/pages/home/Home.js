import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getMyInfo } from "../../redux/slices/appConfigSlice";

function Home() {

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getMyInfo());
    },[]);
  
   return <>
    <Navbar/>
    <div className="outlet" style={{margintop:"60px"}}>
        <Outlet/> 
    </div>
   </>
}

export default Home;
