import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Venue } from "@/api/placesApi";

export default function UnverifiedVenue({ venue }: { venue: Venue }) {
  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/unverified-bathroom",
          params: {
            id: venue.place_id,
            venue: JSON.stringify(venue),
          },
        })
      }
    >
      <View style={styles.card}>
        {/* Title with emoji */}
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>🚽</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {venue.name}
          </Text>
        </View>

        {/* Rating (if available) */}
        {venue.rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Google Rating:</Text>
            <Text style={styles.ratingValue}>{venue.rating.toFixed(1)}</Text>
          </View>
        )}

        {/* Address */}
        <Text style={styles.cardVicinity} numberOfLines={2}>
          📍 {venue.vicinity || venue.formattedAddress || "Address unavailable"}
        </Text>

        <View style={styles.divider} />

        {/* Unverified badge */}
        <View style={styles.unverifiedBadge}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.unverifiedText}>
            Not yet rated by our community
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "rgba(93, 63, 211, 0.8)", // More transparent purple than verified
    padding: 16,
    borderRadius: 16,
    shadowColor: "#3A2784",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.7)", // More transparent gold border
    transform: [{ rotate: "-0.5deg" }], // Subtler rotation
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFD700",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
  },
  cardVicinity: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 8,
  },
  unverifiedBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  unverifiedText: {
    fontSize: 12,
    color: "#FFD700",
    marginLeft: 4,
  },
});
