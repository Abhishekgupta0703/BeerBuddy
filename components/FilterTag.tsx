import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface FilterTagProps {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
}

export default function FilterTag({ label, icon, selected, onPress }: FilterTagProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tag, selected && styles.selectedTag]}
    >
      {icon && (
        <Text style={styles.icon}>{icon}</Text>
      )}
      <Text style={selected ? styles.selectedText : styles.tagText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
  },
  selectedTag: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  tagText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
    fontFamily: 'System',
  },
  selectedText: {
    color: '#fff',
  },
  icon: {
    fontSize: 16,
    color: '#6b7280',
  },
});
