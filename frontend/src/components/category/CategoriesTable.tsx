import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import type { CategoriesTableProps } from '@/types';

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  canEditCategory,
  canDeleteCategory,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation('common'); // ✅ Fixed: added 'common' namespace

  if (categories.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {t('no_data_found')} {/* ✅ Fixed: removed 'common:' prefix */}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('id')}</TableCell> {/* ✅ Fixed: removed 'common:' prefix */}
            <TableCell>{t('name')}</TableCell> {/* ✅ Fixed: removed 'common:' prefix */}
            <TableCell>{t('created_at')}</TableCell> {/* ✅ Fixed: removed 'common:' prefix */}
            <TableCell>{t('updated_at')}</TableCell> {/* ✅ Fixed: removed 'common:' prefix */}
            {(canEditCategory || canDeleteCategory) && (
              <TableCell>{t('actions')}</TableCell> 
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                {format(new Date(category.creationDate), 'PPp')}
              </TableCell>
              <TableCell>
                {format(new Date(category.updatedOn), 'PPp')}
              </TableCell>
              {(canEditCategory || canDeleteCategory) && (
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEditCategory && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(category)}
                      >
                        {t('edit')} {/* ✅ Fixed: removed 'common:' prefix */}
                      </Button>
                    )}
                    {canDeleteCategory && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(category.id)}
                      >
                        {t('delete')} {/* ✅ Fixed: removed 'common:' prefix */}
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoriesTable;