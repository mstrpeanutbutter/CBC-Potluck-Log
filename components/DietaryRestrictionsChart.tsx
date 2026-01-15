
import React from 'react';
import { Dish } from '../types';

interface DietaryRestrictionsChartProps {
  dishes: Dish[];
}

const DietaryRestrictionsChart: React.FC<DietaryRestrictionsChartProps> = ({ dishes }) => {
  // Map to track unique user-provided restriction strings and their seriousness
  const userRestrictionsMap = new Map<string, { text: string; serious: boolean }>();
  
  dishes.forEach(dish => {
    const userId = dish.userId || dish.personName;
    if (dish.userDietaryRestrictions && !userRestrictionsMap.has(userId)) {
      userRestrictionsMap.set(userId, {
        text: dish.userDietaryRestrictions,
        serious: !!dish.isDietaryRestrictionSerious
      });
    }
  });

  const restrictionCounts: Record<string, number> = {};
  const restrictionSeriousness: Record<string, boolean> = {};

  userRestrictionsMap.forEach(({ text, serious }) => {
    // Split by comma, semi-colon, or 'and'
    const parts = text.split(/[,;&]|\band\b/i);
    parts.forEach(p => {
      const trimmed = p.trim().toLowerCase();
      if (trimmed && trimmed !== 'n/a' && trimmed !== 'none') {
        // Capitalize first letter for display consistency
        const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        
        restrictionCounts[capitalized] = (restrictionCounts[capitalized] || 0) + 1;
        
        // If any user considers this specific restriction "serious", mark it as such for the whole community
        if (serious) {
          restrictionSeriousness[capitalized] = true;
        }
      }
    });
  });

  const sortedRestrictions = Object.entries(restrictionCounts).sort((a, b) => {
    // Sort primarily by seriousness, then by count
    const seriousA = restrictionSeriousness[a[0]] ? 1 : 0;
    const seriousB = restrictionSeriousness[b[0]] ? 1 : 0;
    if (seriousA !== seriousB) return seriousB - seriousA;
    return b[1] - a[1];
  });

  if (sortedRestrictions.length === 0) {
    return null;
  }

  const maxCount = Math.max(...Object.values(restrictionCounts));

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8 border border-red-50">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" role="img" aria-label="warning">⚠️</span>
        <h2 className="text-2xl font-semibold text-gray-700">Community Allergies & Restrictions</h2>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium bg-gray-50/80 p-4 rounded-lg border border-gray-100 italic">
        The only strict rule is that all dishes must be <span className="text-green-600 font-bold">100% vegan</span>, but if any easy substitutions can be made it would be appreciated.
      </p>
      
      <div className="space-y-5">
        {sortedRestrictions.map(([name, count]) => {
          const percentage = (count / maxCount) * 100;
          const isSerious = restrictionSeriousness[name];
          
          return (
            <div key={name} className="group">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  {isSerious && (
                    <span 
                      className="text-lg animate-pulse" 
                      role="img" 
                      aria-label="serious" 
                      title="EXTRA serious"
                    >
                      💀
                    </span>
                  )}
                  <span className={`text-sm font-bold transition-colors ${isSerious ? 'text-red-700' : 'text-gray-700'}`}>
                    {name}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isSerious ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {count} {count === 1 ? 'person' : 'people'}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden shadow-inner border border-gray-200/50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                    isSerious ? 'bg-red-500' : 'bg-yellow-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DietaryRestrictionsChart;
