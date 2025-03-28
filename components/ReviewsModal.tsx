// components/ReviewsModal.tsx
import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import ReviewItem from "./ReviewItem";
import { BathroomReview } from "@/api/bathrooms";

interface ReviewsModalProps {
  visible: boolean;
  onClose: () => void;
  reviews: BathroomReview[] | undefined;
  isPending: boolean;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({
  visible,
  onClose,
  reviews,
  isPending,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Throne Reviews</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.reviewsList}
              contentContainerStyle={styles.reviewsListContent}
              showsVerticalScrollIndicator={false}
            >
              {isPending ? (
                <ActivityIndicator
                  size="large"
                  color="#5D3FD3"
                  style={styles.loadingIndicator}
                />
              ) : reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ReviewItem key={review.id || index} review={review} />
                ))
              ) : (
                <View style={styles.noReviewsContainer}>
                  <Text style={styles.emoji}>📝</Text>
                  <Text style={styles.noReviewsText}>
                    No detailed reviews available yet.
                  </Text>
                  <Text style={styles.noReviewsSubtext}>
                    Be the first to share your experience!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBlur: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D3FD3",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(93, 63, 211, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#5D3FD3",
    fontWeight: "bold",
  },
  reviewsList: {
    flex: 1,
  },
  reviewsListContent: {
    paddingBottom: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 5,
  },
  noReviewsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  noReviewsText: {
    fontSize: 18,
    color: "#5D3FD3",
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  loadingIndicator: {
    marginTop: 40,
  },
  addReviewButton: {
    backgroundColor: "#FFD700",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addReviewButtonText: {
    color: "#5D3FD3",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReviewsModal;
