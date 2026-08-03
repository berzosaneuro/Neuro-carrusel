import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PhoneShell from './components/PhoneShell';
import Dashboard from './pages/Dashboard';
import UnitPage from './pages/UnitPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PhoneShell>
          <Routes>
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
