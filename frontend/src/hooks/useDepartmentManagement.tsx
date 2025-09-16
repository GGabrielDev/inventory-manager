import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Department, DepartmentFilterOptions, PaginatedResponse } from '@/types';

export const useDepartmentManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch departments with useCallback to prevent unnecessary re-renders
  const fetchDepartments = useCallback(async (options: Partial<DepartmentFilterOptions> = {}) => {
    setLoading(true);
    setError('');
    
    const params = new URLSearchParams({
      page: (options.page || page).toString(),
      pageSize: (options.pageSize || 10).toString(),
    });

    if (options.name) {
      params.append('name', options.name);
    }
    if (options.sortBy) {
      params.append('sortBy', options.sortBy);
    }
    if (options.sortOrder) {
      params.append('sortOrder', options.sortOrder);
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch departments');
      }
      const data: PaginatedResponse<Department> = await response.json();
      
      setDepartments(data.data || []);
      setTotalPages(data.totalPages || 1);
      
      const currentPage = options.page || page;
      if (currentPage > data.totalPages && data.totalPages > 0) {
        setPage(1);
      }
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  // Fetch individual department
  const fetchDepartmentById = useCallback(async (departmentId: number): Promise<Department | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/${departmentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch department details');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return null;
    }
  }, [token]);

  // Create department
  const createDepartment = useCallback(async (departmentData: { name: string }): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(departmentData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create department');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Update department
  const updateDepartment = useCallback(async (departmentId: number, departmentData: { name: string }): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/${departmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(departmentData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update department');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Delete department
  const deleteDepartment = useCallback(async (departmentId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/${departmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete department');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  return {
    departments,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchDepartments,
    fetchDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
