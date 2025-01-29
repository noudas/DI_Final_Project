import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { Template } from '../../types/types';

// Async Thunks
export const fetchTemplates = createAsyncThunk('templates/fetchTemplates', async () => {
  const response = await apiClient.get<Template[]>('/templates');
  return response.data;
});

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Template>('/templates', templateData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating template:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async (templateData: Template, { rejectWithValue }) => {
    if (!templateData._id) {
      console.error('Template ID is required for update');
      return rejectWithValue('Template ID is required for update');
    }

    try {
      const updateData = {
        ...(templateData.title && { title: templateData.title }),
        ...(templateData.workerName && { workerName: templateData.workerName }),
        ...(templateData.content && { content: templateData.content }),
        ...(templateData.shared !== undefined && { shared: templateData.shared }),
        ...(templateData.categoryId && { categoryId: templateData.categoryId })
      };

      const response = await apiClient.put<Template>(`/templates/${templateData._id}`, updateData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating template:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeTemplate = createAsyncThunk(
  'templates/removeTemplate',
  async (templateId: string, { rejectWithValue }) => {
    if (!templateId || typeof templateId !== 'string' || templateId.length !== 24) {
      console.error('Invalid or missing Template ID');
      return rejectWithValue('Invalid or missing Template ID');
    }

    try {
      const response = await apiClient.delete(`/templates/${templateId}`);
      if ([200, 204].includes(response.status)) {
        return templateId;
      } else {
        throw new Error(`Deletion failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error removing template:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
interface TemplateState {
  templates: Template[];
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  loading: false,
  error: null,
};

// Slice
const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    resetForm: (state) => {
      state.loading = false;
      state.error = null;
      state.templates = [];
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message || 'Failed to fetch templates';
      })
      
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create template';
      })

      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex((template) => template._id === action.payload._id);
        if (index !== -1) {
          state.templates[index] = { ...state.templates[index], ...action.payload };
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update template';
      })

      .addCase(removeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter((template) => template._id !== action.payload);
      })      
      .addCase(removeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to remove template';
      })

      // Add resetForm case
      .addCase('templates/resetForm', (state) => {
        state.loading = false;
        state.error = null;
        state.templates = [];
      });
  },
});

export default templateSlice.reducer;
