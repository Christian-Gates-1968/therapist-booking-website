import React from "react";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PrescriptionModal from "../components/PrescriptionModal";

const MyAppointments = () => {
  const navigate = useNavigate();
  const { backendUrl, token, getDoctorsData, userData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserNotifications = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/consultation/notifications",
        { userId: userData._id },
        { headers: { token } }
      );
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelScheduledConsultation = async (notificationId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/consultation/cancel-scheduled",
        { notificationId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserNotifications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/my-appointments");
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Function to make payment using razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  useEffect(() => {
    if (token && userData) {
      getUserNotifications();
    }
  }, [token, userData]);

  return (
    <div>
      {/* Scheduled Consultations Section */}
      {notifications.length > 0 && (
        <div className="mb-8">
          <p className="pb-3 mt-12 font-medium text-blue-600 border-b">
            Scheduled Consultations
          </p>
          <div className="space-y-3 mt-4">
            {notifications.filter(n => n.type === 'consultation-scheduled').map((notif, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    Consultation Scheduled
                  </p>
                  <p className="text-sm text-blue-700 mt-1">{notif.message}</p>
                  {notif.scheduledDate && notif.scheduledTime && (
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      📅 {notif.scheduledDate} at {notif.scheduledTime}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => cancelScheduledConsultation(notif._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors"
                  title="Cancel this scheduled consultation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Appointments Section */}
      <p className=" pb-3 mt-12 font-medium text-fuchsia-600 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-b-primary"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt="doctor image"
              />
            </div>
            <div className="flex-1 text-sm text-fuchsia-600">
              <p className="text-fuchsia-900 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-fuchsia-900 font-medium mt-1">Address:</p>
              <p className="text-xs text-fuchsia-600">
                {item.docData.address.line1}
              </p>
              <p className="text-xs text-fuchsia-600">
                {item.docData.address?.line2}
              </p>
              <p className="text-sm mt-1">
                <span className="text-sm text-fuchsia-900 font-medium">
                  Date and Time
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}{" "}
              </p>
              {item.isCompleted && item.prescription && (
                <div className="mt-2">
                  <button
                    onClick={() => setSelectedPrescription(item)}
                    className="flex items-center gap-1.5 text-xs font-medium text-white bg-primary px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Prescription
                  </button>
                </div>
              )}
            </div>

            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <>
                  <button className="sm:min-w-48 py-2 border rounded text-fuchsia-600  bg-[#EAEFFF]">
                    Paid
                  </button>
                  <button
                    onClick={() => navigate(`/video-call/${item._id}`)}
                    className="sm:min-w-48 py-2 border rounded text-white bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Video Call
                  </button>
                </>
              )}

              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="text-sm text-fuchsia-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-fuchsia-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}
              {item.isCompleted && (
                <button className=" sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  {" "}
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prescription View Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription.prescription}
          doctorName={selectedPrescription.docData.name}
          appointmentDate={slotDateFormat(selectedPrescription.slotDate) + " | " + selectedPrescription.slotTime}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
};

export default MyAppointments;
