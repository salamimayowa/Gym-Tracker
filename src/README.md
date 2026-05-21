# 🏋️‍♂️ GymTracker Application

A simple Java Spring Boot application to help gym members book, manage, and track their workout sessions securely and efficiently.



 📖 Overview

**GymTracker** allows users to:
- Book gym sessions.
- Edit or cancel existing bookings.
- View available session slots.
- Receive email confirmations for bookings.
- Scan a dynamically generated QR code at the gym to mark attendance.
- Enforce booking rules like:
    - No concurrent back-to-back sessions.
    - Maximum of 2 sessions per day.

Admin can:
- View session bookings.
- Access a secured, hourly-changing QR code via an admin-only endpoint.
- Send booking reminders to users.

---

## 📦 Technologies Used

- Java 21
- Spring Boot
- Spring Security (JWT Authentication)
- Spring Data JPA (Hibernate)
- MySQL
- Maven
- QR Code Generator (ZXing)
- Scheduled Tasks
- Email Service (JavaMailSender)
- HTML email templates

---

## 📸 Features

- **User Registration & Login**
- **Session Booking**
- **Edit & Update Bookings**
- **Delete Session**
- **Dynamic QR Code Generation**
- **Hourly QR Code Scheduler**
- **Email Notifications**
- **Admin Management Endpoints**

---

## 🚀 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gymtracker.git
