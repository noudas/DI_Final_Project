import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { Template } from '../../types/types';

// Async Thunk for fetching users
export const fetchTemplates = createAsyncThunk('templates/fetchTemplates', async () => {
  const response = await apiClient.get<Template[]>('/templates');
  return response.data;
});

// Async Thunk for Template registration
type TemplateContent = string | Record<string, any>;

interface RegisterTemplateData {
    title: string;
    workerName: string;
    createdBy: string;
    content: TemplateContent;
    shared: boolean;
    categoryId?: string | null;
}


export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData: RegisterTemplateData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Template>('/templates', templateData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating template:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


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
      })
      
      // Create template
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload); // Add new template to the state
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create template';
      });
  },
});

export default templateSlice.reducer;
