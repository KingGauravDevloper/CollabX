# CollabX

CollabX is a **real-time collaboration web application** built using **Node.js, Express, and static frontend technologies (HTML, CSS, JavaScript)**.
This project demonstrates **full-stack deployment, CI/CD automation, and cloud hosting** in a simple and understandable way.

---

## 🚀 Live Demo

https://collabx-k4t3.onrender.com

---

## 📌 Features

* Real-time collaboration ready architecture
* Lightweight **Node.js + Express** backend
* Clean static frontend structure
* Automated **CI/CD deployment using GitHub Actions**
* Cloud-hosted production environment
* Beginner-friendly full-stack project

---

## 🏗️ Project Structure

```
CollabX/
│
├── .github/workflows/        # CI/CD pipeline configuration
│
├── server/
│   ├── public/               # Frontend files
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   │
│   ├── server.js             # Express backend server
│   ├── package.json          # Project dependencies
│   └── package-lock.json
│
├── README.md
└── package-lock.json
```

---

## ⚙️ Installation & Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/KingGauravDevloper/CollabX
cd CollabX
```

### 2️⃣ Install dependencies

```bash
cd server
npm install
```

### 3️⃣ Run the server locally

```bash
node server.js
```

Server will run on:

```
http://localhost:5000
```

---

## ☁️ Deployment

This project includes:

* **Cloud deployment support**
* **Automatic CI/CD on push to the `main` branch**
* **Secure deployment using repository secrets and deploy hooks**

Every push to the main branch **automatically triggers a new production deployment**.

---

## 🔄 CI/CD Workflow Overview

The automated pipeline performs:

1. Checkout repository code
2. Setup Node.js environment
3. Install backend dependencies
4. Trigger cloud deployment hook

This ensures **continuous integration and continuous delivery**.

---

## 🧠 Learning Objectives

CollabX helps understand:

* Full-stack project organization
* Backend deployment in production
* Environment-based port configuration
* CI/CD automation with GitHub Actions
* Real-world cloud hosting workflow

---

## 🚧 Future Improvements

* Real-time WebSocket collaboration features
* User authentication & authorization
* Database integration
* Multi-user editing support
* Improved UI/UX design

---

## 👤 Author

**King Gaurav**
Aspiring Software Developer focused on:


---

## 📄 License

This project is open source and available under the **MIT License**.
