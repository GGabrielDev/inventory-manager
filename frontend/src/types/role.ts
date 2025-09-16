import type { Permission } from './permission';

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface RoleFormData {
  name: string;
  description: string;
  selectedPermissions: number[];
}

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
