// Centralized type definitions for the application

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[] | [];
}

export interface User {
  id: number;
  username: string;
  roles: Role[] | [];
}

// New entity types
export interface Department {
  id: number;
  name: string;
  creationDate: string;
  updatedOn: string;
  deletionDate?: string;
  items?: Item[];
}

export interface Category {
  id: number;
  name: string;
  creationDate: string;
  updatedOn: string;
  deletionDate?: string;
  items?: Item[];
}

export enum UnitType {
  UND = 'und.',
  KG = 'kg',
  L = 'l',
  M = 'm',
}

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

// Auth-related types
export interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Component Props types
export interface RoleFormDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetPermission: boolean;
}

export interface RolesTableProps {
  roles: Role[];
  canEditRole: boolean;
  canDeleteRole: boolean;
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
}

// Department-related types
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

// Category-related types
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

// Item-related types
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

// Form data types
export interface RoleFormData {
  name: string;
  description: string;
  selectedPermissions: number[];
}

export interface DepartmentFormData {
  name: string;
}

export interface CategoryFormData {
  name: string;
}

export interface ItemFormData {
  name: string;
  quantity: number;
  unit: UnitType;
  categoryId?: number;
  departmentId: number;
}

// Login credentials type
export interface LoginCredentials {
  username: string;
  password: string;
}

// User-related types
export interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
  canEdit: boolean;
  canCreate: boolean;
  canGetRole: boolean;
}

export interface UsersTableProps {
  users: User[];
  canEditUser: boolean;
  canDeleteUser: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

export interface UserFormData {
  username: string;
  password: string;
  selectedRoles: number[];
}

// Filter options for API
export interface UserFilterOptions {
  page: number;
  pageSize: number;
  username?: string;
  sortBy?: 'username' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}

export interface DepartmentFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CategoryFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  sortBy?: 'name' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ItemFilterOptions {
  page: number;
  pageSize: number;
  name?: string;
  categoryId?: number;
  departmentId?: number;
  unit?: UnitType;
  sortBy?: 'name' | 'quantity' | 'creationDate' | 'updatedOn';
  sortOrder?: 'ASC' | 'DESC';
}
