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

import { useCategoryManagement } from '@/hooks';
import type { CategoryFormData,CategoryFormDialogProps } from '@/types';

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  category,
  onClose,
  onSuccess,
  canEdit,
  canCreate,
}) => {
  const { t } = useTranslation('common'); // ✅ Fixed: added 'common' namespace
  const { createCategory, updateCategory, error, setError } = useCategoryManagement();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
      });
    } else {
      setFormData({
        name: '',
      });
    }
    setError('');
  }, [category, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (category && canEdit) {
        success = await updateCategory(category.id, formData);
      } else if (!category && canCreate) {
        success = await createCategory(formData);
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

  const isEditing = !!category;
  const canSubmit = isEditing ? canEdit : canCreate;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? t('edit') : t('create')} {t('category')} {/* ✅ Fixed: removed 'common:' prefix */}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('name')} 
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
            {t('cancel')} {/* ✅ Fixed: removed 'common:' prefix */}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !canSubmit || !formData.name.trim()}
          >
            {loading ? t('saving') : (isEditing ? t('update') : t('create'))} {/* ✅ Fixed: removed 'common:' prefix */}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryFormDialog;