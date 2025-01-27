import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { User } from '../../types/types';

// Async Thunk for fetching users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
});

// Async Thunk for user login
export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ token: string }>('/users/login', credentials);
      return response.data; // return token on success
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// Async Thunk for user registration
interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (
    userData: RegisterUserData,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<{ message: string }>('/users/register', userData);
      return response.data; // Return success message
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);


// Initial state
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  token: null,
};

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users thunks
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })


      // Login user thunks
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register user thunks
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle success, like showing a message
        state.error = null; // reset error if registration is successful
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
