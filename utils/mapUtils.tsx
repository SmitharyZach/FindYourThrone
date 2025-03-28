import { Linking, Platform } from "react-native";

type LocationData = {
  name?: string;
  address: string;
  latitude: number;
  longitude: number;
};

/**
 * Opens the device's default maps application with the specified location
 * @param location An object containing address and coordinates
 */
export const openMaps = (location: LocationData): Promise<void> => {
  const { name, address, latitude, longitude } = location;

  // Use name as label if available, otherwise use address
  const label = encodeURIComponent(name || address);

  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${encodeURIComponent(address)}`,
    default: `https://maps.google.com/maps?q=${label}&ll=${latitude},${longitude}`,
  });

  return Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        return Linking.openURL(
          `https://maps.google.com/maps?q=${encodeURIComponent(address)}`
        );
      }
    })
    .catch((error) => {
      console.error("Error opening maps:", error);
      // Re-throw to allow caller to handle error
      throw error;
    });
};
