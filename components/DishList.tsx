
import React from 'react';
import { Dish, Category } from '../types';
import CategorySection from './CategorySection';
import { CATEGORY_SORT_ORDER } from '../constants';

interface DishListProps {
  dishes: Dish[];
  currentUserId: string;
  isAdmin: boolean;
  isPotluckLocked: boolean;
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
}

const DishList: React.FC<DishListProps> = ({ dishes, currentUserId, isAdmin, isPotluckLocked, onEdit, onDelete }) => {
  const groupedDishes = dishes.reduce((acc, dish) => {
    const category = dish.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {} as Record<Category, Dish[]>);

  const sortedCategories = (Object.keys(groupedDishes) as Category[]).sort((a, b) => {
    const indexA = CATEGORY_SORT_ORDER.indexOf(a);
    const indexB = CATEGORY_SORT_ORDER.indexOf(b);
    return indexA - indexB;
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Potluck Dishes</h2>
      {dishes.length > 0 ? (
        <div className="space-y-6">
          {sortedCategories.map(category => (
            <CategorySection
              key={category}
              category={category}
              dishes={groupedDishes[category]}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              isPotluckLocked={isPotluckLocked}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">No dishes added yet. Be the first to bring something delicious!</p>
        </div>
      )}
    </div>
  );
};

export default DishList;
