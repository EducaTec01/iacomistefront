import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import PreferenceSelector from '../components/PreferenceSelector';
import CustomRestrictionInput from '../components/CustomRestrictionInput';
import { TDietaryPreference, TAllergy } from '../types';

export default function OnboardingScreen() {
  const { user, setUser, setUserPreferences, setUserAllergies, setCustomRestrictions } = useAppContext();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [step, setStep] = useState(1);
  
  const [dietaryPreferences, setDietaryPreferences] = useState<TDietaryPreference[]>([
    { id: '1', name: 'Vegetarian', selected: false },
    { id: '2', name: 'Vegan', selected: false },
    { id: '3', name: 'Gluten-Free', selected: false },
    { id: '4', name: 'Dairy-Free', selected: false },
    { id: '5', name: 'Keto', selected: false },
    { id: '6', name: 'Low-Carb', selected: false },
    { id: '7', name: 'Paleo', selected: false },
    { id: '8', name: 'Pescatarian', selected: false },
  ]);
  
  const [allergies, setAllergies] = useState<TAllergy[]>([
    { id: '1', name: 'Peanuts', selected: false },
    { id: '2', name: 'Tree Nuts', selected: false },
    { id: '3', name: 'Dairy', selected: false },
    { id: '4', name: 'Eggs', selected: false },
    { id: '5', name: 'Wheat', selected: false },
    { id: '6', name: 'Soy', selected: false },
    { id: '7', name: 'Fish', selected: false },
    { id: '8', name: 'Shellfish', selected: false },
  ]);
  
  const [customRestrictions, setCustomRestrictionsList] = useState<string[]>([]);
  
  useEffect(() => {
    if (user?.preferences.length) {
      const updatedPrefs = dietaryPreferences.map(pref => ({
        ...pref,
        selected: user.preferences.includes(pref.name.toLowerCase())
      }));
      setDietaryPreferences(updatedPrefs);
    }
    
    if (user?.allergies.length) {
      const updatedAllergies = allergies.map(allergy => ({
        ...allergy,
        selected: user.allergies.includes(allergy.name.toLowerCase())
      }));
      setAllergies(updatedAllergies);
    }
    
    if (user?.customRestrictions.length) {
      setCustomRestrictionsList(user.customRestrictions);
    }
  }, [user]);
  
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
  
  const handleSkip = () => {
    router.replace('/(tabs)');
  };
  
  const handleFinish = () => {
    // Save preferences to context
    const selectedPreferences = dietaryPreferences
      .filter(pref => pref.selected)
      .map(pref => pref.name.toLowerCase());
    
    const selectedAllergies = allergies
      .filter(allergy => allergy.selected)
      .map(allergy => allergy.name.toLowerCase());
    
    setUserPreferences(selectedPreferences);
    setUserAllergies(selectedAllergies);
    setCustomRestrictions(customRestrictions);
    
    // Navigate to main app
    router.replace('/(tabs)');
  };
  
  const renderWelcomeStep = () => (
    <>
      <View style={styles.welcomeContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg' }}
          style={styles.welcomeImage}
        />
        <Text style={styles.welcomeTitle}>Welcome to FoodieScan</Text>
        <Text style={styles.welcomeSubtitle}>
          Discover delicious recipes based on ingredients you already have
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Let's Get Started"
          onPress={() => setStep(2)}
          variant="primary"
          size="large"
          style={styles.button}
        />
        <Button
          title="Skip for Now"
          onPress={handleSkip}
          variant="text"
          size="medium"
          style={styles.skipButton}
        />
      </View>
    </>
  );
  
  const renderPreferencesStep = () => (
    <>
      <Text style={styles.stepTitle}>Your Preferences</Text>
      <Text style={styles.stepDescription}>
        Tell us about your dietary preferences so we can recommend better recipes for you.
      </Text>
      
      <ScrollView style={styles.scrollContainer}>
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
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Finish"
          onPress={handleFinish}
          variant="primary"
          size="large"
          style={styles.button}
        />
        <Button
          title="Skip for Now"
          onPress={handleSkip}
          variant="text"
          size="medium"
          style={styles.skipButton}
        />
      </View>
    </>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {step === 1 && renderWelcomeStep()}
        {step === 2 && renderPreferencesStep()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  welcomeImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.neutral[800],
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  stepTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
    marginBottom: 8,
    marginTop: Platform.OS === 'ios' ? 16 : 48,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: 24,
    lineHeight: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  spacer: {
    height: 40,
  },
  buttonContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  button: {
    width: '100%',
  },
  skipButton: {
    marginTop: 8,
  },
});