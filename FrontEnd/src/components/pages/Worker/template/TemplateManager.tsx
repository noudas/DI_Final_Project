import React, { useState } from 'react';
import CategoriesComponent from './CategoriesComponent';
import ListTemplate from './ListTemplates';
import WorkerNavbar from '../../../Navbar/WorkerNavbar';

const TemplateManager: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div>
      <h1>Template Manager</h1>
      <WorkerNavbar/>
      <CategoriesComponent onSelectCategory={handleCategorySelect} />
      <ListTemplate selectedCategoryId={selectedCategoryId} />
    </div>
  );
};

export default TemplateManager;
