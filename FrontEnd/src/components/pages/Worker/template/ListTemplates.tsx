import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../app/store';
import { fetchTemplates } from '../../../../features/template/templateSlicer';

const ListTemplate: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { templates, loading, error } = useSelector((state: RootState) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  console.log('Templates state:', templates);

  return (
    <div>
      <h1>Templates</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              {template.title} - {template.workerName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListTemplate;
