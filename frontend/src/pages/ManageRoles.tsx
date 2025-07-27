import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Checkbox, 
  CircularProgress, 
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  FormControlLabel, 
  FormGroup, 
  FormLabel, 
  Pagination, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { usePermissions } from '@/hooks/usePermissions';
import type { RootState } from '@/store';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: {
    id: number;
    name: string;
    description: string;
  }[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

const ManageRoles: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  
  const {
    canGetRole,
    canCreateRole,
    canEditRole,
    canDeleteRole,
    canManageRoles,
    canGetPermission
  } = usePermissions();

  // Local state
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // If user doesn't have basic role viewing permission, redirect
  useEffect(() => {
    if (!canManageRoles) {
      navigate('/dashboard');
      return;
    }
  }, [canManageRoles, navigate]);

  // Fetch roles
  const fetchRoles = useCallback(async (currentPage = 1) => {
    if (!canGetRole) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/roles?page=${currentPage}&pageSize=10`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch roles');
      }
      setRoles(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [canGetRole, token]);

  useEffect(() => {
    fetchRoles(page);
  }, [page, canGetRole, fetchRoles]);

  const handleDelete = async (roleId: number) => {
    if (!canDeleteRole) return;
    
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/roles/${roleId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete role');
      }

      // Refresh the list
      fetchRoles(page);
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
    }
  };

  const handleEdit = (role: Role) => {
    if (!canEditRole) return;
    setEditingRole(role);
    setShowForm(true);
  };

  const handleCreate = () => {
    if (!canCreateRole) return;
    setEditingRole(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRole(null);
    fetchRoles(page);
  };

  // Don't render anything if user doesn't have basic permissions
  if (!canManageRoles) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Roles
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Configure roles and their permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          {/* Only show Create button if user has create permission */}
          {canCreateRole && (
            <Button
              variant="contained"
              onClick={handleCreate}
            >
              Create New Role
            </Button>
          )}
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Roles Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : roles.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Roles Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {canCreateRole 
                ? 'Get started by creating your first role.' 
                : 'No roles are currently configured.'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                {/* Only show Actions column if user has edit or delete permissions */}
                {(canEditRole || canDeleteRole) && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {role.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.description || 'No description'}
                    </Typography>
                  </TableCell>
                  {/* Only show Actions column if user has edit or delete permissions */}
                  {(canEditRole || canDeleteRole) && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {/* Only show Edit button if user has edit permission */}
                        {canEditRole && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEdit(role)}
                          >
                            Edit
                          </Button>
                        )}
                        {/* Only show Delete button if user has delete permission */}
                        {canDeleteRole && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(role.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Role Form Dialog */}
      {showForm && (canCreateRole || canEditRole) && (
        <RoleFormDialog
          open={showForm}
          role={editingRole}
          onClose={() => {
            setShowForm(false);
            setEditingRole(null);
          }}
          onSuccess={handleFormSuccess}
          canEdit={canEditRole}
          canCreate={canCreateRole}
          canGetPermission={canGetPermission}
        />
      )}
    </Container>
  );
};

// Role Form Dialog Component
interface RoleFormDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetPermission: boolean;
}

const RoleFormDialog: React.FC<RoleFormDialogProps> = ({ 
  open,
  role, 
  onClose, 
  onSuccess, 
  canEdit, 
  canCreate,
  canGetPermission
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    role?.permissions?.map(p => p.id) || []
  );
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user can perform this action
  const canPerformAction = role ? canEdit : canCreate;

  useEffect(() => {
    // Fetch available permissions if user has permission to view them
    if (canGetPermission) {
      const fetchPermissions = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/permissions?page=1&pageSize=100`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setAvailablePermissions(data.data || []);
          }
        } catch (err) {
          console.error('Error fetching permissions:', err);
        }
      };

      fetchPermissions();
    }
  }, [token, canGetPermission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction) {
      setError('You do not have permission to perform this action');
      return;
    }

    if (!name.trim()) {
      setError('Role name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = role 
        ? `${import.meta.env.VITE_API_URL}/roles/${role.id}`
        : `${import.meta.env.VITE_API_URL}/roles`;
      
      const method = role ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          permissionIds: selectedPermissions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save role');
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  if (!canPerformAction) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Access Denied</DialogTitle>
        <DialogContent>
          <Typography color="error">
            You do not have permission to {role ? 'edit' : 'create'} roles.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {role ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          {/* Only show permissions if user can view them */}
          {canGetPermission && availablePermissions.length > 0 && (
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Permissions</FormLabel>
              <FormGroup>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 1 }}>
                  {availablePermissions.map(permission => (
                    <FormControlLabel
                      key={permission.id}
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                          disabled={loading}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {permission.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {permission.description}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </FormGroup>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (role ? 'Update Role' : 'Create Role')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ManageRoles;
