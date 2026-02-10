# **Therapy Co — Full-Stack Clinic & Appointment Booking Platform**

A production-ready **React + Next-Gen Vite Frontend + Node/Express Backend** application for booking appointments with therapists and doctors.

Includes:

* User-facing booking site
* Admin/Doctor management portal
* Secure Node/Express backend
* Token-based auth, role separation
* Cloudinary uploads, Razorpay payments
* AI chatbot (Gemini)
* **Prescription management system**
* **Online pharmacy/medicines store with cart**
* **Email reminder service for appointments (12 hours before)**
* **Real-time video consultations (WebRTC)**
* Fully dockerized services

Built with clean architecture, reusable React Contexts, REST APIs, and modern tooling (Vite + Tailwind).

---

## **✨ Highlights**

### **Frontend (User Site – React + Vite)**

* SPA built with React + Vite
* Context-driven state management
* Doctor listings, appointment booking, payments
* **Medicines store with cart functionality**
* **View prescriptions from completed appointments**
* **Video call integration for remote consultations**
* Tailwind CSS design system
* Entry: `frontend/src/App.jsx`
* Vite config: `frontend/vite.config.js`

### **Admin / Doctor Portal (React + Vite)**

* Role-based dashboard for doctors & admins
* Manage appointments, schedules, doctor profiles
* **Issue prescriptions upon appointment completion**
* **Video consultation room for doctors**
* Entry: `admin/src/App.jsx`

### **Backend (Node + Express + MongoDB)**

* REST API with authentication
* JSON Web Tokens (JWT)
* Payment integration (Razorpay)
* Image uploads (Cloudinary)
* **Email reminder service (Nodemailer + node-cron)**
* **WebRTC signaling via Socket.io**
* Optional chatbot route (Gemini API)
* Entry: `backend/server.js`

---

## **🗂 Project Structure Overview**

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
# Clone the repo
git clone https://github.com/your-username/therapy-co.git
cd therapy-co

# Install dependencies for all services
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd admin && npm install && cd ..

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start all services (in separate terminals)
cd backend && npm run dev
cd frontend && npm run dev
cd admin && npm run dev
```

---

## **🌐 Production Deployment**

### **Environment Variables for Production:**

**Backend:**
- Update `FRONTEND_URL` in `.env` with your production frontend URLs (comma-separated)
- Update `MONGODB_URI` with your production MongoDB connection string
- Update all API keys (Cloudinary, Razorpay, etc.)
- Update SMTP credentials for email service

**Frontend/Admin:**
- Update `VITE_BACKEND_URL` with your production backend URL

### **Important Notes:**
- The email reminder cron job requires a persistent server (won't work on serverless platforms like Vercel)
- For serverless deployments, use external cron services to trigger `/api/send-reminders` endpoint
- Make sure to set proper CORS origins in production
- Use environment-specific MongoDB databases
- Enable SSL/TLS in production

### **Docker Deployment:**
```bash
docker-compose up -d
```

---

## **📄 License**

MIT License — feel free to use and modify for your projects.




