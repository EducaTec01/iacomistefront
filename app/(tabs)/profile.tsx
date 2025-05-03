import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Platform,
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import Colors from '../../constants/Colors';
import RecipeList from '../../components/RecipeList';
import { ChevronRight, Heart, Settings, User as UserIcon, Bell } from 'lucide-react-native';
import PreferenceSelector from '../../components/PreferenceSelector';
import CustomRestrictionInput from '../../components/CustomRestrictionInput';
import { TDietaryPreference, TAllergy } from '../../types';
import Button from '../../components/Button';

export default function ProfileScreen() {
  const { 
    user, 
    recipes, 
    isRecipeFavorite,
    setUserPreferences,
    setUserAllergies,
    setCustomRestrictions
  } = useAppContext();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const [dietaryPreferences, setDietaryPreferences] = useState<TDietaryPreference[]>([
    { id: '1', name: 'Vegetarian', selected: user?.preferences.includes('vegetarian') || false },
    { id: '2', name: 'Vegan', selected: user?.preferences.includes('vegan') || false },
    { id: '3', name: 'Gluten-Free', selected: user?.preferences.includes('gluten-free') || false },
    { id: '4', name: 'Dairy-Free', selected: user?.preferences.includes('dairy-free') || false },
    { id: '5', name: 'Keto', selected: user?.preferences.includes('keto') || false },
    { id: '6', name: 'Low-Carb', selected: user?.preferences.includes('low-carb') || false },
  ]);
  
  const [allergies, setAllergies] = useState<TAllergy[]>([
    { id: '1', name: 'Peanuts', selected: user?.allergies.includes('peanuts') || false },
    { id: '2', name: 'Tree Nuts', selected: user?.allergies.includes('tree nuts') || false },
    { id: '3', name: 'Dairy', selected: user?.allergies.includes('dairy') || false },
    { id: '4', name: 'Eggs', selected: user?.allergies.includes('eggs') || false },
    { id: '5', name: 'Wheat', selected: user?.allergies.includes('wheat') || false },
    { id: '6', name: 'Soy', selected: user?.allergies.includes('soy') || false },
  ]);
  
  const [customRestrictions, setCustomRestrictionsList] = useState<string[]>(
    user?.customRestrictions || []
  );
  
  const favoriteRecipes = recipes.filter(recipe => isRecipeFavorite(recipe.id));
  
  const handleToggleDietaryPreference = (id: string) => {
    const updatedPreferences = dietaryPreferences.map(pref => 
      pref.id === id ? { ...pref, selected: !pref.selected } : pref
    );
    setDietaryPreferences(updatedPreferences);
  };
  
  const handleToggleAllergy = (id: string) => {
    const updatedAllergies = allergies.map(allergy => 
      allergy.id === id ? { ...allergy, selected: !allergy.selected } : allergy
    );
    setAllergies(updatedAllergies);
  };
  
  const handleAddRestriction = (restriction: string) => {
    setCustomRestrictionsList([...customRestrictions, restriction]);
  };
  
  const handleRemoveRestriction = (index: number) => {
    const updatedRestrictions = [...customRestrictions];
    updatedRestrictions.splice(index, 1);
    setCustomRestrictionsList(updatedRestrictions);
  };
  
  const saveChanges = () => {
    // Save preferences
    const selectedPreferences = dietaryPreferences
      .filter(pref => pref.selected)
      .map(pref => pref.name.toLowerCase());
    
    // Save allergies
    const selectedAllergies = allergies
      .filter(allergy => allergy.selected)
      .map(allergy => allergy.name.toLowerCase());
    
    setUserPreferences(selectedPreferences);
    setUserAllergies(selectedAllergies);
    setCustomRestrictions(customRestrictions);
    
    setIsEditMode(false);
    Alert.alert('Success', 'Your preferences have been updated.');
  };
  
  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileInfo}>
        <View style={styles.profileImagePlaceholder}>
          <UserIcon size={32} color={Colors.neutral.white} />
        </View>
        <View>
          <Text style={styles.profileName}>
            {user?.name ? user.name : 'Guest User'}
          </Text>
          <Text style={styles.profileEmail}>
            {user?.email ? user.email : 'Not signed in'}
          </Text>
        </View>
      </View>
      
      <Button
        title={isEditMode ? "Cancel" : "Edit Preferences"}
        onPress={() => setIsEditMode(!isEditMode)}
        variant={isEditMode ? "outline" : "primary"}
        size="small"
      />
    </View>
  );
  
  const renderSettingsItem = ({ 
    icon, 
    title, 
    value, 
    hasToggle = false,
    toggleValue,
    onToggleChange, 
    onPress
  }: {
    icon: React.ReactNode;
    title: string;
    value?: string;
    hasToggle?: boolean;
    toggleValue?: boolean;
    onToggleChange?: (value: boolean) => void;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={hasToggle || !onPress}
    >
      <View style={styles.settingsIconContainer}>
        {icon}
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: Colors.neutral[300], true: Colors.primary.light }}
          thumbColor={toggleValue ? Colors.primary.default : Colors.neutral.white}
        />
      ) : (
        <ChevronRight size={20} color={Colors.neutral[500]} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {renderProfileHeader()}
        
        {isEditMode ? (
          <View style={styles.preferencesContainer}>
            <PreferenceSelector
              title="Dietary Preferences"
              options={dietaryPreferences}
              onSelect={handleToggleDietaryPreference}
              multiSelect={true}
            />
            
            <PreferenceSelector
              title="Allergies & Intolerances"
              options={allergies}
              onSelect={handleToggleAllergy}
              multiSelect={true}
            />
            
            <CustomRestrictionInput
              restrictions={customRestrictions}
              onAdd={handleAddRestriction}
              onRemove={handleRemoveRestriction}
            />
            
            <View style={styles.saveButtonContainer}>
              <Button
                title="Save Changes"
                onPress={saveChanges}
                variant="primary"
                size="large"
                style={styles.saveButton}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Settings</Text>
              
              {renderSettingsItem({
                icon: <Bell size={20} color={Colors.primary.default} />,
                title: 'Notifications',
                hasToggle: true,
                toggleValue: notificationsEnabled,
                onToggleChange: setNotificationsEnabled
              })}
              
              {renderSettingsItem({
                icon: <Settings size={20} color={Colors.primary.default} />,
                title: 'Account Settings',
                onPress: () => Alert.alert('Account Settings', 'This would open account settings.')
              })}
            </View>
            
            <RecipeList
              title="Favorite Recipes"
              recipes={favoriteRecipes}
              emptyMessage="You haven't saved any favorites yet."
            />
          </>
        )}
        
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
    backgroundColor: Colors.neutral.white,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
  },
  profileHeader: {
    backgroundColor: Colors.neutral.white,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  preferencesContainer: {
    paddingTop: 16,
  },
  saveButtonContainer: {
    padding: 16,
    backgroundColor: Colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
  },
  settingsSection: {
    marginVertical: 16,
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  settingsValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 2,
  },
  spacer: {
    height: 100,
  },
});