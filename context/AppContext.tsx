import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Recipe, Ingredient } from '../types';

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  setUserPreferences: (preferences: string[]) => void;
  setUserAllergies: (allergies: string[]) => void;
  setCustomRestrictions: (restrictions: string[]) => void;
  toggleFavoriteRecipe: (recipeId: string) => void;
  isRecipeFavorite: (recipeId: string) => boolean;
  scannedIngredients: Ingredient[];
  setScannedIngredients: (ingredients: Ingredient[]) => void;
  clearScannedIngredients: () => void;
  recipes: Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  getRecommendedRecipes: () => Recipe[];
};

const defaultUser: User = {
  id: '1',
  name: '',
  email: '',
  preferences: [],
  allergies: [],
  customRestrictions: [],
  favoriteRecipes: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [scannedIngredients, setScannedIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Vegetable Stir Fry',
      image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
      ingredients: ['bell pepper', 'carrot', 'broccoli', 'soy sauce', 'garlic', 'ginger', 'rice'],
      preparationTime: 25,
      instructions: [
        'Chop all vegetables into bite-sized pieces',
        'Heat oil in a wok or large frying pan',
        'Add garlic and ginger, stir for 30 seconds',
        'Add vegetables and stir fry for 5-7 minutes',
        'Add soy sauce and other seasonings',
        'Serve hot over rice'
      ],
      tags: ['vegetarian', 'healthy', 'quick', 'asian'],
    },
    {
      id: '2',
      name: 'Pasta Primavera',
      image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
      ingredients: ['pasta', 'zucchini', 'cherry tomatoes', 'bell pepper', 'olive oil', 'parmesan cheese', 'basil'],
      preparationTime: 30,
      instructions: [
        'Cook pasta according to package instructions',
        'In a separate pan, sauté chopped vegetables in olive oil',
        'Drain pasta and combine with vegetables',
        'Add fresh basil and grated parmesan cheese',
        'Season with salt and pepper to taste'
      ],
      tags: ['vegetarian', 'italian', 'pasta'],
    },
    {
      id: '3',
      name: 'Chickpea Curry',
      image: 'https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg',
      ingredients: ['chickpeas', 'coconut milk', 'onion', 'garlic', 'curry powder', 'tomatoes', 'rice'],
      preparationTime: 35,
      instructions: [
        'Sauté diced onion and garlic until translucent',
        'Add curry powder and stir for 1 minute',
        'Add chickpeas and diced tomatoes',
        'Pour in coconut milk and simmer for 20 minutes',
        'Serve with rice or naan bread'
      ],
      tags: ['vegan', 'gluten-free', 'indian'],
    },
    {
      id: '4',
      name: 'Avocado Toast',
      image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
      ingredients: ['avocado', 'bread', 'lemon juice', 'salt', 'pepper', 'red pepper flakes'],
      preparationTime: 10,
      instructions: [
        'Toast bread to desired crispness',
        'Mash ripe avocado with lemon juice, salt, and pepper',
        'Spread avocado mixture on toast',
        'Sprinkle with red pepper flakes if desired'
      ],
      tags: ['vegetarian', 'breakfast', 'quick', 'healthy'],
    },
    {
      id: '5',
      name: 'Berry Smoothie Bowl',
      image: 'https://images.pexels.com/photos/1153599/pexels-photo-1153599.jpeg',
      ingredients: ['frozen berries', 'banana', 'yogurt', 'honey', 'granola', 'chia seeds'],
      preparationTime: 10,
      instructions: [
        'Blend frozen berries, banana, and yogurt until smooth',
        'Pour into a bowl',
        'Top with granola, fresh fruit, and chia seeds',
        'Drizzle with honey'
      ],
      tags: ['vegetarian', 'breakfast', 'healthy', 'quick'],
    }
  ]);

  const setUserPreferences = (preferences: string[]) => {
    if (user) {
      setUser({ ...user, preferences });
    }
  };

  const setUserAllergies = (allergies: string[]) => {
    if (user) {
      setUser({ ...user, allergies });
    }
  };

  const setCustomRestrictions = (restrictions: string[]) => {
    if (user) {
      setUser({ ...user, customRestrictions: restrictions });
    }
  };

  const toggleFavoriteRecipe = (recipeId: string) => {
    if (!user) return;
    
    let favorites = [...user.favoriteRecipes];
    if (favorites.includes(recipeId)) {
      favorites = favorites.filter(id => id !== recipeId);
    } else {
      favorites.push(recipeId);
    }
    
    setUser({ ...user, favoriteRecipes: favorites });
  };

  const isRecipeFavorite = (recipeId: string): boolean => {
    return user?.favoriteRecipes.includes(recipeId) || false;
  };

  const clearScannedIngredients = () => {
    setScannedIngredients([]);
  };

  const getRecipeById = (id: string): Recipe | undefined => {
    return recipes.find(recipe => recipe.id === id);
  };

  const getRecommendedRecipes = (): Recipe[] => {
    if (!user || scannedIngredients.length === 0) return recipes;

    // Filter recipes based on scanned ingredients and user preferences
    return recipes.filter(recipe => {
      // Check if recipe contains any of the scanned ingredients
      const hasScannedIngredient = scannedIngredients.some(ingredient => 
        recipe.ingredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.name.toLowerCase())
        )
      );

      // Check if recipe matches user dietary preferences
      const matchesPreferences = user.preferences.length === 0 || 
        user.preferences.some(pref => recipe.tags.includes(pref.toLowerCase()));

      // Check if recipe contains any allergies
      const hasAllergies = user.allergies.some(allergy => 
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(allergy.toLowerCase())
        )
      );

      return hasScannedIngredient && matchesPreferences && !hasAllergies;
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      setUserPreferences,
      setUserAllergies,
      setCustomRestrictions,
      toggleFavoriteRecipe,
      isRecipeFavorite,
      scannedIngredients,
      setScannedIngredients,
      clearScannedIngredients,
      recipes,
      getRecipeById,
      getRecommendedRecipes
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};