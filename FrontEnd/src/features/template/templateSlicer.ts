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

// Async Thunk for updating a template
export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async (templateData: Template, { rejectWithValue }) => {
    console.log('Updating template:', templateData);
    
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

      console.log('Sending update data:', updateData);

      const response = await apiClient.put<Template>(`/templates/${templateData._id}`, updateData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating template:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error config:', error.config);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




// Async Thunk for removing a template
export const removeTemplate = createAsyncThunk(
  'templates/removeTemplate',
  async (templateId: string, { rejectWithValue }) => {
    console.log('Removing template:', templateId);

    // Ensure the templateId is a valid MongoDB ObjectId
    if (!templateId || typeof templateId !== 'string' || templateId.length !== 24) {
      console.error('Invalid or missing Template ID');
      return rejectWithValue('Invalid or missing Template ID');
    }

    try {
      const response = await apiClient.delete(`/templates/${templateId}`);
      console.log('Delete response:', response.data);
      
      // Accept both 200 and 204 status codes as successful responses
      if ([200, 204].includes(response.status)) {
        console.log(`Template ${templateId} successfully deleted`);
        return templateId; // Return templateId to handle removal in state
      } else {
        console.error('Unexpected delete response status:', response.status);
        throw new Error(`Deletion failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error removing template:', error.response?.data || error.message);
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
      // Fetch templates thunks
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
      })

      // Update template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        // Find the template that needs to be updated and update it in state
        const index = state.templates.findIndex((template) => template.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update template';
      })

      // Remove template
      .addCase(removeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTemplate.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the removed template by its ID
        state.templates = state.templates.filter((template) => template.id !== action.payload);
      })
      .addCase(removeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to remove template';
      });
  },
});


export default templateSlice.reducer;
