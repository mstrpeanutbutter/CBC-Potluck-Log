
import { Category } from './types';

export const CATEGORIES: Category[] = Object.values(Category);

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.MAIN]: 'bg-red-100 text-red-800 border-red-200',
  [Category.APPETIZER]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [Category.SIDE]: 'bg-green-100 text-green-800 border-green-200',
  [Category.DESSERT]: 'bg-pink-100 text-pink-800 border-pink-200',
  [Category.BEVERAGE]: 'bg-blue-100 text-blue-800 border-blue-200',
  [Category.POTATO]: 'bg-orange-100 text-orange-800 border-orange-200',
  [Category.BREAD]: 'bg-amber-100 text-amber-800 border-amber-200',
  [Category.DINNERWARE]: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const CATEGORY_SORT_ORDER: Category[] = [
  Category.APPETIZER,
  Category.MAIN,
  Category.SIDE,
  Category.BREAD,
  Category.DESSERT,
  Category.BEVERAGE,
  Category.POTATO,
  Category.DINNERWARE,
];
