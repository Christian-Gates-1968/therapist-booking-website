import React from 'react'
import Login from './pages/Login'
import { useContext } from 'react'
import {AdminContext} from './context/AdminContext' 
import {DoctorContext} from './context/DoctorContext' 

import { ToastContainer, toast } from 'react-toastify';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import RequestOverlay from './components/RequestOverlay'
import {Route,Routes} from 'react-router-dom'

import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import VideoRoom from './pages/Doctor/VideoRoom'
import { ThemeContext } from './context/ThemeContext'
import { useEffect } from 'react';


const App = () => {

  const{aToken} = useContext(AdminContext)
  const{dToken, consultationRequest, acceptConsultation, declineConsultation, scheduleConsultation, profileData} = useContext(DoctorContext)
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
          <Route path="/video-call/:appointmentId" element={<VideoRoom />} />

        </Routes>
      </div>
      
      {/* Show RequestOverlay when there's an incoming consultation request */}
      {dToken && consultationRequest && profileData && (
        <RequestOverlay
          request={consultationRequest}
          onAccept={acceptConsultation}
          onDecline={declineConsultation}
          onSchedule={scheduleConsultation}
          doctorId={profileData._id}
        />
      )}
    </div>
  ) : (
    <>
    <Login />
    <ToastContainer/>
    </>
    
  )
}

export default App