import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDepartmentManagement } from '@/hooks';
import type { DepartmentFormData,DepartmentFormDialogProps } from '@/types';

const DepartmentFormDialog: React.FC<DepartmentFormDialogProps> = ({
  open,
  department,
  onClose,
  onSuccess,
  canEdit,
  canCreate,
}) => {
  const { t } = useTranslation();
  const { createDepartment, updateDepartment, error, setError } = useDepartmentManagement();

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
      });
    } else {
      setFormData({
        name: '',
      });
    }
    setError('');
  }, [department, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (department && canEdit) {
        success = await updateDepartment(department.id, formData);
      } else if (!department && canCreate) {
        success = await createDepartment(formData);
      }

      if (success) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '' });
    setError('');
    onClose();
  };

  const isEditing = !!department;
  const canSubmit = isEditing ? canEdit : canCreate;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? t('common:edit') : t('common:create')} {t('common:department')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('common:name')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading || !canSubmit}
          />
          {error && (
            <div style={{ color: 'red', marginTop: '8px' }}>
              {error}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t('common:cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !canSubmit || !formData.name.trim()}
          >
            {loading ? t('common:saving') : (isEditing ? t('common:update') : t('common:create'))}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DepartmentFormDialog;
