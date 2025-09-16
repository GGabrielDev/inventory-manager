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
  const { t } = useTranslation();

  if (departments.length === 0) {
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
            {(canEditDepartment || canDeleteDepartment) && (
              <TableCell>{t('common:actions')}</TableCell>
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
                        {t('common:edit')}
                      </Button>
                    )}
                    {canDeleteDepartment && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(department.id)}
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

export default DepartmentsTable;
