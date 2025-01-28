import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Template, ApiResponse } from '../../types/types';
import axios from 'axios';

interface TemplateState {
  templates: Template[];
  selectedTemplate: Template | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTemplates = createAsyncThunk<Template[], void>(
  'template/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<Template[]>>('/api/templates');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const createTemplate = createAsyncThunk<Template, Partial<Template>>(
  'template/createTemplate',
  async (newTemplate, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<Template>>('/api/templates', newTemplate);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create template');
    }
  }
);

export const updateTemplate = createAsyncThunk<Template, { id: string; data: Partial<Template> }>(
  'template/updateTemplate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<Template>>(`/api/templates/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);

export const deleteTemplate = createAsyncThunk<string, string>(
  'template/deleteTemplate',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/templates/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete template');
    }
  }
);

// Slice
const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    selectTemplate: (state, action: PayloadAction<string>) => {
      state.selectedTemplate = state.templates.find((template) => template.id === action.payload) || null;
    },
    clearSelection: (state) => {
      state.selectedTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action: PayloadAction<Template[]>) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTemplate.fulfilled, (state, action: PayloadAction<Template>) => {
        state.templates.push(action.payload);
      })
      .addCase(updateTemplate.fulfilled, (state, action: PayloadAction<Template>) => {
        const index = state.templates.findIndex((template) => template.id === action.payload.id);
        if (index >= 0) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(deleteTemplate.fulfilled, (state, action: PayloadAction<string>) => {
        state.templates = state.templates.filter((template) => template.id !== action.payload);
      });
  },
});

export const { selectTemplate, clearSelection } = templateSlice.actions;
export default templateSlice.reducer;
