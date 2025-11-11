import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute';

import { privateRoutes } from './privateRoutes';
import { publicRoutes } from './publicRoutes';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* 🔓 Rutas públicas */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* 🔐 Rutas privadas */}
      {privateRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}

      {/* 🌐 Redirección por defecto */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRouter;
