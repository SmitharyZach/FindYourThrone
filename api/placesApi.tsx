const API_KEY = "AIzaSyChKYp6K_zXCLn34DxJusqNmCVwhZ33zDU";
const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";

export interface Venue {
  place_id: string;
  name: string;
  formattedAddress?: string;
  vicinity: string;
  rating?: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  // Add other fields you need
}

interface PlaceResponse {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export const fetchNearbyVenues = async (
  latitude: number | undefined,
  longitude: number | undefined,
  radius: number = 1500
): Promise<Venue[]> => {
  const requestBody = {
    includedTypes: [
      "gas_station",
      "rest_stop",
      "public_bathroom",
      "restaurant",
      "coffee_shop",
    ],
    maxResultCount: 20,
    rankPreference: "DISTANCE",
    locationRestriction: {
      circle: {
        center: {
          latitude: latitude || 0,
          longitude: longitude || 0,
        },
        radius: radius,
      },
    },
  };

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.location.latitude,places.location.longitude",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  console.log("getting new google data"); // Log the response data for debugging
  if (!response.ok) {
    throw new Error(data.error_message || "Failed to fetch venues");
  }

  return (
    data.places?.map((place: PlaceResponse) => ({
      place_id: place.id,
      name: place.displayName?.text || "",
      vicinity: place.formattedAddress || "",
      rating: place.rating,
      formattedAddress: place.formattedAddress,
      location: {
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
      },
    })) || []
  );
};
