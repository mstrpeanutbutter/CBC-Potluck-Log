
export enum Category {
  MAIN = 'Main',
  APPETIZER = 'Appetizer',
  SIDE = 'Side',
  DESSERT = 'Dessert',
  BEVERAGE = 'Beverage',
  POTATO = 'Potato',
  BREAD = 'Bread',
  DINNERWARE = 'Plates/Bowls/Cups/Etc',
}

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface Dish {
  id: number;
  dishName: string;
  personName: string;
  allergens: string;
  category: Category;
  imageUrl?: string;
  extras?: string;
  userId?: string; // ID of the user who created the dish
}

export interface Potluck {
  id: number;
  name: string;
  dishes: Dish[];
  bookTheme?: string;
  host?: string;
  neighborhood?: string;
  date?: string;
  time?: string;
  dishCap?: number;
}
