// utils/bathroomUtils.ts

import { Bathroom, BathroomData, Feature } from "@/api/bathrooms";

/**
 * Creates derived bathroom data for display from the bathroom object
 */
export const createBathroomData = (bathroom: Bathroom | null): BathroomData => {
  if (!bathroom) {
    return {
      name: "Unnamed Bathroom",
      address: "No address available",
      rating: "0",
      reviewCount: 0,
      features: [],
      description: "No additional details available for this bathroom.",
      distance: "Distance unknown",
      status: "Status unknown",
    };
  }

  // Calculate average rating from the different rating categories
  const averageRating = (
    (bathroom.clean_rating +
      bathroom.functional_rating +
      bathroom.privacy_rating +
      bathroom.stocked_rating) /
    4
  ).toFixed(1);

  // Format distance in a human-readable format
  const formattedDistance = bathroom.distance_meters
    ? bathroom.distance_meters < 1000
      ? `${bathroom.distance_meters.toFixed(0)}m`
      : `${(bathroom.distance_meters / 1000).toFixed(1)}km`
    : "Distance unknown";

  // Determine operational status text
  const statusText =
    bathroom.is_operational !== undefined
      ? bathroom.is_operational
        ? "Operational"
        : "Not operational"
      : "Status unknown";

  // Generate features based on bathroom properties
  const features: Feature[] = [
    ...(bathroom.is_accessible ? [{ icon: "♿", label: "Accessible" }] : []),
    ...(bathroom.gender_neutral
      ? [{ icon: "🚻", label: "Gender Neutral" }]
      : []),
    ...(bathroom.requires_key ? [{ icon: "🔑", label: "Key Required" }] : []),
    ...(bathroom.requires_purchase
      ? [{ icon: "💲", label: "Purchase Req." }]
      : []),
    ...(bathroom.clean_rating >= 4 ? [{ icon: "✨", label: "Clean" }] : []),
    ...(bathroom.privacy_rating >= 4 ? [{ icon: "🔒", label: "Private" }] : []),
    ...(bathroom.stocked_rating >= 4
      ? [{ icon: "🧻", label: "Well Stocked" }]
      : []),
    ...(bathroom.functional_rating >= 4
      ? [{ icon: "👍", label: "Functional" }]
      : []),
    ...(bathroom.code ? [{ icon: "🔢", label: "Code Required" }] : []),
  ];

  return {
    name: bathroom.name || "Unnamed Bathroom",
    address: bathroom.address || "No address available",
    rating: averageRating,
    reviewCount: bathroom.rating_count || 0,
    features,
    description:
      bathroom.description ||
      "No additional details available for this bathroom.",
    distance: formattedDistance,
    status: statusText,
  };
};
