import { fetchNearbyVenues } from "@/api/placesApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationObject } from "expo-location";
import UnverifiedVenue from "@/components/UnverifiedVenue";
import { Platform } from "react-native";
import { getNearbyBathrooms } from "@/api/bathrooms";
import VerifiedBathroom from "@/components/VerifiedBathroom";

export default function Index() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh location data first
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Invalidate and refetch both queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["googleVenues"] }),
        queryClient.invalidateQueries({ queryKey: ["verifiedBathrooms"] }),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["googleVenues"],
    queryFn: () =>
      fetchNearbyVenues(location?.coords.latitude, location?.coords.longitude),
    enabled: !!location?.coords.latitude && !!location?.coords.longitude,
  });

  const { data: verifiedBathrooms, isPending: verifiedPending } = useQuery({
    queryKey: ["verifiedBathrooms"],
    queryFn: () =>
      getNearbyBathrooms({
        latitude: location?.coords.latitude!,
        longitude: location?.coords.longitude!,
      }),
    enabled: !!location?.coords.latitude && !!location?.coords.longitude,
  });

  // Filter out unverified venues that are already in our verified list
  const filteredUnverifiedVenues = useMemo(() => {
    // If we don't have verified bathrooms or Google data yet, return all Google data
    if (!verifiedBathrooms || !data) {
      return data || [];
    }

    // Create a Set of Google place IDs from verified bathrooms for O(1) lookup
    const verifiedPlaceIds = new Set(
      verifiedBathrooms.map((bathroom) => bathroom.google_place_id)
    );

    // Filter out any unverified venues that are already in our verified list
    return data.filter((venue) => !verifiedPlaceIds.has(venue.place_id));
  }, [data, verifiedBathrooms]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Determine if there are verified bathrooms
  const hasVerifiedBathrooms =
    !verifiedPending && verifiedBathrooms && verifiedBathrooms.length > 0;

  // Determine if there are unverified bathrooms (after filtering)
  const hasUnverifiedBathrooms =
    !isPending &&
    filteredUnverifiedVenues &&
    filteredUnverifiedVenues.length > 0;

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      {/* Dynamically sized sections using flexbox */}
      <View style={[styles.contentContainer, { flexDirection: "column" }]}>
        {/* Verified Thrones Section */}
        <View
          style={[
            styles.verifiedSection,
            // If we have verified bathrooms, give this section more weight
            // If we don't have verified bathrooms, adjust based on unverified
            hasVerifiedBathrooms
              ? { flex: 7 }
              : hasUnverifiedBathrooms
              ? { flex: 3 }
              : { flex: 1 },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.emoji}>🚽</Text>
            <Text style={styles.title}>Verified Thrones</Text>
          </View>

          {verifiedPending && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D3FD3" />
              <Text style={styles.loadingText}>
                Loading verified thrones...
              </Text>
            </View>
          ) : verifiedBathrooms ? (
            <FlatList
              data={verifiedBathrooms}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <VerifiedBathroom bathroom={item} key={item.id} />
              )}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#5D3FD3"]}
                  tintColor="#5D3FD3"
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No verified thrones in this area!
                  </Text>
                </View>
              }
            />
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                No verified bathrooms, rate one below to help build our
                community!
              </Text>
            </View>
          )}
        </View>

        {/* Unverified Thrones Section */}
        <View
          style={[
            styles.unverifiedSection,
            // Adjust flex based on verified and unverified bathrooms
            hasVerifiedBathrooms
              ? { flex: 3 }
              : hasUnverifiedBathrooms
              ? { flex: 7 }
              : { flex: 1 },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Unrated Bathrooms</Text>
          </View>

          {isPending && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D3FD3" />
              <Text style={styles.loadingText}>
                Finding the nearest facilities...
              </Text>
            </View>
          ) : isError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Oops! {error?.message}</Text>
              <Text style={styles.errorSubtext}>
                We couldn't locate any thrones nearby.
              </Text>
            </View>
          ) : filteredUnverifiedVenues ? (
            <FlatList
              data={filteredUnverifiedVenues}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <UnverifiedVenue key={item.place_id} venue={item} />
              )}
              keyExtractor={(item) => item.place_id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#5D3FD3"]}
                  tintColor="#5D3FD3"
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No thrones to verify in this area!
                  </Text>
                </View>
              }
            />
          ) : null}
        </View>
      </View>
      <View style={styles.decorationCircle1} />
      <View style={styles.decorationCircle2} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFDD0",
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    flex: 1, // Take up all available space
    flexDirection: "column",
  },
  // Dynamic section heights based on content
  verifiedSection: {
    flex: 1, // Uses flexbox for dynamic sizing
    minHeight: 100, // Minimum height even when empty
    overflow: "hidden",
  },
  unverifiedSection: {
    flex: 1, // Uses flexbox for dynamic sizing
    minHeight: 100, // Minimum height even when empty
    overflow: "hidden",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  emoji: {
    fontSize: 32,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D3FD3",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5D3FD3",
    marginVertical: 10,
    marginLeft: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#5D3FD3",
    fontStyle: "italic",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5D3FD3",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: "#5D3FD3",
    textAlign: "center",
    opacity: 0.8,
  },
  listContainer: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#5D3FD3",
    textAlign: "center",
    fontStyle: "italic",
  },
  decorationCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(93, 63, 211, 0.1)",
    top: -50,
    right: -70,
    zIndex: -1,
  },
  decorationCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    bottom: -30,
    left: -40,
    zIndex: -1,
  },
});
