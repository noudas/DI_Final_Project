import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { Worker } from '../../types/types';

// Async Thunk for fetching workers
export const fetchWorkers = createAsyncThunk('workers/fetchWorkers', async () => {
  const response = await apiClient.get<Worker[]>('/workers');
  return response.data;
});

// Async Thunk for worker login
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

// Async Thunk for worker logout
export const logoutWorker = createAsyncThunk(
  'workers/logoutWorker',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/workers/logout');
      return response.data; // success message
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
  }
);

// RegisterUserData to match the registration form including Worker attributes
enum WorkerRole {
  Nutritionist = 'nutritionist',
  Psychologist = 'psychologist',
}

interface RegisterWorkerData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: WorkerRole;
  specialty: string;
  experienceYears?: number;
}

// Async Thunk for worker registration
export const registerWorker = createAsyncThunk(
  'workers/registerWorker',
  async (
    workerData: RegisterWorkerData,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<{ message: string }>('/workers/register', workerData);
      return response.data; // Return success message
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
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
      // Fetch workers thunks
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
        state.error = action.error.message || 'Failed to fetch workers';
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
      })

      // Logout worker thunks
      .addCase(logoutWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutWorker.fulfilled, (state) => {
        state.loading = false;
        state.token = null; // Clear token on successful logout
      })
      .addCase(logoutWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register worker thunks
      .addCase(registerWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWorker.fulfilled, (state) => {
        state.loading = false;
        state.error = null; // reset error if registration is successful
      })
      .addCase(registerWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default workerSlice.reducer;
