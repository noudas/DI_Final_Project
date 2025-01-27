import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { Worker } from '../../types/types';

// Async Thunk for fetching users
export const fetchWorkers = createAsyncThunk('workers/fetchWorkers', async () => {
  const response = await apiClient.get<Worker[]>('/workers');
  return response.data;
});

// Async Thunk for user login
export const loginWorker = createAsyncThunk(
  'workers/loginWorker',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ token: string }>('/workers/login', credentials);
      return response.data; // return token on success
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// Initial state
interface WorkerState {
    workers: Worker[];
    loading: boolean;
    error: string | null;
    token: string | null;
}

const initialState: WorkerState = {
    workers: [],
    loading: false,
    error: null,
    token: null,
};

// Slice
const workerSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users thunks
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })


      // Login worker thunks
      .addCase(loginWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default workerSlice.reducer;
