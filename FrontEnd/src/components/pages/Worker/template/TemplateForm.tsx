import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../generics/Button';
import { Input } from '../../../generics/Input';
import { Label } from '../../../generics/Label';
import { AppDispatch, RootState } from '../../../../app/store';
import { createTemplate } from '../../../../features/template/templateSlicer';
import { fetchCategories } from '../../../../features/categories/categoriesSlice';
import { fetchWorkers } from '../../../../features/worker/workerSlicer';

// Define the shape of the form data
interface TemplateFormState {
  title: string;
  workerName: string;
  createdBy: string;
  content: string;
  shared: boolean;
  categoryId?: string;
}

// Initial form state
const initialFormState: TemplateFormState = {
  title: '',
  workerName: '',
  createdBy: '',
  content: '',
  shared: false,
  categoryId: undefined,
};

export const TemplateForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formState, setFormState] = useState<TemplateFormState>(initialFormState);
  const [isWorkersLoaded, setIsWorkersLoaded] = useState(false);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const workers = useSelector((state: RootState) => state.workers.workers);
  const loading = useSelector((state: RootState) => state.templates.loading);

  // Fetch categories and workers on component mount
  useEffect(() => {
    console.log('Fetching data...');
    dispatch(fetchCategories())
      .then(() => {
        console.log('Categories fetched');
        return dispatch(fetchWorkers());
      })
      .then(() => setIsWorkersLoaded(true))
      .catch(error => {
        console.error('Failed to fetch data:', error);
        // Handle the error appropriately
      });
  }, [dispatch]);

  // Handle form field changes
  const handleInputChange = <T extends keyof TemplateFormState>(name: T, value: TemplateFormState[T]) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle worker selection
  const handleWorkerSelection = (workerFullName: string) => {
    console.log('Attempting to select worker with full name:', workerFullName);
    
    if (!workers || workers.length === 0) {
      console.log('No workers available');
      return;
    }

    const selectedWorker = workers.find((worker) => 
      `${worker.firstName} ${worker.lastName}`.toLowerCase() === workerFullName.toLowerCase()
    );
    if (selectedWorker) {
      setFormState((prevState) => ({
        ...prevState,
        workerName: `${selectedWorker.firstName} ${selectedWorker.lastName}`,
        createdBy: selectedWorker.id, // Use the actual ID here
      }));
      console.log('Selected Worker:', selectedWorker);
    } else {
      console.log('Selected worker not found:', workerFullName);
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submission:', formState);
    dispatch(createTemplate(formState));
    setFormState(initialFormState); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label<TemplateFormState> text="Title" htmlFor="title" required />
        <Input<TemplateFormState>
          label="Title"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label<TemplateFormState> text="Worker Name" htmlFor="workerName" required />
        {isWorkersLoaded ? (
          <select
            name="workerName"
            value={formState.workerName || ''}
            onChange={(e) => handleWorkerSelection(e.target.value)}
            required
          >
            <option value="">Select a worker</option>
            {workers.map((worker) => (
              <option key={worker.id} value={`${worker.firstName} ${worker.lastName}`}>
                {`${worker.firstName} ${worker.lastName}`}
              </option>
            ))}
          </select>
        ) : (
          <p>Loading workers...</p>
        )}
      </div>
      <div>
        <Label<TemplateFormState> text="Worker ID" htmlFor="createdBy" />
        <Input<TemplateFormState>
          label="Worker ID"
          name="createdBy"
          value={formState.createdBy || ''}
          onChange={() => {}}
          readOnly
        />
      </div>
      <div>
        <Label<TemplateFormState> text="Content" htmlFor="content" />
        <Input<TemplateFormState>
          label="Content"
          name="content"
          value={formState.content}
          onChange={handleInputChange}
          type="textarea"
        />
      </div>
      <div>
        <Label<TemplateFormState> text="Category" htmlFor="categoryId" />
        <select
          name="categoryId"
          value={formState.categoryId || ''}
          onChange={(e) => handleInputChange('categoryId', e.target.value || undefined)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label<TemplateFormState> text="Shared" htmlFor="shared" />
        <input
          type="checkbox"
          name="shared"
          checked={formState.shared}
          onChange={(e) => handleInputChange('shared', e.target.checked)}
        />
      </div>
      <Button text={loading ? 'Submitting...' : 'Submit'} type="submit" disabled={loading} />
    </form>
  );
};