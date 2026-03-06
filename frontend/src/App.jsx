import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ImportCards from './pages/ImportCards';
import StudyPage from './pages/StudyPage';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="page flex-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/import"
                element={
                    <ProtectedRoute>
                        <ImportCards />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/study/:deckId"
                element={
                    <ProtectedRoute>
                        <StudyPage />
                    </ProtectedRoute>
                }
            />
            {/* Redirect authenticated users from / to /dashboard handled in Landing or by user choice, 
                but for now catch-all redirects to / (Landing) */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
