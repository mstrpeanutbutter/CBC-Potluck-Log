export enum Category {
  MAIN = 'Main',
  APPETIZER = 'Appetizer',
  SIDE = 'Side',
  DESSERT = 'Dessert',
  BEVERAGE = 'Beverage',
  POTATO = 'Potato',
  BREAD = 'Bread',
}

export interface Dish {
  id: number;
  dishName: string;
  personName: string;
  allergens: string;
  category: Category;
  imageUrl?: string;
  extras?: string;
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
}