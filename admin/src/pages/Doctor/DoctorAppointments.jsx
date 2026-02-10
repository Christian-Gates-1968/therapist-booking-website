import React, { useState, useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";
import PrescriptionModal from "../../components/PrescriptionModal";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleSavePrescription = (appointmentId, prescription) => {
    completeAppointment(appointmentId, prescription);
    handleCloseModal();
  };

  useEffect(() => {
    getAppointments();
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium text-fuchsia-800">
        All Appointments
      </p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] text-fuchsia-700 gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {[...appointments].reverse().map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-fuchsia-600 py-3 px-6 border-b hover:bg-fuchsia-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image}
                className="w-8 rounded-full"
                alt=""
              />{" "}
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <div className="flex flex-col items-end gap-1">
                <p className="text-green-500 text-xs font-medium">Completed</p>
                {item.prescription && (
                  <button
                    onClick={() => {
                      setSelectedAppointment(item);
                      setShowViewModal(true);
                    }}
                    className="text-xs text-primary underline hover:text-primary/70"
                  >
                    View Prescription
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                  <img
                    onClick={() => handleOpenModal(item)}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt=""
                  />
                </div>
                {item.payment && (
                  <button
                    onClick={() => navigate(`/video-call/${item._id}`)}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-all flex items-center justify-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Call
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <PrescriptionModal
          appointmentId={selectedAppointment._id}
          onSave={handleSavePrescription}
          onCancel={handleCloseModal}
        />
      )}

      {/* View-Only Prescription Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl border border-fuchsia-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-fuchsia-900">Prescription</h2>
              <button
                onClick={() => { setShowViewModal(false); setSelectedAppointment(null); }}
                className="text-gray-400 hover:text-fuchsia-700 text-2xl leading-none"
              >&times;</button>
            </div>
            <p className="text-sm text-fuchsia-600 mb-3">Patient: {selectedAppointment.userData.name}</p>
            <hr className="border-fuchsia-100 mb-4" />
            <div className="bg-fuchsia-50 p-4 rounded-lg text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedAppointment.prescription}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => { setShowViewModal(false); setSelectedAppointment(null); }}
                className="py-2 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;