import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function FilterTag({ label, selected, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tag, selected && styles.selectedTag]}
    >
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
  alignItems: 'center', // fixes vertical sizing
  alignSelf: 'flex-start', // prevent stretching to row height
},
selectedTag: {
  backgroundColor: '#f59e0b',
  borderColor: '#f59e0b',
},
tagText: {
  fontWeight: '600',
  fontSize: 14,
  color: '#374151',
  fontFamily: 'System', // or your custom font
},
selectedText: {
  color: '#fff',
},

});
