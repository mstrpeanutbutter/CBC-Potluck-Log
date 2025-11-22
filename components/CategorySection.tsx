import React, { useState } from 'react';
import { Dish, Category } from '../types';
import DishItem from './DishItem';
import { CATEGORY_COLORS } from '../constants';

interface CategorySectionProps {
  category: Category;
  dishes: Dish[];
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
}

const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg 
    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);


const CategorySection: React.FC<CategorySectionProps> = ({ category, dishes, currentUserId, isAdmin, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const categoryColorClasses = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  const headerBgClass = categoryColorClasses.split(' ')[0].replace('bg-', 'bg-') + '/20';


  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-4 text-left font-semibold text-lg transition-colors ${isOpen ? 'border-b border-gray-200' : ''} ${headerBgClass} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
        aria-expanded={isOpen}
        aria-controls={`category-section-${category.replace(/\s+/g, '-')}`}
      >
        <span>{category} ({dishes.length})</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div id={`category-section-${category.replace(/\s+/g, '-')}`} className="p-4 space-y-4 bg-white">
          {dishes.map(dish => (
            <DishItem
              key={dish.id}
              dish={dish}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onEdit={() => onEdit(dish)}
              onDelete={() => onDelete(dish.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;