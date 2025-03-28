import React from "react"
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom"
import Start from "../Pages/Start"
import Home from "../Pages/Home"
import SignUpRider1 from "../Pages/SignUpRider1"
import SignDriver1 from "../Pages/SignDrivar1"
import HomeRider from "../Pages/HomeRider"
import SignUp from "../Pages/SignUp"
import Login from "../Pages/Login"
import Booking from "../Pages/Booking"
import SelectDriver from "../Pages/SelectDriver"
import OtpPage from "../Pages/OtpPage"
import HomeDriver from "../Pages/HomeDriver"
import TrackOrder from "../Pages/TrackOrder"
import Chats from "../Pages/Chats"
export const router=createBrowserRouter(
     createRoutesFromElements(
        <>
         <Route>
            <Route path="/home" element={<Home/>} />
            <Route path="/" element={<Start/>} />
            <Route path="/SignUpRider1" element={<SignUpRider1/>} />
            <Route path="/SignDriver1" element={<SignDriver1/>} />
            <Route path="/HomeRider" element={<HomeRider/>} />
            <Route path="/Booking" element={<Booking/>} />
            <Route path="/SelectDriver" element={<SelectDriver/>} />
            <Route path="/HomeDriver" element={<HomeDriver/>} />
            <Route path="/TrackOrder" element={<TrackOrder/>} />
            <Route path="/Chats" element={<Chats/>} />
            <Route path="/Login" element={<Login/>} />
            <Route path="/SignUp" element={<SignUp/>} />
            <Route path="/OtpPage" element={<OtpPage/>} />
         </Route>
        </>
     )
)