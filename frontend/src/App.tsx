import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import ManageCategories from './pages/ManageCategories';
import ManageDepartments from './pages/ManageDepartments';
import ManageItems from './pages/ManageItems';
import ManageRoles from './pages/ManageRoles';
import ManageUsers from './pages/ManageUsers';

const App: React.FC = () => {
  return (
    <Routes>
      
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
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

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <ManageDepartments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <ManageCategories />
          </ProtectedRoute>
        }
      />

      <Route
        path="/items"
        element={
          <ProtectedRoute>
            <ManageItems />
          </ProtectedRoute>
        }
      />

      {/* Redirect all unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
};

export default App;
