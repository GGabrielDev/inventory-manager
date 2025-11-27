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

import type { DepartmentsTableProps } from '@/types';

const DepartmentsTable: React.FC<DepartmentsTableProps> = ({
  departments,
  canEditDepartment,
  canDeleteDepartment,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation('common'); // ✅ Fixed: added 'common' namespace

  if (departments.length === 0) {
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
            {(canEditDepartment || canDeleteDepartment) && (
              <TableCell>{t('actions')}</TableCell> 
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.id}</TableCell>
              <TableCell>{department.name}</TableCell>
              <TableCell>
                {format(new Date(department.creationDate), 'PPp')}
              </TableCell>
              <TableCell>
                {format(new Date(department.updatedOn), 'PPp')}
              </TableCell>
              {(canEditDepartment || canDeleteDepartment) && (
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEditDepartment && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(department)}
                      >
                        {t('edit')} {/* ✅ Fixed: removed 'common:' prefix */}
                      </Button>
                    )}
                    {canDeleteDepartment && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(department.id)}
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

export default DepartmentsTable;