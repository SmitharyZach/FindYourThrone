import { fetchNearbyVenues } from "@/api/placesApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import * as Location from 'expo-location'; // Import the Location module
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { LocationObject } from "expo-location";
import UnverifiedVenue from "@/components/UnverifiedVenue";
import { Platform } from "react-native";

export default function Index() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['googleVenues'],
    queryFn: () => fetchNearbyVenues(location?.coords.latitude, location?.coords.longitude),
    enabled: !!location?.coords.latitude && !!location?.coords.longitude
  })
  console.log("error", errorMsg)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.emoji}>💩</Text>
        <Text style={styles.title}>Unverified Thrones</Text>
      </View>

      {isPending && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
          <Text style={styles.loadingText}>Finding the nearest facilities...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Oops! {error?.message}</Text>
          <Text style={styles.errorSubtext}>We couldn't locate any thrones nearby.</Text>
        </View>
      )}

      {data && <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <UnverifiedVenue key={item.place_id} venue={item} />
        )}
        keyExtractor={(item) => item.place_id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No thrones to verify in this area!</Text>
          </View>
        }
      />}

      <View style={styles.decorationCircle1} />
      <View style={styles.decorationCircle2} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFDD0",
    flex: 1,
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#5D3FD3',
    fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'normal',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#5D3FD3',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D3FD3',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#5D3FD3',
    textAlign: 'center',
    opacity: 0.8,
  },
  listContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#5D3FD3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  decorationCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(93, 63, 211, 0.1)',
    top: -50,
    right: -70,
    zIndex: -1,
  },
  decorationCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    bottom: -30,
    left: -40,
    zIndex: -1,
  },
});