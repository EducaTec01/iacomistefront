import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Colors from '../constants/Colors';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';

interface IngredientsListProps {
  ingredients: string[];
  title?: string;
}

export default function IngredientsList({ ingredients, title = "Ingredients" }: IngredientsListProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <FlatList
        data={ingredients}
        keyExtractor={(item, index) => `ingredient-${index}`}
        renderItem={({ item }) => (
          <View style={styles.ingredientRow}>
            <CheckCircle2 size={18} color={Colors.secondary.default} style={styles.icon} />
            <Text style={styles.ingredientText}>{item}</Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  ingredientText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[700],
    flex: 1,
  },
});