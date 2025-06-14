import React from "react"
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom"

import Dashboard from "../Dashboard/pages/Dashboard"
import LoginDashboard from "../Dashboard/pages/LoginDashboard"
import RestartPassword from "../Dashboard/pages/RestartPassword"
import RestartPasswordPage2 from "../Dashboard/pages/ResetPasswordPage2"
import RestartPasswordPage3 from "../Dashboard/pages/RestartPasswordPage3"
import AdsPage from "@/Dashboard/pages/Ads/AdsPage"
import FinancialsPage from "@/Dashboard/pages/Financials/FinancialsPage"
import ComplaintsPage from "@/Dashboard/pages/Complaints/ComplaintsPage"
import ReportsPage from "@/Dashboard/pages/Reports/ReportsPage"
import WorkflowPage from "@/Dashboard/pages/WorkFlowPages/WorkflowPage"
import Layout from "@/Layout"
import WorkFlowsecond from "@/Dashboard/pages/WorkFlowPages/WorkFlowsecond"
import Customers from "@/Dashboard/pages/WorkFlowPages/Customers"
import Representatives from "@/Dashboard/pages/WorkFlowPages/Representatives/Representatives"
import JoinRequests from "@/Dashboard/pages/WorkFlowPages/JoinRequests"
import ShowAreas from "@/Dashboard/pages/WorkFlowPages/ShowAreas"
import AddNewArea from "@/Dashboard/pages/WorkFlowPages/AddNewArea"
import RepresentativesPage from "@/Dashboard/pages/WorkFlowPages/Representatives/RepresentativesPage"
import ProhibitedRepresentatives from "@/Dashboard/pages/WorkFlowPages/Representatives/ProhibitedRepresentatives"
import ComplaintsSecondPage from "@/Dashboard/pages/Complaints/ComplaintsSecondPage"
import FinancialsSecondPage from "@/Dashboard/pages/Financials/FinancialsSecondPage"
export const router=createBrowserRouter(
     createRoutesFromElements(
        <>
            <Route path="/" element={<LoginDashboard/>} />
            <Route path="/dashboard/RestartPassword" element={<RestartPassword/>} />
            <Route path="/dashboard/RestartPasswordPage2" element={<RestartPasswordPage2/>} />
            <Route path="/dashboard/RestartPasswordPage3" element={<RestartPasswordPage3/>} />
         <Route path="/" element={<Layout />} >
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/dashboard/AdsPage" element={<AdsPage/>} />
            <Route path="/dashboard/FinancialsPage" element={<FinancialsPage/>} />
            <Route path="/dashboard/FinancialsPage/FinancialsSecondPage" element={<FinancialsSecondPage/>} />
            <Route path="/dashboard/ComplaintsPage" element={<ComplaintsPage/>} />
            <Route path="/dashboard/ComplaintsPage/ComplaintsSecondPage" element={<ComplaintsSecondPage/>} />
            <Route path="/dashboard/ReportsPage" element={<ReportsPage/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond" element={<WorkFlowsecond/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond/Customers" element={<Customers/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond/Representatives" element={<Representatives/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond/Representatives/RepresentativesPage" element={<RepresentativesPage/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond/Representatives/ProhibitedRepresentatives" element={<ProhibitedRepresentatives/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond/JoinRequests" element={<JoinRequests/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond/ShowAreas" element={<ShowAreas/>} />
            <Route path="/dashboard/WorkflowPage/WorkFlowsecond/AddNewArea" element={<AddNewArea/>} />
            <Route path="/dashboard/WorkflowPage" element={<WorkflowPage/>} />
         </Route>
        </>
     )
)