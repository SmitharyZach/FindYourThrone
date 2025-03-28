// components/FeatureBadge.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FeatureBadgeProps {
  icon: string;
  label: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, label }) => (
  <View style={styles.featureBadge}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  featureBadge: {
    width: "30%",
    backgroundColor: "rgba(93, 63, 211, 0.1)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(93, 63, 211, 0.2)",
  },
  featureIcon: {
    fontSize: 22,
    marginBottom: 5,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5D3FD3",
    textAlign: "center",
  },
});

export default FeatureBadge;
