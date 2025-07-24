import { Box, Button, Card, CardContent,Container, Typography } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch,RootState } from '@/store';
import { logout } from '@/store/authSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  // Helper function to check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.some(role => 
      role.permissions.some(permission => permission.name === permissionName)
    );
  };

  // Check permissions for different sections
  const canCreateUser = hasPermission('create_user');
  const canGetUser = hasPermission('get_user');
  const canCreateRole = hasPermission('create_role');
  const canGetRole = hasPermission('get_role');
  const canCreateDepartment = hasPermission('create_department');
  const canGetDepartment = hasPermission('get_department');
  const canCreateCategory = hasPermission('create_category');
  const canGetCategory = hasPermission('get_category');

  // Determine if user can manage each section (needs both create and get permissions)
  const canManageUsers = canCreateUser && canGetUser;
  const canManageRoles = canCreateRole && canGetRole;
  const canManageDepartments = canCreateDepartment && canGetDepartment;
  const canManageCategories = canCreateCategory && canGetCategory;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const managementSections = [
    {
      title: 'Manage Users',
      description: 'Create, edit, and manage user accounts',
      canAccess: canManageUsers,
      route: '/users',
      color: 'primary' as const,
    },
    {
      title: 'Manage Roles',
      description: 'Configure roles and permissions',
      canAccess: canManageRoles,
      route: '/roles',
      color: 'secondary' as const,
    },
    {
      title: 'Manage Departments',
      description: 'Organize and manage departments',
      canAccess: canManageDepartments,
      route: '/departments',
      color: 'success' as const,
    },
    {
      title: 'Manage Categories',
      description: 'Create and organize item categories',
      canAccess: canManageCategories,
      route: '/categories',
      color: 'info' as const,
    },
  ];

  const accessibleSections = managementSections.filter(section => section.canAccess);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.username || 'User'}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Management Sections */}
      {accessibleSections.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {accessibleSections.map((section) => (
            <Card 
              key={section.title}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              onClick={() => navigate(section.route)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {section.description}
                </Typography>
                <Button 
                  variant="contained" 
                  color={section.color}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(section.route);
                  }}
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Management Sections Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permissions to manage any sections. Please contact your administrator for access.
          </Typography>
        </Box>
      )}

      {/* User Info Section */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Permissions
        </Typography>
        {user?.roles && user.roles.length > 0 ? (
          <Box>
            {user.roles.map((role) => (
              <Box key={role.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {role.name}
                </Typography>
                <Box sx={{ ml: 2 }}>
                  {role.permissions.map((permission) => (
                    <Typography key={permission.id} variant="body2" color="text.secondary">
                      • {permission.description}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No roles assigned
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
