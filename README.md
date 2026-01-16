# Anki Card Generator

Generate Anki flashcards from PDF files using AI. Built with FastAPI backend and React frontend.

## Features

- 📤 Upload PDF files
- 🤖 AI-powered flashcard generation (using Google Gemini)
- 📝 Edit and delete cards
- 💾 Export cards as text file (semicolon-separated)
- 🔐 Simple JWT authentication

## Project Structure

```
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── auth/      # Authentication routes
│   │   ├── cards/     # Card CRUD operations
│   │   └── pdf/       # PDF text extraction
│   ├── requirements.txt
│   └── Procfile       # Railway deployment
│
└── frontend/          # React frontend (Vite)
    ├── src/
    │   ├── pages/     # Login, Register, Dashboard
    │   ├── components/# Card components, modals
    │   └── api/       # API client
    └── vercel.json    # Vercel deployment
```

## Local Development

### Backend

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file from example:
```bash
cp .env.example .env
# Edit .env with your actual values:
# - GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey
# - DATABASE_URL: Your PostgreSQL connection string
# - SECRET_KEY: A random secure string
```

4. Start the server:
```bash
uvicorn app.main:app --reload
```

Backend runs at http://localhost:8000

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
echo "VITE_API_URL=http://localhost:8000" > .env
```

3. Start development server:
```bash
npm run dev
```

Frontend runs at http://localhost:5173

## Deployment

### Backend (Railway)

1. Create a new Railway project
2. Add PostgreSQL from the Railway marketplace
3. Connect your GitHub repo
4. Set environment variables:
   - `GEMINI_API_KEY` - Your Gemini API key
   - `SECRET_KEY` - A secure random string
   - `FRONTEND_URL` - Your Vercel deployment URL
5. Railway auto-deploys from the `backend` directory

### Frontend (Vercel)

1. Import your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL` - Your Railway backend URL
4. Deploy!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/cards/upload` | Upload PDF, generate cards |
| GET | `/cards/` | Get all cards |
| PUT | `/cards/{id}` | Update card |
| DELETE | `/cards/{id}` | Delete card |
| GET | `/cards/export/txt` | Export cards as text |

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy + PostgreSQL
- Google Gemini AI
- JWT Authentication

**Frontend:**
- React 18 + Vite
- React Router
- Axios

## License

MIT
