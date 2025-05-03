import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useAppContext } from '../../context/AppContext';
import Colors from '../../constants/Colors';
import { ArrowLeft, Heart, Clock, Share2 } from 'lucide-react-native';
import IngredientsList from '../../components/IngredientsList';
import Button from '../../components/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipeById, isRecipeFavorite, toggleFavoriteRecipe } = useAppContext();
  const [recipe, setRecipe] = useState(getRecipeById(id || ''));
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (id) {
      const recipeData = getRecipeById(id);
      setRecipe(recipeData);
      setIsFavorite(isRecipeFavorite(id));
    }
  }, [id]);
  
  if (!recipe) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Recipe not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
          size="medium"
        />
      </SafeAreaView>
    );
  }
  
  const handleFavoriteToggle = () => {
    toggleFavoriteRecipe(recipe.id);
    setIsFavorite(!isFavorite);
  };
  
  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing recipe:', recipe.name);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.neutral.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity 
                onPress={handleShare}
                style={styles.headerButton}
              >
                <Share2 size={24} color={Colors.neutral.white} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleFavoriteToggle}
                style={styles.headerButton}
              >
                <Heart 
                  size={24} 
                  color={Colors.neutral.white} 
                  fill={isFavorite ? Colors.neutral.white : 'transparent'} 
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.recipeImage}
          />
          <View style={styles.overlay} />
        </View>
        
        <View style={styles.recipeInfoContainer}>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          
          <View style={styles.tagsRow}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.prepTimeContainer}>
            <Clock size={20} color={Colors.neutral[600]} />
            <Text style={styles.prepTimeText}>
              {recipe.preparationTime} minutes prep time
            </Text>
          </View>
        </View>
        
        <IngredientsList ingredients={recipe.ingredients} />
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          
          {recipe.instructions.map((step, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{step}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.neutral[50],
  },
  notFoundText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[700],
    marginBottom: 24,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: 0.7,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginLeft: 8,
  },
  recipeInfoContainer: {
    padding: 16,
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  recipeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.primary.light,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral.white,
    textTransform: 'capitalize',
  },
  prepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    padding: 12,
    borderRadius: 8,
  },
  prepTimeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 8,
  },
  instructionsContainer: {
    padding: 16,
    backgroundColor: Colors.neutral.white,
    marginTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  instructionNumberText: {
    fontFamily: 'Inter-Bold',
    color: Colors.neutral.white,
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral[700],
  },
  spacer: {
    height: 40,
  },
});