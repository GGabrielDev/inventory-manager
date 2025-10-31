import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ColumnVisibilityControl from '@/components/item/ColumnVisibilityControl';
import ItemFormDialog from '@/components/item/ItemFormDialog';
import ItemsTable from '@/components/item/ItemsTable';
import { useItemManagement, usePermissions } from '@/hooks';
import type { Item } from '@/types';

const ManageItems: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    error,
    fetchItems,
    deleteItem,
  } = useItemManagement();

  const {
    canCreateItem,
    canEditItem,
    canDeleteItem,
    canGetItem,
    canGetCategory,
    canGetDepartment,
  } = usePermissions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (canGetItem) {
      fetchItems();
    }
  }, [fetchItems, canGetItem]);

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm(t('common:confirmDelete'))) {
      const success = await deleteItem(itemId);
      if (success) {
        fetchItems();
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDialogSuccess = () => {
    fetchItems();
    handleDialogClose();
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  if (!canGetItem) {
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
          {t('dashboard:manageItems')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ColumnVisibilityControl />
          {canCreateItem && (
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

      <ItemsTable
        items={items}
        canEditItem={canEditItem}
        canDeleteItem={canDeleteItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ItemFormDialog
        open={dialogOpen}
        item={selectedItem}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        canEdit={canEditItem}
        canCreate={canCreateItem}
        canGetCategory={canGetCategory}
        canGetDepartment={canGetDepartment}
      />
    </Container>
  );
};

export default ManageItems;
