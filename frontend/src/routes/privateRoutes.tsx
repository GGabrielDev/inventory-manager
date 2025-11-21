import Dashboard from '@/pages/Dashboard';
import ManageCategories from '@/pages/ManageCategories';
import ManageDepartments from '@/pages/ManageDepartments';
import ManageItems from '@/pages/ManageItems';
import ManageRoles from '@/pages/ManageRoles';
import ManageUsers from '@/pages/ManageUsers';

export const privateRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/roles', element: <ManageRoles /> },
  { path: '/users', element: <ManageUsers /> },
  { path: '/departments', element: <ManageDepartments /> },
  { path: '/categories', element: <ManageCategories /> },
  { path: '/items', element: <ManageItems /> },
];
