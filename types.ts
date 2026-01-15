
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
  hasPlusOne?: boolean;
  plusOneName?: string;
  isParticipatingInCookieSwap?: boolean;
  cookieSwapDescription?: string;
  userDietaryRestrictions?: string;
  isDietaryRestrictionSerious?: boolean;
}

export interface WaitlistEntry {
  userId: string;
  name: string;
  timestamp: number;
}

export interface FirstInLineEntry extends WaitlistEntry {
  expiryTimestamp: number;
}

export interface Potluck {
  id: number;
  name: string;
  dishes: Dish[];
  waitlist?: WaitlistEntry[];
  firstInLine?: FirstInLineEntry | null;
  bookTheme?: string;
  host?: string;
  neighborhood?: string;
  date?: string;
  time?: string;
  dishCap?: number;
  enableCookieSwap?: boolean;
  buyBookLink?: string;
  authorWebsiteLink?: string;
  cplLink?: string;
}
