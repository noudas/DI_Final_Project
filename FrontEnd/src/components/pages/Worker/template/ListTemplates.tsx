import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../app/store';
import { fetchTemplates, deleteTemplate, selectTemplate } from '../../../../features/template/templateSlicer';

const ListTemplate: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { templates, selectedTemplate, loading, error } = useSelector((state: RootState) => state.template);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteTemplate(id));
  };

  return (
    <div>
      <h1>Templates</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            {template.title} - {template.workerName}
            <button onClick={() => dispatch(selectTemplate(template.id))}>Select</button>
            <button onClick={() => handleDelete(template.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedTemplate && <div>Selected Template: {selectedTemplate.title}</div>}
    </div>
  );
};

export default ListTemplate;
