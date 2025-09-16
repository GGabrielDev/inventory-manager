import type { Role } from './role';

export interface User {
  id: number;
  username: string;
  roles: Role[];
}

export interface UserFormData {
  username: string;
  password: string;
  selectedRoles: number[];
}

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
