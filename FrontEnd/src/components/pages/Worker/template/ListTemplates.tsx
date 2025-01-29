import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../app/store';
import { fetchTemplates, updateTemplate, removeTemplate } from '../../../../features/template/templateSlicer';

interface Props {
  selectedCategoryId?: string;
}

const ListTemplate: React.FC<Props> = ({ selectedCategoryId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { templates, loading, error } = useSelector((state: RootState) => state.templates);

  // Local state for tracking edited template
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Template | null>(null);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleEditClick = (template: Template) => {
    setEditingTemplateId(template._id);
    setEditedData({ ...template }); // Clone template to avoid mutating state directly
  };

  const handleInputChange = (key: string, value: any) => {
    if (editedData) {
      setEditedData((prev) => prev ? { ...prev, [key]: value } : prev);
    }
  };

  const handleContentChange = (key: string, value: any) => {
    if (editedData) {
      setEditedData((prev) => prev ? { ...prev, content: { ...prev.content, [key]: value } } : prev);
    }
  };

  const handleSave = () => {
    if (editedData) {
      dispatch(updateTemplate(editedData)); // Dispatch update
      dispatch(fetchTemplates());
      setEditingTemplateId(null); // Exit edit mode
    }
  };

  const handleRemove = (templateId: string) => {
    dispatch(removeTemplate(templateId));
    dispatch(fetchTemplates());
  };

  return (
    <div>
      <h1>Templates</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <ul>
            {selectedCategoryId ? (
              // Filter templates by selected category
              templates.filter((template) => template.categoryId === selectedCategoryId).length === 0 ? (
                // Show empty message when no templates found for the selected category
                <p>This category is empty.</p>
              ) : (
                templates
                  .filter((template) => template.categoryId === selectedCategoryId)
                  .map((template) => (
                    <li key={template._id}>
                      {editingTemplateId === template._id && editedData ? (
                        <>
                          <input
                            type="text"
                            value={editedData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                          />
                          <input
                            type="text"
                            value={editedData.workerName}
                            onChange={(e) => handleInputChange('workerName', e.target.value)}
                          />

                          <h4>Content:</h4>
                          <div className="template-content">
                            {Object.entries(editedData.content).map(([key, value]) => (
                              <div key={key}>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                <input
                                  type="text"
                                  value={String(value)}
                                  onChange={(e) => handleContentChange(key, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>

                          <button onClick={handleSave}>Save</button>
                          <button onClick={() => setEditingTemplateId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <h3>{template.title} - {template.workerName}</h3>

                          <h4>Content:</h4>
                          <div className="template-content">
                            {Object.entries(template.content).map(([key, value]) => (
                              <div key={key}>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}
                              </div>
                            ))}
                          </div>

                          <button onClick={() => handleEditClick(template)}>Edit</button>
                          <button onClick={() => handleRemove(template._id)}>Remove</button>
                        </>
                      )}
                    </li>
                  ))
              )
            ) : (
              <p>No templates selected.</p>
            )}
        </ul>
      )}
    </div>
  );
};

export default ListTemplate;