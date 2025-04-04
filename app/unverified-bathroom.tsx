import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import BathroomRatingForm from "@/components/BathroomRatingForm";

export default function UnverifiedBathroomScreen() {
  const params = useLocalSearchParams();
  const venue = params.venue ? JSON.parse(params.venue as string) : null;
  const router = useRouter();

  const handleRatingSubmit = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Rate This Throne!</Text>
          <View style={styles.toiletIconContainer}>
            <Text style={styles.toiletIcon}>🚽</Text>
          </View>
        </View>
        <Text style={styles.text}>
          Be the first to rate this throne and add it to our comunnity!{" "}
        </Text>

        <BathroomRatingForm
          onSubmitSuccess={handleRatingSubmit}
          venue={venue}
        />
      </ScrollView>

      {/* Decorative elements */}
      <View style={styles.decorationCircle1} />
      <View style={styles.decorationCircle2} />
      <View style={styles.decorationCircle3} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5D3FD3",
    position: "relative",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  text: {
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-5deg" }],
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D3FD3",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
    textShadowColor: "#3A2784",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  toiletIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  toiletIcon: {
    fontSize: 28,
    transform: [{ rotate: "5deg" }],
  },
  decorationCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    top: -80,
    right: -50,
    zIndex: -1,
  },
  decorationCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 208, 0.2)",
    bottom: 100,
    left: -40,
    zIndex: -1,
  },
  decorationCircle3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    bottom: -30,
    right: -30,
    zIndex: -1,
  },
});
