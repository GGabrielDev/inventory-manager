import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography} from '@mui/material';

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

interface RolesTableProps {
  roles: Role[];
  canEditRole: boolean;
  canDeleteRole: boolean;
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
}

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  canEditRole,
  canDeleteRole,
  onEdit,
  onDelete
}) => {
  const handleDelete = (roleId: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      onDelete(roleId);
    }
  };

  return (
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
                        onClick={() => onEdit(role)}
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
  );
};

export default RolesTable;
