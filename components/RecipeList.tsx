import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import RecipeCard from './RecipeCard';
import { Recipe } from '../types';
import Colors from '../constants/Colors';

interface RecipeListProps {
  title: string;
  recipes: Recipe[];
  horizontal?: boolean;
  emptyMessage?: string;
}

export default function RecipeList({ 
  title, 
  recipes, 
  horizontal = false,
  emptyMessage = "No recipes found"
}: RecipeListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} horizontal={horizontal} />
          )}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={horizontal ? styles.horizontalList : styles.gridList}
          numColumns={horizontal ? 1 : 2}
          key={horizontal ? 'horizontal' : 'grid'}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[800],
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  horizontalList: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  gridList: {
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
});