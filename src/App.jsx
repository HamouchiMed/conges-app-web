import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Employee/Dashboard';
import LeaveForm from './pages/Employee/LeaveForm';
import AdminPanel from './pages/Director/AdminPanel';
import Meetings from './pages/Director/Meetings';

function ProtectedRoute({ children, role }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/" element={user ? (
        <Navigate to={user.role === 'employee' ? '/employee/dashboard' : '/director/panel'} replace />
      ) : (
        <Login />
      )} />

      <Route element={<ProtectedRoute role="employee"><Layout /></ProtectedRoute>}>
        <Route path="/employee/dashboard" element={<Dashboard />} />
        <Route path="/employee/leave" element={<LeaveForm />} />
      </Route>

      <Route element={<ProtectedRoute role="director"><Layout /></ProtectedRoute>}>
        <Route path="/director/panel" element={<AdminPanel />} />
        <Route path="/director/meetings" element={<Meetings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
