# Ona AI — Voice to Document Assistant

This project contains both **Backend (Flask + Whisper)** and **Frontend (React + Vite)** for Ona AI.  
It allows users to record voice commands or upload documents, transcribe audio, generate responses, and download them as Word files.

---

## 🚀 Backend Setup (Flask API)

### 1. Prerequisites
- **Python 3.11.x** (recommended)  
  Check version:
  ```powershell
  python --version
````

---

### 2. Create Virtual Environment

Recommended for isolating dependencies:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Deactivate anytime with:

```powershell
deactivate
```

---

### 3. Install Dependencies

Upgrade pip first:

```powershell
pip install --upgrade pip
```

Then install requirements:

```powershell
pip install -r requirements.txt
```

---

### 4. Run the Backend

Start Flask server:

```powershell
python ona_ai.py
```

Server will run at:

```
http://localhost:5000
```

---

### ⚠️ Troubleshooting

#### Issue: `OSError: Could not find/load shared object file`

Fix by reinstalling `llvmlite` and `numba`:

```powershell
pip uninstall -y llvmlite numba
pip install llvmlite==0.40.1 numba==0.57.1
```

---

## 🎨 Frontend Setup (React + Vite)

### 1. Prerequisites

* **Node.js 18+** and **npm** installed
  Check versions:

  ```powershell
  node -v
  npm -v
  ```

---

### 2. Install Dependencies

Navigate to the frontend folder:

```powershell
cd frontend
```

Install modules:

```powershell
npm install
```

---

### 3. Run Frontend

Start development server:

```powershell
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

## 📂 Project Structure

```
ona-ai/
├── backend/
│   ├── ona_ai.py           # Flask API (voice & AI chat)
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # (ignored) virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages (Command, GeneratedWork, UploadSummary, etc.)
│   │   ├── components/     # Shared components (AvatarBox, SoundBars)
│   │   ├── assets/         # Images, logos
│   │   └── App.jsx
│   ├── package.json        # Frontend dependencies
│   └── node_modules/       # (ignored) installed packages
│
├── .gitignore
├── README.md
```

---

## ✅ Quick Start

```powershell
# In one terminal (backend)
cd backend
python ona_ai.py

# In another terminal (frontend)
cd frontend
npm run dev
```

Then open:
👉 [http://localhost:5173](http://localhost:5173)

---

✨ You’re all set — Ona AI should now be running locally!

```

---

👉 Do you want me to also **clean up your `requirements.txt`** for this no-Groq version (only keep the needed packages for Whisper + Flask)?
```
