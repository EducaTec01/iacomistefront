import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Platform
} from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';
import RecipeList from '../../components/RecipeList';
import Colors from '../../constants/Colors';
import { Recipe } from '../../types';

export default function RecipesScreen() {
  const { recipes, scannedIngredients, getRecommendedRecipes } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Initialize all filters
  const filters = ['All', 'Vegetarian', 'Quick', 'Healthy', 'Breakfast'];
  
  useEffect(() => {
    if (scannedIngredients.length > 0) {
      const recommendedRecipes = getRecommendedRecipes();
      setFilteredRecipes(recommendedRecipes);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [recipes, scannedIngredients]);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredRecipes(scannedIngredients.length > 0 ? getRecommendedRecipes() : recipes);
      return;
    }
    
    const query = text.toLowerCase();
    const results = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
    );
    
    setFilteredRecipes(results);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredRecipes(scannedIngredients.length > 0 ? getRecommendedRecipes() : recipes);
  };
  
  const handleFilterSelect = (filter: string) => {
    if (filter === activeFilter || filter === 'All') {
      setActiveFilter(null);
      setFilteredRecipes(scannedIngredients.length > 0 ? getRecommendedRecipes() : recipes);
      return;
    }
    
    setActiveFilter(filter);
    const lowerFilter = filter.toLowerCase();
    
    const results = recipes.filter(recipe => 
      recipe.tags.some(tag => tag.toLowerCase() === lowerFilter)
    );
    
    setFilteredRecipes(results);
  };
  
  const hasScannedIngredients = scannedIngredients.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recipes</Text>
          
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.neutral[500]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes, ingredients..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={Colors.neutral[500]}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={20} color={Colors.neutral[500]} />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  (activeFilter === filter || (filter === 'All' && !activeFilter)) && styles.activeFilterChip
                ]}
                onPress={() => handleFilterSelect(filter)}
              >
                <Text 
                  style={[
                    styles.filterText,
                    (activeFilter === filter || (filter === 'All' && !activeFilter)) && styles.activeFilterText
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <ScrollView style={styles.content}>
          {hasScannedIngredients && (
            <RecipeList
              title="Recommended Based on Your Ingredients"
              recipes={searchQuery ? filteredRecipes : getRecommendedRecipes()}
              emptyMessage="No matching recipes found for your ingredients. Try scanning more ingredients or browse our collection."
            />
          )}
          
          <RecipeList
            title={hasScannedIngredients ? "All Recipes" : "Recipes"}
            recipes={searchQuery || activeFilter ? filteredRecipes : recipes}
            emptyMessage="No recipes match your search. Try different keywords."
          />
          
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.neutral.white,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary.default,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  activeFilterText: {
    color: Colors.neutral.white,
  },
  content: {
    flex: 1,
  },
  spacer: {
    height: 100,
  },
});