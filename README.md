# **Therapy Co — AI-Powered Therapy & Appointment Platform** 🧠💙

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,tailwind,docker,figma" />
</p>

<p align="center">
  <b>The Therapy Co. Core</b><br>
  <i>Advanced Mental Health Orchestration</i>
</p>

<div align="center">

| **Intelligence** | **Streaming** | **Deployment** |
| :--- | :--- | :--- |
| Gemini 1.5 Pro | WebRTC / Socket.io | Docker & CI/CD |
| Natural Language Triage | Real-time Consultation | Cloudinary Asset Management |

</div>
A **production-ready, full-stack healthcare platform** for booking therapy appointments with real-time video consultations, AI assistance, and comprehensive patient management.

## **🚀 Key Features**

✅ **AI Chatbot** - Gemini-powered assistant for patient queries  
✅ **Video Consultations** - WebRTC-based real-time therapy sessions  
✅ **Smart Scheduling** - Instant or scheduled appointments  
✅ **Digital Prescriptions** - Secure prescription management  
✅ **Online Pharmacy** - Medicines store with shopping cart  
✅ **Email Reminders** - Automated notifications 12 hours before appointments  
✅ **Payment Integration** - Razorpay payment gateway  
✅ **Admin Dashboard** - Comprehensive management panel  
✅ **Mobile Responsive** - Works seamlessly on all devices  
✅ **Docker Ready** - Complete containerization support  

---


## **🛠 Tech Stack**

**Frontend:** React 18 + Vite • Tailwind CSS • Socket.io • WebRTC  
**Backend:** Node.js + Express • MongoDB • JWT • Nodemailer  
**Integrations:** Google Gemini AI • Razorpay • Cloudinary  

---


## **📸 Screenshots & Features**

### **🏠 Homepage & Landing**
![Homepage](screenshots/homepage.png)
*Modern responsive landing page with hero section, speciality menu, and top doctors*

### **🤖 AI Chatbot Assistant**
<p align="center">
  <img src="screenshots/chatbot-conversation.png" alt="AI Chatbot" width="500"/>
</p>

*Gemini-powered AI chatbot assists patients with queries and facilitates instant consultation requests*

### **📹 Real-Time Video Consultations**

**Incoming Consultation Request**

![Incoming Request](screenshots/incoming-call-req.png)

*Doctors can accept instantly, decline, or schedule for later*

### **🗓️ Appointment Management**

> Patients can view appointments, join video calls, and see scheduled consultations with date/time

### **📋 Digital Prescriptions**

**Prescription View**

![View Prescription](screenshots/view-prescription.png)

*Secure digital prescriptions - doctors issue, patients view anytime*

### **💊 Online Pharmacy Store**

**Medicines Listing**

![Pharmacy Store](screenshots/pharmacy-store.png)

*Browse psychological medicines with search and category filters*

*Individual medicine pages with detailed information, usage instructions, and side effects. Integrated shopping cart for easy checkout.*

### **👨‍⚕️ Admin Dashboard**

![Admin Dashboard](screenshots/admin-dashboard.png)

*Manage appointments, doctors, and view analytics*

### **📧 Email Reminders**

![Email Reminder](screenshots/email-reminder.png)

*Automated reminders sent 12 hours before appointments*

---

## **�🗂 Project Structure Overview**

```
therapy-co/
│
├── frontend/        # User SPA
│   ├── src/
│   │   ├── App.jsx
│   │   ├── context/
│   │   │   ├── AppContext.jsx
│   │   │   ├── CartContext.jsx      # Shopping cart state
│   │   │   ├── ChatbotContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Appointment.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   ├── Medicines.jsx        # Pharmacy store
│   │   │   ├── MedicineDetail.jsx   # Individual medicine page
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   └── VideoRoom.jsx        # Video consultation
│   │   └── assets/
│   │       └── assets_frontend/
│   │           └── medicineData.js  # Pharmacy inventory
│   └── vite.config.js
│
├── admin/           # Admin & Doctor portal
│   ├── src/
│   │   ├── App.jsx
│   │   ├── context/
│   │   ├── components/
│   │   │   └── PrescriptionModal.jsx
│   │   └── pages/
│   │       └── Doctor/
│   │           ├── DoctorDashboard.jsx
│   │           ├── DoctorAppointments.jsx
│   │           └── VideoRoom.jsx
│   └── vite.config.js
│
├── backend/
│   ├── server.js
│   ├── config/
│   │   ├── mongodb.js
│   │   ├── cloudinary.js
│   │   └── emailConfig.js           # SMTP transporter
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── doctorController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── userRoute.js
│   │   ├── doctorRoute.js
│   │   ├── adminRoute.js
│   │   ├── consultationRoute.js     # Video call signaling
│   │   └── chatbotRoute.js
│   ├── jobs/
│   │   └── reminderService.js       # 12-hour advance email reminders
│   ├── models/
│   │   ├── doctorModel.js
│   │   └── appointmentModel.js
│   ├── manual-email-trigger.js      # Manual reminder trigger
│   └── test-email-sending.js        # Email testing script
```

---

## **🔐 Environment Variables**

### **Backend → `/backend/.env`**

Required:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@therapyco.com
ADMIN_PASSWORD=StrongAdminPassword123

CLOUDINARY_NAME='xxxx'
CLOUDINARY_API_KEY='xxxx'
CLOUDINARY_SECRET_KEY='xxxx'

RAZORPAY_KEY_ID='rzp_test_xxx'
RAZORPAY_KEY_SECRET='rzp_secret_xxx'

GEMINI_API_KEY='optional_key'

CURRENCY=INR

# Email Service (for appointment reminders)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

> **Note:** For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) (requires 2FA enabled).


