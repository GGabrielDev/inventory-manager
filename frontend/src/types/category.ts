import type { Item } from './item';

export interface Category {
  id: number;
  name: string;
  creationDate: string;
  updatedOn: string;
  deletionDate?: string;
  items?: Item[];
}

export interface CategoryFormData {
  name: string;
}

export interface CategoryFormDialogProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
}

export interface CategoriesTableProps {
  categories: Category[];
  canEditCategory: boolean;
  canDeleteCategory: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}
