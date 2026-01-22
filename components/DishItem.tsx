
import React from 'react';
import { Dish } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DishItemProps {
  dish: Dish;
  currentUserId: string;
  isAdmin: boolean;
  isPotluckLocked: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const DishItem: React.FC<DishItemProps> = ({ dish, currentUserId, isAdmin, isPotluckLocked, onEdit, onDelete }) => {
  const categoryColor = CATEGORY_COLORS[dish.category];
  
  // Rule: Admins can always modify. Users can modify their own dish ONLY if potluck is not locked.
  const canModify = isAdmin || (dish.userId === currentUserId && !isPotluckLocked);

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
          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
              <span>Brought by:</span>
              <span className="font-bold text-gray-700">{dish.personName}</span>
              {dish.userDietaryRestrictions && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1 ${dish.isDietaryRestrictionSerious ? 'bg-red-600 text-white border-red-700 shadow-sm animate-pulse-subtle' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {dish.isDietaryRestrictionSerious && <span role="img" aria-label="serious" title="EXTRA serious">💀</span>}
                    ({dish.userDietaryRestrictions})
                  </span>
              )}
              {dish.hasPlusOne && (
                  <span className="font-medium text-green-600"> + {dish.plusOneName || 'Plus One'}</span>
              )}
          </div>
          {dish.allergens && (
            <p className="text-sm text-yellow-800 mt-2 bg-yellow-50/50 px-2 py-1 rounded border border-yellow-100/50">
              <span className="font-semibold">Dish Allergens:</span> {dish.allergens}
            </p>
          )}
          {dish.extras && (
            <p className="text-sm text-indigo-700 mt-1">
              <span className="font-semibold">Extras:</span> {dish.extras}
            </p>
          )}
          {dish.isParticipatingInCookieSwap && (
            <p className="text-sm text-yellow-700 mt-2 bg-yellow-50 inline-block px-2 py-1 rounded border border-yellow-200 shadow-sm">
                🍪 <span className="font-semibold">CBC Holiday Cookie Swap:</span> {dish.cookieSwapDescription || 'Participating'}
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
          {isPotluckLocked && !isAdmin && dish.userId === currentUserId && (
              <span className="text-[10px] text-gray-400 italic flex items-center gap-1">
                  <span>🔒</span> Read-only (Archived)
              </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishItem;