```

### **Frontend → `/frontend/.env`**

```
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID='rzp_test_xxx'
VITE_ADMIN_URL=http://localhost:5174
VITE_CURRENCY=$
```

### **Admin → `/admin/.env`**

```
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=$
```

---

## **☁️ Deployment**

**⚠️ This app won't work on Vercel** (requires persistent server for WebSockets & cron jobs)

**✅ Recommended platforms:**
- **[Railway.app](https://railway.app)** - Auto-detects Docker, easiest
- **[Render.com](https://render.com)** - Free tier available
- **DigitalOcean/AWS** - VPS with Docker ($6/mo)

📖 **[Complete Deployment Guide →](DEPLOYMENT-GUIDE.md)**

**Quick Docker deployment on VPS:**
```bash
sudo bash deploy.sh
```

---

## **🚀 Local Development Setup**

Open **three terminals**—one for each service.

### **Backend**

```sh
cd backend
npm install
npm run dev
```

### **Frontend (User)**

```sh
cd frontend
npm install
npm run dev
```

### **Admin Portal**

```sh
cd admin
npm install
npm run dev
```

### **Default Ports**

* Frontend: **5173**
* Admin: **5174**
* Backend: **4000**

---

## **📌 Important Code Entry Points**

### **Backend**

* Server bootstrap → `backend/server.js`
* MongoDB config → `backend/config/mongodb.js`
* Cloudinary config → `backend/config/cloudinary.js`
* Email config → `backend/config/emailConfig.js`
* User controllers → `backend/controllers/userController.js`
* Doctor controllers → `backend/controllers/doctorController.js`
* Admin controllers → `backend/controllers/adminController.js`
* Email reminder job → `backend/jobs/reminderService.js`

### **Frontend**

* Context & API setup → `frontend/src/context/AppContext.jsx`
* Cart state → `frontend/src/context/CartContext.jsx`
* Booking page → `frontend/src/pages/Appointment.jsx`
* My appointments → `frontend/src/pages/MyAppointments.jsx`
* Medicines store → `frontend/src/pages/Medicines.jsx`
* Shopping cart → `frontend/src/pages/Cart.jsx`
* Video room → `frontend/src/pages/VideoRoom.jsx`

### **Admin**

* Admin context → `admin/src/context/AdminContext.jsx`
* Doctor context → `admin/src/context/DoctorContext.jsx`
* Prescription modal → `admin/src/components/PrescriptionModal.jsx`

---

## **💊 Medicines / Pharmacy Store**

The frontend includes a full pharmacy module:

* Browse medicines with search and category filters
* Individual medicine pages with descriptions, dosage info, side effects
* Shopping cart with quantity management
* Prescription requirement badges (Rx)
* Checkout flow with order summary

**Key files:**
* `frontend/src/pages/Medicines.jsx` — Store listing
* `frontend/src/pages/MedicineDetail.jsx` — Product page
* `frontend/src/pages/Cart.jsx` — Shopping cart
* `frontend/src/context/CartContext.jsx` — Cart state (persisted to localStorage)
* `frontend/src/assets/assets_frontend/medicineData.js` — Medicine inventory

---

## **📧 Email Reminder Service**

Automated appointment reminders sent 12 hours before each appointment.

**How it works:**
1. `node-cron` runs an hourly job to check upcoming appointments
2. Finds appointments scheduled for 12-13 hours from now
3. Sends styled HTML emails via Nodemailer/SMTP
4. Marks appointments as `reminderSent: true` to avoid duplicates

**Manual trigger:**
```bash
cd backend
node manual-email-trigger.js
```

**Test with dummy data:**
```bash
cd backend
node test-email-sending.js
```

**Key files:**
* `backend/config/emailConfig.js` — SMTP transporter
* `backend/jobs/reminderService.js` — Cron job + email logic

> **Vercel Note:** The cron job won't work on serverless platforms. Use Vercel Cron Jobs or an external service like cron-job.org to hit an API endpoint.

---

## **📹 Video Consultations**

Real-time video calls between patients and doctors using WebRTC.

* Socket.io for signaling
* Simple-peer for WebRTC connections
* Separate video rooms for each appointment

**Key files:**
* `frontend/src/pages/VideoRoom.jsx`
* `admin/src/pages/Doctor/VideoRoom.jsx`
* `backend/routes/consultationRoute.js`

---

## **💳 Payments & Uploads**

* Razorpay payment flow implemented in `userController.js`
* Cloudinary upload integration in `cloudinary.js`

---

## **� Prescription System**

Doctors can issue prescriptions when completing appointments:

1. Doctor clicks "Complete" on an appointment
2. PrescriptionModal opens to enter medication details
3. Prescription saved to appointment record
4. Patient can view prescription in "My Appointments"

**Key files:**
* `admin/src/components/PrescriptionModal.jsx`
* `frontend/src/components/PrescriptionModal.jsx` (read-only viewer)
* `backend/models/appointmentModel.js` — prescription field

---

## **🐋 Docker Support**

Each service includes a production-ready `Dockerfile`:

* `frontend/Dockerfile`
* `admin/Dockerfile`
* `backend/Dockerfile`

Optional: combine with a `docker-compose.yml` for multi-service deployments.

---

## **🚀 Quick Start**

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install

# Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Run services (in separate terminals)
cd backend && npm run dev
cd frontend && npm run dev
cd admin && npm run dev
```

**Docker:** `docker-compose up -d`

---

## **📝 License**

MIT License - See full license text in repository.

---

<p align="center">
  Made with ❤️ for accessible mental healthcare
</p>

<p align="center">
  <strong>Therapy Co</strong> - Connecting patients with care 🧠💙
</p>

