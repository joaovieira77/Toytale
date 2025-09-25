# 🧸 Toytale — Toy & Book Exchange Platform

Toytale is a full-stack web application that allows families to exchange toys and children's books through donation, trade, or sale. It promotes sustainability, community connection, and joyful reuse — giving preloved items a second life in new hands.

> 🏆 This project was developed and won 1st place at the **10th Bytes4Future 24-hour Hackathon**.

---
## 👥 Project Members

| Name   | Role                        | GitHub Username                          |
|--------|-----------------------------|-------------------------------------------|
| João   | Backend & Frontend          | [@joaovieira77](https://github.com/joaovieira77) |
| Hania  | Frontend                    | [@HaniaA4](https://github.com/HaniaA4)           |
| Arwa   | Frontend                    | [@arwaaziz32](https://github.com/arwaaziz32)     |
| Marcus | Design                      | —                                         |

## 🌍 Overview

Toytale consists of two main components:

- **Frontend**: Built with React, offering a clean, responsive, and user-friendly interface.
- **Backend**: Built with Node.js and Express, connected to MongoDB using the native driver. RESTful API endpoints handle item listings, user profiles, and messaging.

---

## ⚙️ Tech Stack

| Layer        | Technology                            |
|--------------|----------------------------------------|
| Frontend     | React, React Router, Tailwind CSS      |
| Backend      | Node.js, Express, MongoDB              |
| Styling      | Tailwind CSS                           |
| API Testing  | Insomnia                               |

---

## 🧩 Core Features

### 📦 Item Listings

- Add toys or books with title, description, age range, condition, and photo
- Choose exchange mode: donation, trade, or sale (with price)
- Upload and preview item images via Base64 encoding

### 👤 User Profiles

- View seller information including name, location, and profile image
- Navigate to seller profiles and contact them directly

### 💬 Messaging

- Send and receive messages between users
- View conversations and chat history

### 🛠️ Item Management

- Edit or delete items if you're the owner
- Toggle item availability

---

## 🗄️ Database Collections

- `users` — User profiles and preferences  
- `items` — Toys and books listed for exchange  
- `messages` — Direct messages between users  
- `conversations` — Conversation metadata  

---

