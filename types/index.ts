export interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  preparationTime: number;
  instructions: string[];
  tags: string[];
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: string[];
  allergies: string[];
  customRestrictions: string[];
  favoriteRecipes: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  confidence: number;
}

export type ScanResult = {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
};

export type TDietaryPreference = {
  id: string;
  name: string;
  selected: boolean;
  icon?: string;
};

export type TAllergy = {
  id: string;
  name: string;
  selected: boolean;
  icon?: string;
};