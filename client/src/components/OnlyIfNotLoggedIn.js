import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { KEY_ACCESS_TOKEN } from "../utils/localStorageManager";
import { getItem } from "../utils/localStorageManager";
function OnlyIfNotLoggedIn() {
     const user = getItem(KEY_ACCESS_TOKEN);
     
  return (
        user ? <Navigate to="/" /> : <Outlet/>
  )
}

export default OnlyIfNotLoggedIn