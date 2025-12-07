import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate,Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/SingUp';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import AddQuestion from './pages/AddQuestion';
import QuizCategories from './pages/QuizCategary';
import Home from "./pages/Home"
import Navbar from './components/Navbar';
export default function App() {
  const [me, setMe] = useState(JSON.parse(localStorage.getItem('me')) || null);
  const navigate = useNavigate();
  useEffect(() => {
    if (me) localStorage.setItem('me', JSON.stringify(me));
  }, [me]);

  const onLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('me', JSON.stringify(user));
    setMe(user);
    // navigate('/dashboard');
     navigate('/quiz-categary');
  };
  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('me');
    setMe(null);
    navigate('/login');
  };

  const PrivateRoute = ({ me, children }) => {
  if (!me) return <Navigate to="/login" replace />;
  return children;
};
  return (
    <div className="min-h-screen">
      <Navbar onLogout={onLogout} me={me} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} />
         <Route path="/quiz-categary" element={<QuizCategories me={me} />} />
        <Route path="/signup" element={<Signup onLogin={onLogin} />} />
        <Route path="/dashboard" element={<Dashboard me={me} onLogout={onLogout} />} />
       <Route path="/quiz" element={<PrivateRoute me={me}><Quiz me={me} /></PrivateRoute>} />
        <Route path="/result" element={<Result />} />
        <Route path="/add-question" element={<AddQuestion me={me} />} />
      </Routes>
    </div>
  );
}
