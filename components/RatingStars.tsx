// components/RatingStars.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.ratingContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <Text key={`full-${i}`} style={styles.starFull}>
          ★
        </Text>
      ))}
      {halfStar && <Text style={styles.starHalf}>★</Text>}
      {[...Array(emptyStars)].map((_, i) => (
        <Text key={`empty-${i}`} style={styles.starEmpty}>
          ☆
        </Text>
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  starFull: {
    fontSize: 24,
    color: "#FFD700",
    marginRight: 2,
  },
  starHalf: {
    fontSize: 24,
    color: "#FFD700",
    marginRight: 2,
    opacity: 0.7,
  },
  starEmpty: {
    fontSize: 24,
    color: "#FFD700",
    marginRight: 2,
    opacity: 0.3,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5D3FD3",
    marginLeft: 5,
  },
});

export default RatingStars;
