import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../app/store';
import { fetchTemplates, updateTemplate, removeTemplate } from '../../../../features/template/templateSlicer';

interface Props {
  selectedCategoryId?: string;
}

const ListTemplate: React.FC<Props> = ({ selectedCategoryId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { templates, loading, error } = useSelector((state: RootState) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleUpdate = (template: Template) => {
    // You can modify the template data here before dispatching the update action
    
    const updatedTemplate = { ...template, title: `${template.title} (Updated)` }; // Example modification
    dispatch(updateTemplate(updatedTemplate));
  };

  const handleRemove = (templateId: string) => {
    dispatch(removeTemplate(templateId));
  };

  return (
    <div>
      <h1>Templates</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {selectedCategoryId ? (
            templates
              .filter((template) => template.categoryId === selectedCategoryId)
              .map((template) => (
                <li key={template.id}>
                  <h3>
                    {template.title} - {template.workerName}
                  </h3>
                  <h4>Content:</h4>
                  <div className="template-content">
                    {Object.entries(template.content).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                        {Array.isArray(value) ? (
                          <ul>
                            {value.map((item) => (
                              <li key={item}>
                                {typeof item === 'string' ? item : JSON.stringify(item)}
                              </li>
                            ))}
                          </ul>
                        ) : typeof value === 'object' && value !== null ? (
                          <pre>{JSON.stringify(value, null, 2)}</pre>
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleUpdate(template)}>Update</button>
                  <button onClick={() => handleRemove(template._id)}>Remove</button>
                </li>
              ))
          ) : (
            <p>No templates selected.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ListTemplate;
