import React from "react"
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom"

import Dashboard from "../Dashboard/pages/Dashboard"
import LoginDashboard from "../Dashboard/pages/LoginDashboard"
import RestartPassword from "../Dashboard/pages/RestartPassword"
import RestartPasswordPage2 from "../Dashboard/pages/ResetPasswordPage2"
import RestartPasswordPage3 from "../Dashboard/pages/RestartPasswordPage3"
export const router=createBrowserRouter(
     createRoutesFromElements(
        <>
         <Route  >

            <Route path="/" element={<Dashboard/>} />
            <Route path="/dashboard/LoginDashboard" element={<LoginDashboard/>} />
            <Route path="/dashboard/RestartPassword" element={<RestartPassword/>} />
            <Route path="/dashboard/RestartPasswordPage2" element={<RestartPasswordPage2/>} />
            <Route path="/dashboard/RestartPasswordPage3" element={<RestartPasswordPage3/>} />

         </Route>
        </>
     )
)