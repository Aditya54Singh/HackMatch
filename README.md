# 🚀 HackMatch – ML-Powered Hackathon Discovery Platform

HackMatch is a production-deployed full-stack web application that helps users discover relevant and trustworthy hackathons using Machine Learning for spam detection and intelligent user matching.

🔗 **Live Frontend:** https://your-netlify-url  
🔗 **Live Backend API:** https://hackmatch-v9nv.onrender.com  

---

## 📌 Problem Statement

Students often struggle to:

- Find relevant hackathons
- Identify spam or low-quality listings
- Connect with like-minded participants
- Track participation history securely

HackMatch solves this by integrating ML-based spam detection, user similarity matching, and secure authentication into a scalable cloud-deployed system.

---

## ✨ Key Highlights

- ✅ Production deployment (Render + Netlify)
- ✅ PostgreSQL cloud database
- ✅ JWT-based authentication
- ✅ Random Forest spam detection model
- ✅ User similarity recommendation system
- ✅ Proper relational schema with cascade deletion
- ✅ Real-world debugging & deployment experience

---

## 🏗 System Architecture

```
Frontend (React - Netlify)
        ↓
Flask REST API (Render)
        ↓
PostgreSQL Database (Render)
        ↓
Scikit-Learn ML Model
```

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Context API

### Backend
- Flask
- SQLAlchemy ORM
- Flask-JWT-Extended
- Flask-Migrate
- Gunicorn (Production WSGI)

### Database
- PostgreSQL (Render Cloud)

### Machine Learning
- Scikit-Learn
- Random Forest Classifier
- Feature Engineering
- Model Serialization (Pickle)

### Deployment
- Backend: Render
- Database: Render PostgreSQL
- Frontend: Netlify

---

## 🔐 Core Features

### 👤 Authentication System
- JWT-based authentication
- Secure password hashing
- Protected routes
- Role-based permissions

### 🏆 Hackathon Management
- Create hackathons
- Edit & delete (owner-only)
- Join hackathons
- Participation history tracking

### 🤝 User Connection System
- Follow / Unfollow users
- View connections
- Similar user recommendations

### 🧠 ML Spam Detection
- Random Forest classifier trained on hackathon metadata
- Spam probability scoring
- Risk indicator displayed in frontend
- Moderation-ready flagging logic

### 🗑 Safe Cascade Deletion
Maintains referential integrity by automatically removing:
- Registrations
- Connections
- Owned hackathons

---

## 🧠 Machine Learning Pipeline

1. Feature extraction from hackathon metadata  
2. Data preprocessing  
3. Random Forest model training  
4. Model serialization using Pickle  
5. Integrated scoring inside backend API  
6. Real-time spam probability display in UI  

---

## 📂 Project Structure

```
hackmatch/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── extensions.py
│   ├── migrations/
│   ├── run.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── public/_redirects
```

---

## ⚙️ Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://...
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
FLASK_ENV=production
```

### Frontend (.env)

```
VITE_API_URL=https://hackmatch-v9nv.onrender.com/api
```

---

## 🚀 Local Development Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

flask db upgrade
python run.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Database Migrations

Create migration:

```bash
flask db migrate -m "migration message"
```

Apply migration:

```bash
flask db upgrade
```

---

## 🔍 Production Challenges Solved

- Gunicorn port binding in cloud environment  
- PostgreSQL migration alignment  
- Cascade delete relationship conflicts  
- JWT persistence across reload  
- SPA routing (Netlify 404 on refresh)  
- CORS configuration for cross-origin deployment  
- Environment-based configuration handling  

---

## 📊 Why This Project Matters

Most student projects stop at local development.

HackMatch demonstrates:

- Production-ready deployment  
- Cloud database integration  
- ML model integration inside backend API  
- Secure authentication architecture  
- Real-world debugging experience  
- Clean modular backend design  

---

## 🚀 Future Improvements

- Backend pagination & filtering  
- Rate limiting  
- Unit testing (Pytest)  
- Redis caching  
- Docker containerization  
- CI/CD pipeline  
- Advanced ML explainability (SHAP)  

---

## 👨‍💻 Author

**Aditya Singh**  
Data Science & Full Stack Developer  
