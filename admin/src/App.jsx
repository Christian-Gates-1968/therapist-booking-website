import React from 'react'
import Login from './pages/Login'
import { useContext } from 'react'
import {AdminContext} from './context/AdminContext' 
import {DoctorContext} from './context/DoctorContext' 

import { ToastContainer, toast } from 'react-toastify';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Route,Routes} from 'react-router-dom'

import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import { ThemeContext } from './context/ThemeContext'
import { useEffect } from 'react';


const App = () => {

  const{aToken} = useContext(AdminContext)
  const{dToken} = useContext(DoctorContext)
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return aToken || dToken ? (
    <div  >
      <ToastContainer/>
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes >

        {/* Admin Routes */}

          <Route path='/' element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />

        {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
    <Login />
    <ToastContainer/>
    </>
    
  )
}

export default App