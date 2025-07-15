import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { quickActions } from '../data/beers';

interface QuickActionsProps {
  onActionPress: (action: string) => void;
}

// Create a separate component for individual action items
const ActionItem = ({ item, onActionPress }: { item: any; onActionPress: (action: string) => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onActionPress(item.action);
  };

  return (
    <Animated.View
      style={[
        styles.actionContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: item.color }]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>{item.icon}</Text>
      </TouchableOpacity>
      <Text style={styles.actionTitle}>{item.title}</Text>
    </Animated.View>
  );
};

export default function QuickActions({ onActionPress }: QuickActionsProps) {
  const renderAction = ({ item, index }: { item: any; index: number }) => {
    return <ActionItem item={item} onActionPress={onActionPress} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={quickActions}
        renderItem={renderAction}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  actionsContainer: {
    paddingHorizontal: 16,
  },
  actionContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  separator: {
    width: 12,
  },
});
