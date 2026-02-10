import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contacts from './pages/Contacts'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import VideoRoom from './pages/VideoRoom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Privacy from './pages/Privacy'
import Medicines from './pages/Medicines'
import MedicineDetail from './pages/MedicineDetail'
import Cart from './pages/Cart'
import ScrollToTop from './components/ScrollToTop'
import { ToastContainer, toast } from 'react-toastify';
import { useContext, useEffect } from 'react';
import { ThemeContext } from './context/ThemeContext'
import { ChatbotContext } from './context/ChatbotContext';
import FloatingChatbot from './components/FloatingChatbot';
import ChatWindow from './components/ChatWindow';



const App = () => {

 const {theme} = useContext(ThemeContext);
   const { isChatOpen } = useContext(ChatbotContext);


  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ScrollToTop />
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contacts />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/video-call/:appointmentId' element={<VideoRoom />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/medicines' element={<Medicines />} />
        <Route path='/medicine/:medId' element={<MedicineDetail />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>

      <Footer/>
      <FloatingChatbot />
      {isChatOpen && <ChatWindow />}
    </div>
  )
}

export default App