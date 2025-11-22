
import React from 'react';
import { Dish, Category } from '../types';
import { CATEGORY_SORT_ORDER } from '../constants';

interface CategoryChartProps {
  dishes: Dish[];
}

// Hex codes corresponding to Tailwind-ish colors (400/500 shade) for better chart visibility
const CHART_COLORS: Record<Category, string> = {
  [Category.MAIN]: '#f87171',     // red-400
  [Category.APPETIZER]: '#facc15', // yellow-400
  [Category.SIDE]: '#4ade80',      // green-400
  [Category.DESSERT]: '#f472b6',   // pink-400
  [Category.BEVERAGE]: '#60a5fa',  // blue-400
  [Category.POTATO]: '#fb923c',    // orange-400
  [Category.BREAD]: '#fbbf24',     // amber-400
  [Category.DINNERWARE]: '#c084fc', // purple-400
};

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

  const totalDishes = dishes.length;
  
  const categoryCounts = dishes.reduce((acc, dish) => {
    acc[dish.category] = (acc[dish.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter categories that have at least one dish and sort them based on constant order
  const activeCategories = CATEGORY_SORT_ORDER.filter(category => (categoryCounts[category] || 0) > 0);

  // Build the conic gradient string
  let currentAngle = 0;
  const gradientSegments = activeCategories.map(category => {
    const count = categoryCounts[category];
    const degrees = (count / totalDishes) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + degrees;
    currentAngle = endAngle;
    
    const color = CHART_COLORS[category as Category] || '#cbd5e1'; // Default to slate-300 if unknown
    return `${color} ${startAngle}deg ${endAngle}deg`;
  });

  const conicGradient = `conic-gradient(${gradientSegments.join(', ')})`;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Category Breakdown</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
        {/* Pie Chart Container (Literal Pie Style) */}
        <div className="relative drop-shadow-xl transform hover:scale-105 transition-transform duration-500 ease-out">
            {/* Pie Tin */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gray-300 p-1 shadow-lg bg-gradient-to-b from-gray-200 to-gray-400 flex items-center justify-center">
                {/* Pie Crust */}
                <div className="w-full h-full rounded-full bg-[#f0d5a8] p-3 sm:p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] border-2 border-[#e0c090] flex items-center justify-center relative box-border">
                    {/* Decorative Crust Crimps */}
                    <div className="absolute inset-0.5 rounded-full border-[6px] border-dashed border-[#e6c9a2] opacity-60 pointer-events-none"></div>
                    
                    {/* The Filling (Chart) */}
                    <div 
                        className="w-full h-full rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.25)] relative overflow-hidden border border-black/5"
                        style={{ background: conicGradient }}
                        role="img"
                        aria-label="Pie chart showing category distribution"
                    >
                        {/* Shine/Gloss effect */}
                         <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none mix-blend-overlay"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Legend */}
        <div className="flex-grow max-w-lg w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {activeCategories.map(category => {
                    const count = categoryCounts[category];
                    const percentage = Math.round((count / totalDishes) * 100);
                    const color = CHART_COLORS[category as Category];

                    return (
                        <div key={category} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <span 
                                className="w-4 h-4 rounded-full ring-2 ring-offset-1 ring-gray-50 flex-shrink-0 shadow-sm" 
                                style={{ backgroundColor: color }}
                            />
                            <div className="flex justify-between w-full text-sm items-baseline">
                                <span className="text-gray-700 font-medium truncate mr-2" title={category}>{category}</span>
                                <span className="text-gray-500 whitespace-nowrap font-mono text-xs">
                                    {count} ({percentage}%)
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
