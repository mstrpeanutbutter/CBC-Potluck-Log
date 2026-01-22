
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

export interface PersonalAllergen {
  name: string;
  isSerious: boolean;
}

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
  personalAllergens: PersonalAllergen[];
  isDietaryRestrictionSerious: boolean; // Retained as a global flag for "any serious" or overall status
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

export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  userName: string;
  action: 'added' | 'deleted' | 'modified' | 'joined_waitlist' | 'left_waitlist' | 'promoted';
  details: string;
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
