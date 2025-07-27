import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import ManageRoles from './pages/ManageRoles';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/roles" 
        element={
          <ProtectedRoute>
            <ManageRoles />
          </ProtectedRoute>
        }
      />
      {/* Add additional routes for Users, Departments, Categories as needed later */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
