import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { Item, ItemFilterOptions, ItemFormData, PaginatedResponse } from '@/types';

export const useItemManagement = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch items with useCallback to prevent unnecessary re-renders
  const fetchItems = useCallback(async (options: Partial<ItemFilterOptions> = {}) => {
    setLoading(true);
    setError('');
    
    const params = new URLSearchParams({
      page: (options.page || page).toString(),
      pageSize: (options.pageSize || 10).toString(),
    });

    if (options.name) {
      params.append('name', options.name);
    }
    if (options.categoryId) {
      params.append('categoryId', options.categoryId.toString());
    }
    if (options.departmentId) {
      params.append('departmentId', options.departmentId.toString());
    }
    if (options.unit) {
      params.append('unit', options.unit);
    }
    if (options.sortBy) {
      params.append('sortBy', options.sortBy);
    }
    if (options.sortOrder) {
      params.append('sortOrder', options.sortOrder);
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch items');
      }
      const data: PaginatedResponse<Item> = await response.json();
      
      setItems(data.data || []);
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

  // Fetch individual item
  const fetchItemById = useCallback(async (itemId: number): Promise<Item | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/${itemId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch item details');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return null;
    }
  }, [token]);

  // Create item
  const createItem = useCallback(async (itemData: ItemFormData): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create item');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Update item
  const updateItem = useCallback(async (itemId: number, itemData: Partial<ItemFormData>): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update item');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  // Delete item
  const deleteItem = useCallback(async (itemId: number): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/${itemId}`,
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
        throw new Error(data.error || 'Failed to delete item');
      }

      return true;
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
      return false;
    }
  }, [token]);

  return {
    items,
    loading,
    error,
    page,
    totalPages,
    setPage,
    setError,
    fetchItems,
    fetchItemById,
    createItem,
    updateItem,
    deleteItem,
  };
};
