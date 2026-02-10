import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets_admin/assets'
import { AppContext } from '../../context/AppContext'
import PrescriptionModal from '../../components/PrescriptionModal'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedAppointment(null)
  }

  const handleSavePrescription = (appointmentId, prescription) => {
    completeAppointment(appointmentId, prescription)
    handleCloseModal()
    getDashData()
  }


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-fuchsia-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-fuchsia-600'>{currency} {dashData.earnings}</p>
            <p className='text-fuchsia-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-fuchsia-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-fuchsia-600'>{dashData.appointments}</p>
            <p className='text-fuchsia-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-fuchsia-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-fuchsia-600'>{dashData.patients}</p>
            <p className='text-fuchsia-400'>Patients</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img className="w-4 h-4" src={assets.list_icon} alt="" />
          <p className='font-semibold text-fuchsia-900'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-fuchsia-100' key={index}>
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-fuchsia-800 font-medium'>{item.userData.name}</p>
                <p className='text-fuchsia-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => handleOpenModal(item)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <PrescriptionModal
          appointmentId={selectedAppointment._id}
          onSave={handleSavePrescription}
          onCancel={handleCloseModal}
        />
      )}

    </div>
  )
}

export default DoctorDashboard