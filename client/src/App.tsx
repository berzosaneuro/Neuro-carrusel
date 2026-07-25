import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PhoneShell from './components/PhoneShell';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UnitPage from './pages/UnitPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PhoneShell>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/unit/:unitId"
              element={
                <ProtectedRoute>
                  <UnitPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhoneShell>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
