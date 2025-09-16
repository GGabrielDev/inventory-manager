// API filter options

import type { UnitType } from './common';

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
