// Common/shared types

export const UnitType = {
  UND: 'und.',
  KG: 'kg',
  L: 'l',
  M: 'm',
} as const;

export type UnitType = keyof typeof UnitType;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}
