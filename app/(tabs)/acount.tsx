import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import * as Linking from "expo-linking";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Adjust path if needed

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);

        // Fetch ratings count from the ratings table
        if (user) {
          const { count, error } = await supabase
            .from("ratings")
            .select("*", { count: "exact" })
            .eq("user_id", user.id);

          if (error) {
            console.error("Error fetching ratings:", error);
          } else {
            setReviewCount(count || 0);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      Alert.alert(
        "Logout Error",
        "There was a problem signing out. Please try again."
      );
      console.error("Logout error:", error);
    }
  };

  const handleContactSupport = async () => {
    const email = "znathanielsmith@gmail.com";
    const subject = "Find Your Throne - Support Request";
    const body = `
User ID: ${user?.id || "Not available"}
User Email: ${user?.email || "Not available"}

Please describe your issue here:
`;

    // Use Expo's Linking module
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    try {
      // Expo's Linking.openURL doesn't require canOpenURL check and works better with Expo
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening email client:", error);

      // Fallback to showing the email address if opening the mail client fails
      Alert.alert("Email Support", `Please email us at: ${email}`, [
        { text: "OK", style: "default" },
      ]);
    }
  };

  const handleBuyMeACoffee = async () => {
    const url = "https://buymeacoffee.com/findyourthrone";

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening Buy Me a Coffee:", error);
      Alert.alert(
        "Cannot Open Link",
        "Please visit buymeacoffee.com/findyourthrone in your browser"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      {/* Profile Card */}
      <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileIconContainer}>
            <Ionicons name="person-circle" size={80} color="#5D3FD3" />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.emailLabel}>Email Address</Text>
            <Text style={styles.emailValue}>
              {user?.email || "Not available"}
            </Text>

            <View style={styles.accountBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
              <Text style={styles.accountBadgeText}>VERIFIED USER</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{reviewCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Contact Support Button */}
      <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable
          onPress={handleContactSupport}
          style={({ pressed }) => [
            styles.supportButton,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Ionicons name="mail" size={18} color="#FFFFFF" />
          <Text style={styles.supportText}>Contact Support</Text>
        </Pressable>
      </LinearGradient>

      {/* Buy Me a Coffee Button */}
      <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable
          onPress={handleBuyMeACoffee}
          style={({ pressed }) => [
            styles.coffeeButton,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Ionicons name="cafe" size={18} color="#FFFFFF" />
          <Text style={styles.coffeeText}>Support the Project</Text>
        </Pressable>
      </LinearGradient>

      {/* Logout Button */}
      <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Ionicons name="log-out" size={18} color="#FFFFFF" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Find Your Throne v1.0.2</Text>
      </View>

      <View style={styles.decorationCircle1} />
      <View style={styles.decorationCircle2} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDD0",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
  },
  card: {
    margin: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIconContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  emailLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  emailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  accountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5D3FD3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  accountBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#1E293B",
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D3FD3",
    paddingVertical: 14,
    borderRadius: 12,
  },
  supportText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  coffeeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFDD00",
    paddingVertical: 14,
    borderRadius: 12,
  },
  coffeeText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: "#64748B",
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
