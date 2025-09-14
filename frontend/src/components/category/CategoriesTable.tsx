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
  const { t } = useTranslation();

  if (categories.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {t('common:noDataFound')}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('common:id')}</TableCell>
            <TableCell>{t('common:name')}</TableCell>
            <TableCell>{t('common:createdAt')}</TableCell>
            <TableCell>{t('common:updatedAt')}</TableCell>
            {(canEditCategory || canDeleteCategory) && (
              <TableCell>{t('common:actions')}</TableCell>
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
                        {t('common:edit')}
                      </Button>
                    )}
                    {canDeleteCategory && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(category.id)}
                      >
                        {t('common:delete')}
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
