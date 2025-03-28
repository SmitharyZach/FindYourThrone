import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { Bathroom } from "@/api/bathrooms";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type RatingDisplayProps = {
  rating: number;
  label: string;
  icon: string;
  maxRating?: number;
};

const RatingDisplay = ({
  rating,
  label,
  icon,
  maxRating = 5,
}: RatingDisplayProps) => {
  return (
    <View style={styles.ratingContainer}>
      <Ionicons name={icon as any} size={18} color="#34D399" />
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.starsContainer}>
        {[...Array(maxRating)].map((_, i) => (
          <Ionicons
            key={i}
            name={
              i < Math.floor(rating)
                ? "star"
                : i < rating
                ? "star-half"
                : "star-outline"
            }
            size={16}
            color={i < rating ? "#F59E0B" : "#94A3B8"}
            style={styles.starIcon}
          />
        ))}
        <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
      </View>
    </View>
  );
};

export default function VerifiedBathroom({ bathroom }: { bathroom: Bathroom }) {
  // Calculate average rating from bathroom ratings
  const averageRating =
    (bathroom.clean_rating +
      bathroom.functional_rating +
      bathroom.privacy_rating +
      bathroom.stocked_rating) /
    4;

  // Determine verification badge type
  const isHighlyRated = averageRating >= 4;
  const isVerified = bathroom.rating_count > 0;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/verified-bathroom",
          params: {
            id: bathroom.id,
            venue: JSON.stringify(bathroom),
          },
        })
      }
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with verified badge */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle}>{bathroom.name}</Text>
            {isVerified && (
              <View
                style={[
                  styles.verifiedBadge,
                  isHighlyRated
                    ? styles.verifiedBadgeGold
                    : styles.verifiedBadgeBlue,
                ]}
              >
                <Ionicons
                  name={isHighlyRated ? "shield-checkmark" : "checkmark-circle"}
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={styles.verifiedText}>
                  {isHighlyRated ? "TOP RATED" : "VERIFIED"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={14} color="#3B82F6" />
            <Text style={styles.distanceText}>
              {(bathroom.distance_meters / 1609.34).toFixed(1)} mi
            </Text>
          </View>
        </View>

        {/* Address information */}
        <View style={styles.addressContainer}>
          <Ionicons name="navigate" size={16} color="#64748B" />
          <Text style={styles.addressText} numberOfLines={2}>
            {bathroom.address}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Ratings section */}
        <View style={styles.ratingsRow}>
          <RatingDisplay
            rating={bathroom.clean_rating}
            label="Cleanliness"
            icon="water"
          />
          <RatingDisplay
            rating={bathroom.functional_rating}
            label="Function"
            icon="construct"
          />
        </View>

        <View style={styles.ratingsRow}>
          <RatingDisplay
            rating={bathroom.privacy_rating}
            label="Privacy"
            icon="eye-off"
          />
          <RatingDisplay
            rating={bathroom.stocked_rating}
            label="Stocked"
            icon="cart"
          />
        </View>

        {/* Features badges */}
        <View style={styles.featuresContainer}>
          {bathroom.gender_neutral && (
            <View style={styles.featureBadge}>
              <Ionicons name="people" size={14} color="#818CF8" />
              <Text style={styles.featureText}>Gender Neutral</Text>
            </View>
          )}
          {bathroom.is_accessible && (
            <View style={styles.featureBadge}>
              <Ionicons name="accessibility" size={14} color="#818CF8" />
              <Text style={styles.featureText}>Accessible</Text>
            </View>
          )}
          {bathroom.requires_key && (
            <View style={styles.featureBadge}>
              <Ionicons name="key" size={14} color="#818CF8" />
              <Text style={styles.featureText}>Key Required</Text>
            </View>
          )}
          {bathroom.requires_purchase && (
            <View style={styles.featureBadge}>
              <Ionicons name="cash" size={14} color="#818CF8" />
              <Text style={styles.featureText}>Purchase Required</Text>
            </View>
          )}
        </View>

        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "95%",
    marginVertical: 10,
    borderRadius: 16,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 4,
  },
  verifiedBadgeBlue: {
    backgroundColor: "#3B82F6",
  },
  verifiedBadgeGold: {
    backgroundColor: "#F59E0B",
  },
  verifiedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 2,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 2,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 6,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },
  ratingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "column",
    width: "48%",
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginVertical: 2,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 2,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  featureBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: "#6366F1",
    marginLeft: 4,
  },
  viewDetailsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
    marginRight: 4,
  },
});
