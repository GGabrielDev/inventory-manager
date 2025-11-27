import {
  Button,
  Chip,
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

import type { ItemsTableProps } from '@/types';

const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  canEditItem,
  canDeleteItem,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation('common'); //  Fixed: added 'common' namespace

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {t('no_data_found')} {/*  Fixed: removed 'common:' prefix */}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('id')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            <TableCell>{t('name')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            <TableCell>{t('quantity')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            <TableCell>{t('unit')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            <TableCell>{t('category')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            <TableCell>{t('department')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            <TableCell>{t('created_at')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            <TableCell>{t('updated_at')}</TableCell> {/*  Fixed: removed 'common:' prefix */}
            {(canEditItem || canDeleteItem) && (
              <TableCell>{t('actions')}</TableCell> 
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <Chip label={item.unit} size="small" />
              </TableCell>
              <TableCell>
                {item.category ? item.category.name : t('none')} {/* ✅ Fixed: removed 'common:' prefix */}
              </TableCell>
              <TableCell>
                {item.department ? item.department.name : t('none')} {/* ✅ Fixed: removed 'common:' prefix */}
              </TableCell>
              <TableCell>
                {format(new Date(item.creationDate), 'PPp')}
              </TableCell>
              <TableCell>
                {format(new Date(item.updatedOn), 'PPp')}
              </TableCell>
              {(canEditItem || canDeleteItem) && (
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEditItem && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(item)}
                      >
                        {t('edit')} {/*  Fixed: removed 'common:' prefix */}
                      </Button>
                    )}
                    {canDeleteItem && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(item.id)}
                      >
                        {t('delete')} {/*  Fixed: removed 'common:' prefix */}
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

export default ItemsTable;