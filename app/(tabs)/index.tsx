import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import RecipeList from '../../components/RecipeList';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { router } from 'expo-router';
import { Camera, Utensils } from 'lucide-react-native';

export default function HomeScreen() {
  const { user, recipes } = useAppContext();
  
  const handleScanPress = () => {
    router.push('/scan');
  };
  
  const handleBrowseRecipes = () => {
    router.push('/recipes');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello{user?.name ? ', ' + user.name : ''}!</Text>
            <Text style={styles.subtitle}>What would you like to cook today?</Text>
          </View>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg' }}
            style={styles.headerImage}
          />
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Scan Ingredients"
            onPress={handleScanPress}
            variant="primary"
            size="large"
            style={styles.scanButton}
            icon={<Camera color={Colors.neutral.white} size={20} style={styles.buttonIcon} />}
          />
          <Button
            title="Browse Recipes"
            onPress={handleBrowseRecipes}
            variant="outline"
            size="large"
            style={styles.browseButton}
            icon={<Utensils color={Colors.primary.default} size={20} style={styles.buttonIcon} />}
          />
        </View>
        
        <RecipeList
          title="Popular Recipes"
          recipes={recipes.slice(0, 5)}
          horizontal={true}
        />
        
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {['Breakfast', 'Lunch', 'Dinner', 'Dessert'].map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <RecipeList
          title="Quick & Easy"
          recipes={recipes.filter(recipe => recipe.preparationTime <= 15)}
          horizontal={true}
        />
        
        <View style={styles.spacer} />
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
  },
  headerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  scanButton: {
    flex: 1,
    marginRight: 8,
  },
  browseButton: {
    flex: 1,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  categorySection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[800],
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  categoryItem: {
    backgroundColor: Colors.primary.light,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral.white,
  },
  spacer: {
    height: 120,
  },
});