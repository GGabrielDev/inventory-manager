import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CategoriesTable from '@/components/category/CategoriesTable';
import CategoryFormDialog from '@/components/category/CategoryFormDialog';
import { useCategoryManagement, usePermissions } from '@/hooks';
import type { Category } from '@/types';

const ManageCategories: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    categories,
    error,
    fetchCategories,
    deleteCategory,
  } = useCategoryManagement();

  const {
    canCreateCategory,
    canEditCategory,
    canDeleteCategory,
    canGetCategory,
  } = usePermissions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (canGetCategory) {
      fetchCategories();
    }
  }, [fetchCategories, canGetCategory]);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm(t('common:confirmDelete'))) {
      const success = await deleteCategory(categoryId);
      if (success) {
        fetchCategories();
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDialogSuccess = () => {
    fetchCategories();
    handleDialogClose();
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  if (!canGetCategory) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" color="error">
          {t('common:noPermission')}
        </Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          {t('common:backToDashboard')}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('dashboard:manageCategories')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {canCreateCategory && (
            <Button variant="contained" onClick={handleCreate}>
              {t('common:create')}
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            {t('common:backToDashboard')}
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <CategoriesTable
        categories={categories}
        canEditCategory={canEditCategory}
        canDeleteCategory={canDeleteCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryFormDialog
        open={dialogOpen}
        category={selectedCategory}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        canEdit={canEditCategory}
        canCreate={canCreateCategory}
      />
    </Container>
  );
};

export default ManageCategories;
