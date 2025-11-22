import React from 'react';
import { Dish } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DishItemProps {
  dish: Dish;
  currentUserId: string;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const DishItem: React.FC<DishItemProps> = ({ dish, currentUserId, isAdmin, onEdit, onDelete }) => {
  const categoryColor = CATEGORY_COLORS[dish.category];

  // Permission Logic:
  // 1. Admin can edit anything.
  // 2. Users can edit their own dishes (matching userId).
  const canModify = isAdmin || (dish.userId === currentUserId);

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 transition-shadow hover:shadow-md bg-gray-50/50">
      {dish.imageUrl && (
        <img 
          src={dish.imageUrl} 
          alt={dish.dishName} 
          className="w-full sm:w-24 sm:h-24 h-48 object-cover rounded-md flex-shrink-0 border border-gray-100"
          aria-hidden="true" 
        />
      )}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{dish.dishName}</h3>
          <p className="text-sm text-gray-500">Brought by: <span className="font-medium text-gray-600">{dish.personName}</span></p>
          {dish.allergens && (
            <p className="text-sm text-yellow-700 mt-1">
              <span className="font-semibold">Allergens:</span> {dish.allergens}
            </p>
          )}
          {dish.extras && (
            <p className="text-sm text-indigo-700 mt-1">
              <span className="font-semibold">Extras:</span> {dish.extras}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${categoryColor}`}>
              {dish.category}
          </span>
          
          {canModify && (
            <div className="flex items-center gap-3">
                <button onClick={onEdit} aria-label={`Edit ${dish.dishName}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
                <button onClick={onDelete} aria-label={`Delete ${dish.dishName}`} className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishItem;