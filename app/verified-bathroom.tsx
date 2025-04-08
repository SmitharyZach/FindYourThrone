// VerifiedBathroomScreen.tsx
import React, { useRef, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { useQuery } from "@tanstack/react-query";

// Types and Utils
import { createBathroomData } from "../utils/bathroomUtils";
import { styles } from "../styles";

// API
import { Bathroom, BathroomReview, getBathroomRatings } from "@/api/bathrooms";

// Components
import RatingStars from "../components/RatingStars";
import FeatureBadge from "../components/FeatureBadge";
import BathroomReviewModal from "@/components/BathroomReviewModal";
import ReviewsModal from "@/components/ReviewsModal";
import { openMaps } from "@/utils/mapUtils";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

export default function VerifiedBathroomScreen() {
  // Get bathroom data from params
  const params = useLocalSearchParams();
  const bathroom: Bathroom = params.venue
    ? JSON.parse(params.venue as string)
    : null;

  // Get current user
  const { user } = useAuth();

  // State for reviews modal
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  // Fetch reviews data
  const { data: reviews, isPending: verifiedPending } = useQuery({
    queryKey: ["verifiedBathrooms", bathroom?.id],
    queryFn: () => getBathroomRatings(bathroom.id),
    enabled: !!bathroom?.id,
  });

  // Check if the current user has already reviewed this bathroom
  const hasUserReviewed = () => {
    if (!user || !reviews || reviews.length === 0) return false;

    // Check if any review's username matches the current user's email
    return reviews.some((review) => review.profiles?.username === user.email);
  };

  const handleOpenMaps = () => {
    openMaps({
      name: bathroom.name,
      address: bathroom.address,
      latitude: bathroom.lat,
      longitude: bathroom.lng,
    }).catch((err) => {
      // Handle any errors here (optional)
      console.log("Failed to open maps", err);
    });
  };

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [150, 100],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  // Create derived data from the bathroom object
  const bathroomData = createBathroomData(bathroom);

  // Handle scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // Check if this is a premium bathroom (average rating ≥ 4.0)
  const isPremium = parseFloat(bathroomData.rating) >= 4.0;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar style="light" />

      {/* Reviews Modal */}
      <ReviewsModal
        visible={reviewsModalVisible}
        onClose={() => setReviewsModalVisible(false)}
        reviews={reviews as BathroomReview[]}
        isPending={verifiedPending}
      />

      <BathroomReviewModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        bathroomId={bathroom.id}
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <Animated.View
            style={[styles.headerContent, { opacity: headerOpacity }]}
          >
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
            )}
            <Text style={styles.headerSubtitle}>Verified Throne</Text>
          </Animated.View>

          <Animated.Text
            style={[styles.headerTitle, { transform: [{ scale: titleScale }] }]}
            numberOfLines={1}
          >
            {bathroomData.name}
          </Animated.Text>
        </BlurView>

        {/* Back button floating on top */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Rating Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Ratings</Text>
            <View style={styles.divider} />
          </View>

          {/* Overall rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Overall</Text>
            <RatingStars rating={parseFloat(bathroomData.rating)} />
            <View style={styles.reviewCountContainer}>
              <Text style={styles.reviewCount}>
                Based on {bathroomData.reviewCount} reviews
              </Text>
              {bathroomData.reviewCount > 0 && (
                <Pressable
                  onPress={() => setReviewsModalVisible(true)}
                  style={styles.viewReviewsButton}
                >
                  <Text style={styles.viewReviewsText}>View All</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Individual ratings */}
          {bathroom && (
            <View style={styles.detailedRatings}>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingCategory}>Cleanliness</Text>
                <View style={styles.ratingBar}>
                  <View
                    style={[
                      styles.ratingFill,
                      { width: `${(bathroom.clean_rating / 5) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.ratingValue}>
                  {bathroom.clean_rating.toFixed(1)}
                </Text>
              </View>

              <View style={styles.ratingRow}>
                <Text style={styles.ratingCategory}>Privacy</Text>
                <View style={styles.ratingBar}>
                  <View
                    style={[
                      styles.ratingFill,
                      { width: `${(bathroom.privacy_rating / 5) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.ratingValue}>
                  {bathroom.privacy_rating.toFixed(1)}
                </Text>
              </View>

              <View style={styles.ratingRow}>
                <Text style={styles.ratingCategory}>Stocked</Text>
                <View style={styles.ratingBar}>
                  <View
                    style={[
                      styles.ratingFill,
                      { width: `${(bathroom.stocked_rating / 5) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.ratingValue}>
                  {bathroom.stocked_rating.toFixed(1)}
                </Text>
              </View>

              <View style={styles.ratingRow}>
                <Text style={styles.ratingCategory}>Functional</Text>
                <View style={styles.ratingBar}>
                  <View
                    style={[
                      styles.ratingFill,
                      { width: `${(bathroom.functional_rating / 5) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.ratingValue}>
                  {bathroom.functional_rating.toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleOpenMaps}
            style={[styles.actionButton, styles.primaryButton]}
          >
            <Text style={styles.primaryButtonText}>Get Directions</Text>
          </Pressable>

          {hasUserReviewed() ? (
            <View style={[styles.actionButton, styles.reviewedBadge]}>
              <Text style={styles.reviewedText}>Reviewed</Text>
            </View>
          ) : (
            <Pressable
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => setIsReviewModalVisible(true)}
            >
              <Text style={styles.secondaryButtonText}>Leave Review</Text>
            </Pressable>
          )}
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Features</Text>
            <View style={styles.divider} />
          </View>

          {bathroom?.code && (
            <View style={styles.codeRow}>
              <Text style={styles.codeLabel}>Bathroom Code:</Text>
              <Text style={styles.codeValue}>{bathroom.code}</Text>
            </View>
          )}
          <View style={styles.featuresGrid}>
            {bathroomData.features.map((feature, index) => (
              <FeatureBadge
                key={index}
                icon={feature.icon}
                label={feature.label}
              />
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Details</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{bathroomData.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{bathroomData.distance}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{bathroomData.status}</Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* Decorative elements */}
      <View style={styles.decorationCircle1} />
      <View style={styles.decorationCircle2} />
      <View style={styles.decorationCircle3} />
    </SafeAreaView>
  );
}
