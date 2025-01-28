import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { Template } from '../../types/types';

// Async Thunk for fetching users
export const fetchTemplates = createAsyncThunk('templates/fetchTemplates', async () => {
  const response = await apiClient.get<Template[]>('/templates');
  return response.data;
});

// Async Thunk for user registration
type TemplateContent = string | Record<string, any>;

interface RegisterTemplateData {
    title: string;
    workerName: string;
    createdBy: string;
    content: TemplateContent;
    shared: boolean;
    categoryId?: string | null;
}


// Initial state
interface TemplateState {
  templates: Template[];
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: TemplateState = {
  templates: [],
  loading: false,
  error: null,
  token: null,
};

// Slice
const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users thunks
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default templateSlice.reducer;
