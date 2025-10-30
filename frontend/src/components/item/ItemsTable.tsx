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
} from '@mui/material'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '@/store'
import type { ItemsTableProps } from '@/types'

const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  canEditItem,
  canDeleteItem,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation()
  const columnVisibility = useSelector((state: RootState) => state.itemTable)

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {t('common:noDataFound')}
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columnVisibility.id && <TableCell>{t('common:id')}</TableCell>}
            <TableCell>{t('common:name')}</TableCell>
            {columnVisibility.quantity && (
              <TableCell>{t('common:quantity')}</TableCell>
            )}
            {columnVisibility.unit && <TableCell>{t('common:unit')}</TableCell>}
            {columnVisibility.category && (
              <TableCell>{t('common:category')}</TableCell>
            )}
            {columnVisibility.department && (
              <TableCell>{t('common:department')}</TableCell>
            )}
            {columnVisibility.creationDate && (
              <TableCell>{t('common:createdAt')}</TableCell>
            )}
            {columnVisibility.updatedOn && (
              <TableCell>{t('common:updatedAt')}</TableCell>
            )}
            {(canEditItem || canDeleteItem) && (
              <TableCell>{t('common:actions')}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {columnVisibility.id && <TableCell>{item.id}</TableCell>}
              <TableCell>{item.name}</TableCell>
              {columnVisibility.quantity && (
                <TableCell>{item.quantity}</TableCell>
              )}
              {columnVisibility.unit && (
                <TableCell>
                  <Chip label={item.unit} size="small" />
                </TableCell>
              )}
              {columnVisibility.category && (
                <TableCell>
                  {item.category ? item.category.name : t('common:none')}
                </TableCell>
              )}
              {columnVisibility.department && (
                <TableCell>
                  {item.department ? item.department.name : t('common:none')}
                </TableCell>
              )}
              {columnVisibility.creationDate && (
                <TableCell>
                  {format(new Date(item.creationDate), 'PPp')}
                </TableCell>
              )}
              {columnVisibility.updatedOn && (
                <TableCell>
                  {format(new Date(item.updatedOn), 'PPp')}
                </TableCell>
              )}
              {(canEditItem || canDeleteItem) && (
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEditItem && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(item)}
                      >
                        {t('common:edit')}
                      </Button>
                    )}
                    {canDeleteItem && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(item.id)}
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
  )
}

export default ItemsTable
