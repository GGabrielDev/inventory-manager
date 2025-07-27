import { Box, Button, Card, CardContent, Container, IconButton, Tooltip,Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { usePermissions } from '@/hooks';
import type { AppDispatch, RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { toggleTheme } from '@/store/themeSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const {
    canManageUsers,
    canManageRoles,
    canManageDepartments,
    canManageCategories,
    canManageItems,
  } = usePermissions();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Define the type for management sections
  interface ManagementSection {
    title: string;
    description: string;
    route: string;
    color: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  }

  // Only include sections if user has the required permissions
  const managementSections: ManagementSection[] = [
    // Users section - only show if user can manage users
    ...(canManageUsers ? [{
      title: 'Manage Users',
      description: 'Create, edit, and manage user accounts',
      route: '/users',
      color: 'primary' as const,
    }] : []),
    // Roles section - only show if user can manage roles
    ...(canManageRoles ? [{
      title: 'Manage Roles',
      description: 'Configure roles and permissions',
      route: '/roles',
      color: 'secondary' as const,
    }] : []),
    // Departments section - only show if user can manage departments
    ...(canManageDepartments ? [{
      title: 'Manage Departments',
      description: 'Organize and manage departments',
      route: '/departments',
      color: 'success' as const,
    }] : []),
    // Categories section - only show if user can manage categories
    ...(canManageCategories ? [{
      title: 'Manage Categories',
      description: 'Create and organize item categories',
      route: '/categories',
      color: 'info' as const,
    }] : []),
    // Items section - only show if user can manage items
    ...(canManageItems ? [{
      title: 'Manage Items',
      description: 'Track and manage inventory items',
      route: '/items',
      color: 'warning' as const,
    }] : []),
  ];

  const accessibleSections = managementSections;

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
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton onClick={handleThemeToggle} color="inherit">
              {themeMode === 'light' ? '🌙' : '☀️'}
            </IconButton>
          </Tooltip>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
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
      <Box sx={{ 
        mt: 6, 
        p: 3, 
        bgcolor: themeMode === 'light' ? 'grey.50' : 'grey.900', 
        borderRadius: 2 
      }}>
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
