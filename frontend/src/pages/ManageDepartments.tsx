import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import DepartmentFormDialog from '@/components/department/DepartmentFormDialog';
import DepartmentsTable from '@/components/department/DepartmentsTable';
import { useDepartmentManagement, usePermissions } from '@/hooks';
import type { Department } from '@/types';

const ManageDepartments: React.FC = () => {
  const { t } = useTranslation('common'); // ✅ Fixed: added 'common' namespace
  const navigate = useNavigate();
  const {
    departments,
    error,
    fetchDepartments,
    deleteDepartment,
  } = useDepartmentManagement();

  const {
    canCreateDepartment,
    canEditDepartment,
    canDeleteDepartment,
    canGetDepartment,
  } = usePermissions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  useEffect(() => {
    if (canGetDepartment) {
      fetchDepartments();
    }
  }, [fetchDepartments, canGetDepartment]);

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setDialogOpen(true);
  };

  const handleDelete = async (departmentId: number) => {
    if (window.confirm(t('confirm_delete'))) { // ✅ Fixed: removed 'common:' prefix
      const success = await deleteDepartment(departmentId);
      if (success) {
        fetchDepartments();
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleDialogSuccess = () => {
    fetchDepartments();
    handleDialogClose();
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setDialogOpen(true);
  };

  if (!canGetDepartment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" color="error">
          {t('no_permission')} {/* ✅ Fixed: removed 'common:' prefix */}
        </Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          {t('back_to_dashboard')} {/* ✅ Fixed: removed 'common:' prefix */}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('manage_departments')} {/* ✅ Fixed: removed 'dashboard:' prefix */}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {canCreateDepartment && (
            <Button variant="contained" onClick={handleCreate}>
              {t('create')} {/* ✅ Fixed: removed 'common:' prefix */}
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            {t('back_to_dashboard')} {/* ✅ Fixed: removed 'common:' prefix */}
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <DepartmentsTable
        departments={departments}
        canEditDepartment={canEditDepartment}
        canDeleteDepartment={canDeleteDepartment}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DepartmentFormDialog
        open={dialogOpen}
        department={selectedDepartment}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        canEdit={canEditDepartment}
        canCreate={canCreateDepartment}
      />
    </Container>
  );
};

export default ManageDepartments;