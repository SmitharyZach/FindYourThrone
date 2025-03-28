import { View, Text, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { Bathroom } from "@/api/bathrooms";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Callout, Marker } from "react-native-maps";

export default function ThroneMarker({ bathroom }: { bathroom: Bathroom }) {
  // Calculate average rating
  const averageRating =
    (bathroom.clean_rating +
      bathroom.functional_rating +
      bathroom.privacy_rating +
      bathroom.stocked_rating) /
    4;

  // Determine verification badge type
  const isHighlyRated = averageRating >= 4;
  const isVerified = bathroom.rating_count > 0;

  // Format features into an array for compact display
  const features = [];
  if (bathroom.gender_neutral)
    features.push({ icon: "people", label: "Gender Neutral" });
  if (bathroom.is_accessible)
    features.push({ icon: "accessibility", label: "Accessible" });
  if (bathroom.requires_key)
    features.push({ icon: "key", label: "Key Required" });
  if (bathroom.requires_purchase)
    features.push({ icon: "cash", label: "Purchase Required" });

  return (
    <Marker
      key={`verified-${bathroom.id}`}
      coordinate={{
        latitude: bathroom.lat,
        longitude: bathroom.lng,
      }}
      title={bathroom.name}
    >
      <Image
        source={require("../assets/images/crown1.png")}
        style={styles.markerImage}
      />
      <Callout
        onPress={() =>
          router.push({
            pathname: "/verified-bathroom",
            params: {
              id: bathroom.id,
              venue: JSON.stringify(bathroom),
            },
          })
        }
        style={styles.pressable}
        tooltip
      >
        <View style={styles.calloutContainer}>
          <LinearGradient
            colors={["#ffffff", "#f8fafc"]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header with name and badge */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {bathroom.name}
              </Text>
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
                    name={
                      isHighlyRated ? "shield-checkmark" : "checkmark-circle"
                    }
                    size={12}
                    color="#FFFFFF"
                  />
                  <Text style={styles.verifiedText}>
                    {isHighlyRated ? "TOP" : "VERIFIED"}
                  </Text>
                </View>
              )}
            </View>

            {/* Distance and address in one row */}
            <View style={styles.infoRow}>
              <View style={styles.distanceBadge}>
                <Ionicons name="location" size={12} color="#3B82F6" />
                <Text style={styles.distanceText}>
                  {(bathroom.distance_meters / 1609.34).toFixed(1)} mi
                </Text>
              </View>
              <Text style={styles.addressText} numberOfLines={1}>
                {bathroom.address}
              </Text>
            </View>

            {/* Average rating */}
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={
                      i < Math.floor(averageRating)
                        ? "star"
                        : i < averageRating
                        ? "star-half"
                        : "star-outline"
                    }
                    size={14}
                    color={i < averageRating ? "#F59E0B" : "#94A3B8"}
                    style={styles.starIcon}
                  />
                ))}
                <Text style={styles.ratingText}>
                  ({averageRating.toFixed(1)})
                </Text>
              </View>
            </View>

            {/* Features shown as icons */}
            {features.length > 0 && (
              <View style={styles.featuresContainer}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureIconContainer}>
                    <Ionicons
                      name={feature.icon as any}
                      size={14}
                      color="#818CF8"
                    />
                    <Text style={styles.featureIconText}>
                      {feature.label.charAt(0)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* View details link */}
            <View style={styles.viewDetailsContainer}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons name="chevron-forward" size={14} color="#3B82F6" />
            </View>
          </LinearGradient>
          <View style={styles.arrowContainer}>
            <View style={styles.arrowDown} />
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 260,
  },
  calloutContainer: {
    position: "relative",
  },
  markerImage: {
    width: 48,
    height: 48,
  },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
    marginRight: 4,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedBadgeBlue: {
    backgroundColor: "#3B82F6",
  },
  verifiedBadgeGold: {
    backgroundColor: "#F59E0B",
  },
  verifiedText: {
    color: "white",
    fontSize: 8,
    fontWeight: "700",
    marginLeft: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  distanceText: {
    color: "#3B82F6",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 2,
  },
  addressText: {
    fontSize: 11,
    color: "#64748B",
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginRight: 4,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginRight: 1,
  },
  ratingText: {
    fontSize: 10,
    color: "#64748B",
    marginLeft: 2,
  },
  featuresContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  featureIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
  },
  featureIconText: {
    fontSize: 10,
    color: "#6366F1",
    marginLeft: 2,
    fontWeight: "700",
  },
  viewDetailsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
    marginRight: 2,
  },
  arrowContainer: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
    width: 20,
    height: 10,
    overflow: "hidden",
  },
  arrowDown: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#f8fafc",
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
