// components/ReviewItem.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RatingStars from "./RatingStars";
import { BathroomReview } from "@/api/bathrooms";

interface ReviewItemProps {
  review: BathroomReview;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  // Calculate the average rating for this specific review
  const averageRating = (
    ((review.clean_rating ?? 0) +
      (review.functional_rating ?? 0) +
      (review.privacy_rating ?? 0) +
      (review.stocked_rating ?? 0)) /
    4
  ).toFixed(1);

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <RatingStars rating={parseFloat(averageRating)} />
        <Text style={styles.reviewDate}>
          {review.created_at
            ? new Date(review.created_at).toLocaleDateString()
            : "No date"}
        </Text>
      </View>

      {/* Review categories ratings */}
      <View style={styles.reviewRatings}>
        <View style={styles.miniRating}>
          <Text style={styles.miniRatingLabel}>Clean</Text>
          <View style={styles.miniRatingBar}>
            <View
              style={[
                styles.miniRatingFill,
                { width: `${((review.clean_rating ?? 0) / 5) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.miniRatingValue}>
            {(review.clean_rating ?? 0).toFixed(1)}
          </Text>
        </View>

        <View style={styles.miniRating}>
          <Text style={styles.miniRatingLabel}>Private</Text>
          <View style={styles.miniRatingBar}>
            <View
              style={[
                styles.miniRatingFill,
                { width: `${((review.privacy_rating ?? 0) / 5) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.miniRatingValue}>
            {(review.privacy_rating ?? 0).toFixed(1)}
          </Text>
        </View>

        <View style={styles.miniRating}>
          <Text style={styles.miniRatingLabel}>Stocked</Text>
          <View style={styles.miniRatingBar}>
            <View
              style={[
                styles.miniRatingFill,
                { width: `${((review.stocked_rating ?? 0) / 5) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.miniRatingValue}>
            {(review.stocked_rating ?? 0).toFixed(1)}
          </Text>
        </View>

        <View style={styles.miniRating}>
          <Text style={styles.miniRatingLabel}>Functional</Text>
          <View style={styles.miniRatingBar}>
            <View
              style={[
                styles.miniRatingFill,
                { width: `${((review.functional_rating ?? 0) / 5) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.miniRatingValue}>
            {(review.functional_rating ?? 0).toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Review comment if available */}
      {review.review_text && (
        <Text style={styles.reviewComment}>{review.review_text}</Text>
      )}

      {/* User info if available */}
      <View style={styles.reviewFooter}>
        <Text style={styles.reviewerName}>
          {review.profiles?.username || "Anonymous User"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(93, 63, 211, 0.1)",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
  },
  reviewRatings: {
    marginBottom: 12,
  },
  miniRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  miniRatingLabel: {
    width: 70,
    fontSize: 12,
    color: "#666",
  },
  miniRatingBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(93, 63, 211, 0.1)",
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  miniRatingFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },
  miniRatingValue: {
    width: 25,
    fontSize: 12,
    fontWeight: "bold",
    color: "#5D3FD3",
    textAlign: "right",
  },
  reviewComment: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 8,
    fontStyle: "italic",
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5D3FD3",
  },
});

export default ReviewItem;
