import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, createCategory } from '../../../../features/categories/categoriesSlice';
import { RootState } from '../../../../app/store';
import { Category } from '../../../../types/types';

interface Props {
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoriesComponent: React.FC<Props> = ({ onSelectCategory }) => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector((state: RootState) => state.categories);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = event.target.value || null;
    console.log(selectedCategoryId);
    setSelectedCategory(selectedCategoryId); // Update state with selected ID
    onSelectCategory(selectedCategoryId);   // Pass selected ID to parent
  };
  

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      setIsSubmitting(true);
      const newCategory: Omit<Category, 'id'> = {
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
      };

      try {
        await dispatch(createCategory(newCategory)).unwrap();
        setNewCategoryName('');
        setNewCategoryDescription('');
      } catch (err) {
        console.error('Failed to create category:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      {/* Category selection dropdown */}
      <select value={selectedCategory || ''} onChange={handleCategoryChange}>
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category: Category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>


      {/* Form to add a new category */}
      <div>
        <h3>Add New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category Description (optional)"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
        />
        <button onClick={handleAddCategory} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </button>
      </div>

      {/* Loading and error messages */}
      {status === 'loading' && <p>Loading categories...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default CategoriesComponent;