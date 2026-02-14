CollabX

CollabX is a simple real-time collaboration web application built using Node.js, Express, and static frontend assets.
It demonstrates full-stack deployment, CI/CD automation, and cloud hosting.


🚀 Live Demo

Deployed on cloud hosting platform.
https://collabx-k4t3.onrender.com

📌 Features

Real-time collaboration interface

Lightweight Node.js backend

Static frontend (HTML, CSS, JS)

Automated deployment using CI/CD

Cloud-hosted production server

🏗️ Project Structure
CollabX/
│
├── .github/workflows/      # CI/CD pipeline
│
├── server/
│   ├── public/             # Frontend files
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   │
│   ├── server.js           # Express backend
│   ├── package.json        # Dependencies
│   └── package-lock.json
│
├── README.md
└── package-lock.json

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/KingGauravDevloper/CollabX
cd CollabX

2️⃣ Install dependencies
cd server
npm install

3️⃣ Run locally
node server.js


Server will start on:

http://localhost:5000

☁️ Deployment

This project is configured with:

Cloud hosting deployment

CI/CD automation on push to main branch

Secure deploy hook using repository secrets

Every push to the main branch automatically triggers a new deployment.

🔄 CI/CD Workflow

Steps executed during deployment:

Checkout repository

Install Node.js

Install backend dependencies

Trigger cloud deploy hook

🧠 Learning Goals of This Project

This project demonstrates:

Full-stack project structure

Backend deployment in production

Environment-based port handling

Automated CI/CD pipelines

Real-world cloud hosting workflow

📌 Future Improvements

Real-time WebSocket collaboration

Authentication system

Database integration

Multi-user editing

UI enhancements

👤 Author

King Gaurav


📄 License

This project is open source and available under the MIT License.