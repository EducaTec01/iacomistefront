import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import Button from './Button';

interface CustomRestrictionInputProps {
  restrictions: string[];
  onAdd: (restriction: string) => void;
  onRemove: (index: number) => void;
}

export default function CustomRestrictionInput({
  restrictions,
  onAdd,
  onRemove
}: CustomRestrictionInputProps) {
  const [newRestriction, setNewRestriction] = useState('');

  const handleAdd = () => {
    if (newRestriction.trim()) {
      onAdd(newRestriction.trim());
      setNewRestriction('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Restrictions</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newRestriction}
          onChangeText={setNewRestriction}
          placeholder="Add a custom restriction"
          placeholderTextColor={Colors.neutral[500]}
        />
        <Button 
          title="Add" 
          onPress={handleAdd} 
          variant="primary"
          size="small"
          disabled={!newRestriction.trim()}
          style={styles.addButton}
        />
      </View>
      
      {restrictions.length > 0 && (
        <FlatList
          data={restrictions}
          keyExtractor={(item, index) => `restriction-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.restrictionItem}>
              <Text style={styles.restrictionText}>{item}</Text>
              <TouchableOpacity
                onPress={() => onRemove(index)}
                style={styles.removeButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <X size={16} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.restrictionsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  addButton: {
    width: 80,
  },
  restrictionsList: {
    paddingHorizontal: 16,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  restrictionText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  removeButton: {
    padding: 4,
  },
});