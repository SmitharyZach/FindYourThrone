import { fetchNearbyVenues } from "@/api/placesApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import * as Location from "expo-location";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationObject } from "expo-location";
import { Platform } from "react-native";
import { getNearbyBathrooms } from "@/api/bathrooms";
import MapView, { Marker, Region, Callout } from "react-native-maps";

import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ThroneMarker from "@/components/ThroneMarker";
import { debounce } from "lodash";
import { styles } from "@/components/styles/mapViewStyles";
import Legend from "@/components/map/legend";
import HelpPopup from "@/components/HelpPopup";

export default function Index() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const [showHelpPopup, setShowHelpPopup] = useState(false); // Add state for the help popup
  const queryClient = useQueryClient();
  const [isMapReady, setIsMapReady] = useState(false);
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  // Add these new state variables
  const [lastFetchedRegion, setLastFetchedRegion] = useState<Region | null>(
    null
  );
  const FETCH_THRESHOLD = 1; // Distance in km to trigger new fetch

  // Helper function to calculate distance between coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const forceRender = () => {
    if (mapRef.current && mapRegion) {
      // Slightly adjust the region to force a re-render
      const microAdjustment = 0.000001;
      const adjustedRegion = {
        ...mapRegion,
        latitude: mapRegion.latitude + microAdjustment,
      };
      mapRef.current.animateToRegion(adjustedRegion, 0);

      // Reset back to original position immediately
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(mapRegion, 0);
        }
      }, 10);
    }
  };

  // Function to determine if we should fetch new data
  const shouldFetchNewData = (newRegion: Region, lastRegion: Region) => {
    if (!lastRegion) return true;

    const distance = calculateDistance(
      newRegion.latitude,
      newRegion.longitude,
      lastRegion.latitude,
      lastRegion.longitude
    );

    return distance > FETCH_THRESHOLD;
  };

  // Center map on user location
  const centerOnUserLocation = () => {
    queryClient.invalidateQueries({ queryKey: ["googleVenues"] });
    queryClient.invalidateQueries({ queryKey: ["verifiedBathrooms"] });
  };
  const router = useRouter();
  const handleRegionChangeComplete = useCallback(
    debounce((newRegion: Region) => {
      setMapRegion(newRegion);
      console.log("new map region set!", newRegion);
      console.log("last fetched region", lastFetchedRegion);
      //
      if (
        lastFetchedRegion &&
        shouldFetchNewData(newRegion, lastFetchedRegion)
      ) {
        console.log("Map moved significantly, fetching new data...");
        setLastFetchedRegion(newRegion);
        // Trigger refetch by invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["googleVenues"] });
          queryClient.invalidateQueries({ queryKey: ["verifiedBathrooms"] });
        }, 200);
      }
    }, 500), // Increased debounce to 500ms for better performance
    [lastFetchedRegion, queryClient]
  );
  // Query for unverified venues based on map center
  const {
    isPending,
    isError,
    data: unverifiedBathrooms,
    error,
  } = useQuery({
    queryKey: ["googleVenues"],
    queryFn: () => fetchNearbyVenues(mapRegion?.latitude, mapRegion?.longitude),
    enabled: !!mapRegion?.latitude && !!mapRegion?.longitude,
  });

  // Query for verified bathrooms based on map center
  const { data: verifiedBathrooms } = useQuery({
    queryKey: ["verifiedBathrooms"],
    queryFn: () =>
      getNearbyBathrooms({
        latitude: mapRegion?.latitude!,
        longitude: mapRegion?.longitude!,
      }),
    enabled: !!mapRegion?.latitude && !!mapRegion?.longitude,
  });

  // Handle help button press
  const handleHelpPress = () => {
    setShowHelpPopup(true);
  };

  // Filter out unverified venues that are already in our verified list
  const filteredUnverifiedVenues = useMemo(() => {
    // If we don't have verified bathrooms or Google data yet, return all Google data
    if (!verifiedBathrooms || !unverifiedBathrooms) {
      return unverifiedBathrooms || [];
    }

    // Create a Set of Google place IDs from verified bathrooms for O(1) lookup
    const verifiedPlaceIds = new Set(
      verifiedBathrooms.map((bathroom) => bathroom.google_place_id)
    );

    // Filter out any unverified venues that are already in our verified list
    return unverifiedBathrooms.filter(
      (venue) => !verifiedPlaceIds.has(venue.place_id)
    );
  }, [unverifiedBathrooms, verifiedBathrooms]);

  const shouldShowMarkers = useMemo(() => {
    // Check if data has finished loading (not if it exists)
    // We're explicit checking for arrays rather than truthiness
    const verifiedDataReady = !isPending && Array.isArray(verifiedBathrooms);
    const unverifiedDataReady =
      !isPending && Array.isArray(filteredUnverifiedVenues);
    forceRender();

    // Only show markers when both datasets have finished loading (even if empty)
    return verifiedDataReady && unverifiedDataReady;
  }, [isPending, verifiedBathrooms, filteredUnverifiedVenues]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Set initial map region based on user's location
      if (location) {
        const { latitude, longitude } = location.coords;
        const initialRegion = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        console.log("mounted with regions", initialRegion);
        setMapRegion(initialRegion);
        setLastFetchedRegion(initialRegion);
      }
    })();
  }, []);

  // Initial loading state
  if (!mapRegion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
          <Text style={styles.loadingText}>Finding your location...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === "android" ? "google" : undefined}
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          onRegionChangeComplete={handleRegionChangeComplete}
          onMapReady={() => {
            setIsMapReady(true);
            // Force an immediate fetch of data when map is ready
            if (mapRegion) {
              queryClient.invalidateQueries({ queryKey: ["googleVenues"] });
              queryClient.invalidateQueries({
                queryKey: ["verifiedBathrooms"],
              });
            }
          }}
        >
          {/* Verified Bathroom Markers */}
          {shouldShowMarkers &&
            isMapReady &&
            verifiedBathrooms?.map((bathroom) => (
              <ThroneMarker bathroom={bathroom} key={bathroom.id} />
            ))}
          {/* Unverified Bathroom Markers */}
          {shouldShowMarkers &&
            isMapReady &&
            filteredUnverifiedVenues?.map((venue) => (
              <Marker
                key={`unverified-${venue.place_id}`}
                coordinate={{
                  latitude: venue.location?.latitude ?? 0,
                  longitude: venue.location?.longitude ?? 0,
                }}
                title={venue.name}
                description="Unverified Bathroom"
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={require("../../assets/images/toilet.png")}
                    style={styles.markerImage}
                  />
                </View>
                <Callout
                  onPress={() =>
                    router.push({
                      pathname: "/unverified-bathroom",
                      params: {
                        id: venue.place_id,
                        venue: JSON.stringify(venue),
                      },
                    })
                  }
                  tooltip
                >
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{venue.name}</Text>
                    <Text style={styles.calloutDescription}>
                      Unverified Bathroom
                    </Text>
                    <Text style={styles.calloutSubtext}>
                      Tap to rate and verify
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
        </MapView>

        <Legend />
        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={centerOnUserLocation}
        >
          <Text style={styles.refresh}>Refresh</Text>
        </TouchableOpacity>

        {/* Map Title with Help Button */}
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={handleHelpPress}
          activeOpacity={0.7}
        >
          <Text style={styles.title}>?</Text>
        </TouchableOpacity>

        {/* Help Popup */}
        <HelpPopup
          visible={showHelpPopup}
          onClose={() => setShowHelpPopup(false)}
        />
      </View>
    </View>
  );
}
