# TheLostGemCart 🛒

**TheLostGemCart** is a modern e-commerce web application built with **Node.js**, **Express**, and **MongoDB**. It provides a full-featured shopping experience with product browsing, cart management, and demo checkout functionality.  

This project is designed as a demo e-commerce store to showcase full-stack development practices.

---

## Features ✨

- Browse products with **search**, **category filtering**, **price range filtering**, and **sorting**
- View **single product details**
- Manage **shopping cart**:
  - Add items
  - Update quantities
  - Remove items
  - Clear cart
- **Demo checkout** (does not process real payments)
- **User authentication**:
  - Signup
  - Login
  - Logout
  - Protected profile route
- **API health check** for easy backend monitoring
- Serve frontend HTML pages (login, signup, main store page)

---

## Tech Stack 🛠️

- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Session Management:** `express-session`
- **Frontend:** HTML, CSS, static files served from Express
- **Others:** CORS, cookie-parser, dotenv

---

## Installation & Setup ⚡

1. **Clone the repository**
```bash
git clone https://github.com/imshiku21/TheLostGemCart.git
cd TheLostGemCart


#Install Depedency 
npm install

# .env file 

PORT=3000
SESSION_SECRET=yourSecretHere
MONGO_URI=yourMongoDBConnectionString
NODE_ENV=development

# run the server 

npm start

# The server will be available at:

http://localhost:3000

