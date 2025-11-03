import React from 'react';
import { Dish } from '../types';
import { CATEGORY_COLORS, CATEGORY_SORT_ORDER } from '../constants';

interface CategoryChartProps {
  dishes: Dish[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ dishes }) => {
  if (dishes.length === 0) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Category Breakdown</h2>
        <div className="text-center py-6 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">No dishes yet to display in the chart.</p>
        </div>
      </div>
    );
  }

  const categoryCounts = dishes.reduce((acc, dish) => {
    acc[dish.category] = (acc[dish.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(...Object.values(categoryCounts), 1); // Avoid division by zero

  const sortedCategories = CATEGORY_SORT_ORDER.filter(category => categoryCounts[category] > 0);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Category Breakdown</h2>
      <div className="space-y-4">
        {sortedCategories.map(category => {
          const count = categoryCounts[category];
          const widthPercentage = (count / maxCount) * 100;
          const colorClasses = CATEGORY_COLORS[category];
          // Extract just the bg-color for the bar
          const bgColor = colorClasses.split(' ').find(c => c.startsWith('bg-')) || 'bg-gray-200';
          const textColor = colorClasses.split(' ').find(c => c.startsWith('text-')) || 'text-gray-800';


          return (
            <div key={category} className="flex items-center gap-4 group">
              <span className="w-24 text-sm font-medium text-gray-600 text-right shrink-0">{category}</span>
              <div className="flex-grow bg-gray-100 rounded-full h-6 overflow-hidden">
                 <div
                  className={`h-full rounded-full ${bgColor} flex items-center justify-end px-2 transition-all duration-500 ease-out`}
                  style={{ width: `${widthPercentage}%` }}
                >
                   <span className={`text-sm font-bold ${textColor}`}>
                     {count}
                   </span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
