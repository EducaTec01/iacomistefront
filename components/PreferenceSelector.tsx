import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Colors from '../constants/Colors';

interface PreferenceOption {
  id: string;
  name: string;
  selected: boolean;
}

interface PreferenceSelectorProps {
  title: string;
  options: PreferenceOption[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
}

export default function PreferenceSelector({
  title,
  options,
  onSelect,
  multiSelect = true
}: PreferenceSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <FlatList
        data={options}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              item.selected && styles.optionSelected
            ]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.optionText,
                item.selected && styles.optionTextSelected
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.optionsContainer}
      />
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
  optionsContainer: {
    paddingHorizontal: 8,
  },
  option: {
    flex: 1,
    margin: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  optionSelected: {
    borderColor: Colors.primary.default,
    backgroundColor: Colors.primary.light,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.neutral.white,
  },
});