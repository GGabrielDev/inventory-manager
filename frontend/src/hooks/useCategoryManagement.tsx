import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Category, CategoryFilterOptions, PaginatedResponse } from '@/types';

export const useCategoryManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories with useCallback to prevent unnecessary re-renders
  const fetchCategories = useCallback(async (options: Partial<CategoryFilterOptions> = {}) => {
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
        `${import.meta.env.VITE_API_URL}/categories?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      const data: PaginatedResponse<Category> = await response.json();
      
      setCategories(data.data || []);
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

  // Fetch individual category
  const fetchCategoryById = useCallback(async (categoryId: number): Promise<Category | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch category details');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return null;
    }
  }, [token]);

  // Create category
  const createCategory = useCallback(async (categoryData: { name: string }): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create category');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Update category
  const updateCategory = useCallback(async (categoryId: number, categoryData: { name: string }): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update category');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Delete category
  const deleteCategory = useCallback(async (categoryId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
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
        throw new Error(data.error || 'Failed to delete category');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  return {
    categories,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
