import React from "react"
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom"

import Dashboard from "../Dashboard/pages/Dashboard"
import LoginDashboard from "../Dashboard/pages/LoginDashboard"
import RestartPassword from "../Dashboard/pages/RestartPassword"
import RestartPasswordPage2 from "../Dashboard/pages/ResetPasswordPage2"
import RestartPasswordPage3 from "../Dashboard/pages/RestartPasswordPage3"
import AdsPage from "@/Dashboard/pages/AdsPage"
import FinancialsPage from "@/Dashboard/pages/FinancialsPage"
import ComplaintsPage from "@/Dashboard/pages/ComplaintsPage"
import ReportsPage from "@/Dashboard/pages/ReportsPage"
import WorkflowPage from "@/Dashboard/pages/WorkflowPage"
import Layout from "@/Layout"
export const router=createBrowserRouter(
     createRoutesFromElements(
        <>
         <Route path="/" element={<Layout />} >

            <Route path="/Login" element={<LoginDashboard/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/dashboard/AdsPage" element={<AdsPage/>} />
            <Route path="/dashboard/FinancialsPage" element={<FinancialsPage/>} />
            <Route path="/dashboard/ComplaintsPage" element={<ComplaintsPage/>} />
            <Route path="/dashboard/ReportsPage" element={<ReportsPage/>} />
            <Route path="/dashboard/WorkflowPage" element={<WorkflowPage/>} />
            <Route path="/dashboard/RestartPassword" element={<RestartPassword/>} />
            <Route path="/dashboard/RestartPasswordPage2" element={<RestartPasswordPage2/>} />
            <Route path="/dashboard/RestartPasswordPage3" element={<RestartPasswordPage3/>} />

         </Route>
        </>
     )
)