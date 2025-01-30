import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../app/store";
import { fetchTemplates, updateTemplate, removeTemplate } from "../../../../features/template/templateSlicer";
import ExportToDocx from "./ExporttoDocx";
import { Template } from "../../../../types/types";

interface Props {
  selectedCategoryId?: string | null;
}

const ListTemplate: React.FC<Props> = ({ selectedCategoryId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { templates, loading, error } = useSelector((state: RootState) => state.templates);

  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Template | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleEditClick = (template: Template) => {
    setEditingTemplateId(template._id);
    setEditedData({ ...template });
  };

  const handleInputChange = (key: string, value: any) => {
    if (editedData) {
      setEditedData((prev) => (prev ? { ...prev, [key]: value } : prev));
    }
  };

  const handleContentChange = (key: string, value: any) => {
    if (editedData) {
      setEditedData((prev) => {
        if (prev) {
          if (typeof prev.content === 'object' && prev.content !== null) {
            return {
              ...prev,
              content: { ...prev.content, [key]: value }
            };
          } else {
            return prev;
          }
        }
        return prev;
      });
      
    }
  };

  const handleSave = () => {
    if (editedData) {
      dispatch(updateTemplate(editedData));
      dispatch(fetchTemplates());
      setEditingTemplateId(null);
    }
  };

  const handleRemove = (templateId: string) => {
    dispatch(removeTemplate(templateId));
    dispatch(fetchTemplates());
  };

  const handleAddToExport = (template: Template) => {
    // Ensure template is added only if it's not already in the selectedTemplates
    setSelectedTemplates((prev) => (prev.some((t) => t._id === template._id) ? prev : [...prev, template]));
  };

  const handleRemoveFromExport = (templateId: string) => {
    // Remove template by ID
    setSelectedTemplates((prev) => prev.filter((template) => template._id !== templateId));
  };

  return (
    <div>
      <h1>Templates</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {selectedCategoryId ? (
            templates.filter((template) => template.categoryId === selectedCategoryId).length === 0 ? (
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
                          onChange={(e) => handleInputChange("title", e.target.value)}
                        />
                        <input
                          type="text"
                          value={editedData.workerName}
                          onChange={(e) => handleInputChange("workerName", e.target.value)}
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
                        <h3>
                          {template.title} - {template.workerName}
                        </h3>

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
                        <button onClick={() => handleAddToExport(template)}>Add to Export</button>
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

      <ExportToDocx
        templates={selectedTemplates}
        onRemoveFromExport={handleRemoveFromExport}
      />
    </div>
  );
};

export default ListTemplate;
