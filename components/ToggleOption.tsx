import React, { useId } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface ToggleOptionProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  id?: string; // Optional unique identifier
}

const ToggleOption = ({
  label,
  value,
  onToggle,
  id
}: ToggleOptionProps) => {
  // Generate a unique ID if one isn't provided
  const generatedId = useId();
  const toggleId = id || generatedId;

  return (
    <View style={styles.toggleContainer} testID={`toggle-container-${toggleId}`}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleWrapper}>
        <Text
          style={[styles.toggleText, !value && styles.toggleTextSelected]}
          testID={`toggle-no-${toggleId}`}
        >
          No
        </Text>
        <Switch
          trackColor={{ false: '#ccc', true: '#FFD700' }}
          thumbColor={value ? '#5D3FD3' : '#f4f3f4'}
          ios_backgroundColor="#ccc"
          onValueChange={onToggle} // Simplified
          value={value}
          style={styles.toggle}
          testID={`toggle-switch-${toggleId}`}
        />
        <Text
          style={[styles.toggleText, value && styles.toggleTextSelected]}
          testID={`toggle-yes-${toggleId}`}
        >
          Yes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginTop: 16,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 16,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggle: {
    marginHorizontal: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#888',
  },
  toggleTextSelected: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ToggleOption;