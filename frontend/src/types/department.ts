import type { Item } from './item';

export interface Department {
  id: number;
  name: string;
  creationDate: string;
  updatedOn: string;
  deletionDate?: string;
  items?: Item[];
}

export interface DepartmentFormData {
  name: string;
}

export interface DepartmentFormDialogProps {
  open: boolean;
  department: Department | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
}

export interface DepartmentsTableProps {
  departments: Department[];
  canEditDepartment: boolean;
  canDeleteDepartment: boolean;
  onEdit: (department: Department) => void;
  onDelete: (departmentId: number) => void;
}
