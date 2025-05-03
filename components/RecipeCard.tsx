import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Clock, Heart } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';

interface RecipeCardProps {
  recipe: Recipe;
  horizontal?: boolean;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = horizontal => horizontal ? screenWidth * 0.85 : screenWidth * 0.45;

export default function RecipeCard({ recipe, horizontal = false }: RecipeCardProps) {
  const { isRecipeFavorite, toggleFavoriteRecipe } = useAppContext();
  const isFavorite = isRecipeFavorite(recipe.id);

  const onPress = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleFavoritePress = () => {
    toggleFavoriteRecipe(recipe.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        horizontal ? styles.horizontalCard : styles.verticalCard
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: recipe.image }}
        style={[
          styles.image,
          horizontal ? styles.horizontalImage : styles.verticalImage
        ]}
      />
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Heart
          size={24}
          color={isFavorite ? Colors.error.default : Colors.neutral.white}
          fill={isFavorite ? Colors.error.default : 'transparent'}
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>
        
        <View style={styles.infoRow}>
          <View style={styles.timeContainer}>
            <Clock size={16} color={Colors.neutral[600]} />
            <Text style={styles.timeText}>{recipe.preparationTime} min</Text>
          </View>
          
          <View style={styles.tagsContainer}>
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    margin: 8,
  },
  horizontalCard: {
    width: cardWidth(true),
    flexDirection: 'row',
    height: 120,
  },
  verticalCard: {
    width: cardWidth(false),
  },
  image: {
    backgroundColor: Colors.neutral[200],
  },
  horizontalImage: {
    width: 120,
    height: '100%',
  },
  verticalImage: {
    width: '100%',
    height: 150,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  contentContainer: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: Colors.secondary.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  tagText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral.white,
  },
});