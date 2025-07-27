import { createAsyncThunk,createSlice } from '@reduxjs/toolkit';

import type { RootState } from '.';

// Token cache key
const TOKEN_CACHE_KEY = 'inventory-app-auth-token';

// Get cached token
const getCachedToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_CACHE_KEY);
  } catch {
    return null;
  }
};

// Cache token
const setCachedToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_CACHE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_CACHE_KEY);
    }
  } catch {
    // Silently fail if localStorage is not available
  }
};

// Define types for our auth state
interface User {
  id: number;
  username: string;
  roles: {
    id: number;
    name: string;
    permissions: {
      id: number;
      name: string;
      description: string;
    }[];
  }[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: getCachedToken(),
  user: null,
  status: 'idle',
  error: null,
};

// Thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      return data.token;
    } catch (error: Error | unknown) {
      if (error instanceof Error) 
        return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching current user details (permissions, etc.)
export const fetchUser = createAsyncThunk<
  User,
  number, // userId
  { state: RootState; rejectValue: string }
  >(
  'auth/fetchUser',
  async (userId: number, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      return data;
    } catch (error: Error | unknown) {
      if (error instanceof Error) 
        return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      setCachedToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload;
        setCachedToken(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
