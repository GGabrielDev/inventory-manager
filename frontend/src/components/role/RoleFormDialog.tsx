import { 
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useMemo,useState } from 'react';
import { useSelector } from 'react-redux';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedPermissions: [] as number[]
  });
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user can perform this action
  const canPerformAction = role ? canEdit : canCreate;

  // Initialize form data when role changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: role?.name || '',
        description: role?.description || '',
        selectedPermissions: role?.permissions?.map(p => p.id) || []
      });
      setError('');
    }
  }, [open, role]);

  // Fetch available permissions with useCallback to prevent unnecessary re-renders
  const fetchPermissions = useCallback(async () => {
    if (!canGetPermission) return;
    
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
  }, [token, canGetPermission]);

  useEffect(() => {
    if (open && canGetPermission) {
      fetchPermissions();
    }
  }, [open, fetchPermissions, canGetPermission]);

  // Memoized handlers to prevent re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handlePermissionChange = useCallback((permissionId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: e.target.checked
        ? [...prev.selectedPermissions, permissionId]
        : prev.selectedPermissions.filter(id => id !== permissionId)
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPerformAction) {
      setError('You do not have permission to perform this action');
      return;
    }

    if (!formData.name.trim()) {
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
          name: formData.name.trim(),
          description: formData.description.trim(),
          permissionIds: formData.selectedPermissions,
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
  }, [canPerformAction, formData, role, token, onSuccess]);

  // Memoize permission checkboxes to prevent unnecessary re-renders
  const permissionCheckboxes = useMemo(() => {
    return availablePermissions.map(permission => (
      <FormControlLabel
        key={permission.id}
        control={
          <Checkbox
            checked={formData.selectedPermissions.includes(permission.id)}
            onChange={handlePermissionChange(permission.id)}
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
    ));
  }, [availablePermissions, formData.selectedPermissions, handlePermissionChange, loading]);

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
            value={formData.name}
            onChange={handleNameChange}
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
            value={formData.description}
            onChange={handleDescriptionChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          {/* Only show permissions if user can view them */}
          {canGetPermission && availablePermissions.length > 0 && (
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Permissions</FormLabel>
              <FormGroup>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 1 }}>
                  {permissionCheckboxes}
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

export default RoleFormDialog;
