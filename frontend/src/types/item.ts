import type { Category } from './category';
import type { UnitType } from './common';
import type { Department } from './department';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  unit: UnitType;
  creationDate: string;
  updatedOn: string;
  deletionDate?: string;
  categoryId?: number;
  departmentId: number;
  category?: Category;
  department?: Department;
}

export interface ItemFormData {
  name: string;
  quantity: number;
  unit: UnitType;
  categoryId?: number;
  departmentId: number;
}

export interface ItemFormDialogProps {
  open: boolean;
  item: Item | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetCategory: boolean;
  canGetDepartment: boolean;
}

export interface ItemsTableProps {
  items: Item[];
  canEditItem: boolean;
  canDeleteItem: boolean;
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
}
