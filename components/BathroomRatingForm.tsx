import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import ToggleOption from "./ToggleOption";
import RatingPicker from "./RatingPicker";
import { supabase } from "@/lib/supabase";
import { Venue } from "@/api/placesApi";
import { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { openMaps } from "@/utils/mapUtils";

export type BathroomRatingData = {
  clean: number;
  functional: number;
  privacy: number;
  stocked: number;
  isGenderNeutral: boolean;
  purchaseRequired: boolean;
  keyRequired: boolean;
  bathroomCode: string;
  notes: string;
};

type BathroomRatingFormProps = {
  initialValues?: Partial<BathroomRatingData>;
  venue?: Venue;
  submitButtonText?: string;
  onSubmitSuccess: () => void;
};

export default function BathroomRatingForm({
  initialValues = {},
  venue,
  submitButtonText = "DUMP YOUR THOUGHTS! 💩",
  onSubmitSuccess,
}: BathroomRatingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<BathroomRatingData>({
    clean: initialValues.clean || 0,
    functional: initialValues.functional || 0,
    privacy: initialValues.privacy || 0,
    stocked: initialValues.stocked || 0,
    isGenderNeutral: initialValues.isGenderNeutral || false,
    purchaseRequired: initialValues.purchaseRequired || false,
    keyRequired: initialValues.keyRequired || false,
    bathroomCode: initialValues.bathroomCode || "",
    notes: initialValues.notes || "",
  });
  const handleOpenMaps = () => {
    openMaps({
      name: venue?.name,
      address: venue?.formattedAddress ?? "",
      latitude: venue?.location?.latitude ?? 0,
      longitude: venue?.location?.longitude ?? 0,
    }).catch((err) => {
      // Handle any errors here (optional)
      console.log("Failed to open maps", err);
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const updateField = (field: keyof BathroomRatingData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // First, create the bathroom
      const { data: bathroom, error: bathroomError } = await supabase
        .from("bathrooms")
        .insert({
          name: venue?.name,
          address: venue?.formattedAddress,
          location: `SRID=4326;POINT(${venue?.location?.longitude} ${venue?.location?.latitude})`, // Note: longitude comes first!
          gender_neutral: formData.isGenderNeutral,
          code: formData.bathroomCode,
          google_place_id: venue?.place_id,
          requires_key: formData.keyRequired,
          requires_purchase: formData.purchaseRequired,
          added_by_user_id: user?.id,
          lat: venue?.location?.latitude,
          lng: venue?.location?.longitude,
        })
        .select()
        .single();

      if (bathroomError) {
        throw new Error(`Error creating bathroom: ${bathroomError.message}`);
      }

      // Then create the rating
      const { error: ratingError, data: rating } = await supabase
        .from("ratings")
        .insert({
          clean_rating: formData.clean,
          functional_rating: formData.functional,
          privacy_rating: formData.privacy,
          stocked_rating: formData.stocked,
          review_text: formData.notes,
          user_id: user?.id ?? "",
          bathroom_id: bathroom.id,
          is_verified_visit: true,
        })
        .select()
        .single();

      if (ratingError) {
        throw new Error(`Error creating rating: ${ratingError.message}`);
      }

      queryClient.invalidateQueries();

      // Call the onSubmit prop with the success
      onSubmitSuccess();
      // Show success message
      Alert.alert("Success! 🚽", "Your throne review has been recorded!");
    } catch (error) {
      console.error("Error submitting bathroom rating:", error);
      Alert.alert("Error", "Failed to submit your review. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoidingContainer}
      keyboardVerticalOffset={90} // Adjust this value based on your header height
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.venueInfoCard}>
              <Text style={styles.venueName}>{venue?.name}</Text>
              <Text style={styles.venueAddress}>{venue?.formattedAddress}</Text>
              <Pressable
                onPress={handleOpenMaps}
                style={[styles.actionButton, styles.secondaryButton]}
              >
                <Text style={styles.secondaryButtonText}>📍 Directions</Text>
              </Pressable>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>
                How would you rate this throne?
              </Text>
              <RatingPicker
                value={formData.clean}
                onChange={(value) => updateField("clean", value)}
                title="Clean"
              />

              <RatingPicker
                value={formData.functional}
                onChange={(value) => updateField("functional", value)}
                title="Functional"
              />
              <RatingPicker
                value={formData.privacy}
                onChange={(value) => updateField("privacy", value)}
                title="Privacy"
              />
              <RatingPicker
                value={formData.stocked}
                onChange={(value) => updateField("stocked", value)}
                title="Well Stocked"
              />

              <View style={styles.divider} />

              <Text style={styles.subsectionTitle}>Bathroom Details</Text>

              <ToggleOption
                label="Gender Neutral Bathroom?"
                value={formData.isGenderNeutral}
                onToggle={() =>
                  updateField("isGenderNeutral", !formData.isGenderNeutral)
                }
                id="isGenderNeutral"
              />

              <ToggleOption
                label="Purchase Required to Use?"
                value={formData.purchaseRequired}
                onToggle={() =>
                  updateField("purchaseRequired", !formData.purchaseRequired)
                }
                id="purchaseRequired"
              />

              <ToggleOption
                label="Key Required for Use?"
                value={formData.keyRequired}
                onToggle={() =>
                  updateField("keyRequired", !formData.keyRequired)
                }
                id="keyRequired"
              />

              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Bathroom Code (if any):</Text>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Enter code here..."
                  placeholderTextColor="#9879E9"
                  value={formData.bathroomCode}
                  onChangeText={(value) => updateField("bathroomCode", value)}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Throne Notes:</Text>
                <TextInput
                  style={styles.notesInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Share your royal flush of thoughts..."
                  placeholderTextColor="#9879E9"
                  value={formData.notes}
                  onChangeText={(value) => updateField("notes", value)}
                />
              </View>
            </View>

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{submitButtonText}</Text>
            </Pressable>

            {/* Extra padding at the bottom to ensure scrollability when keyboard is up */}
            <View style={styles.bottomPadding} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    height: "100%",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 50, // Extra padding at the bottom
  },
  venueInfoCard: {
    backgroundColor: "#FFD700",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 15,
    transform: [{ rotate: "-1deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  venueName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5D3FD3",
    textAlign: "center",
  },
  venueAddress: {
    fontSize: 14,
    color: "#5D3FD3",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
  ratingSection: {
    backgroundColor: "#FFFDD0",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: "#3A2784",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5D3FD3",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D3FD3",
    marginBottom: 8,
  },
  ratingButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingButton: {
    padding: 5,
  },
  ratingIcon: {
    fontSize: 28,
    opacity: 0.6,
  },
  ratingIconSelected: {
    opacity: 1,
  },
  divider: {
    height: 2,
    backgroundColor: "#5D3FD3",
    opacity: 0.2,
    marginVertical: 15,
    borderRadius: 1,
  },
  subsectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#5D3FD3",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(93, 63, 211, 0.05)",
    padding: 10,
    borderRadius: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D3FD3",
    width: "60%",
  },
  toggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    marginHorizontal: 8,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  toggleText: {
    fontSize: 14,
    color: "#777",
  },

  toggleTextSelected: {
    color: "#5D3FD3",
    fontWeight: "600",
  },
  codeContainer: {
    marginBottom: 15,
    marginTop: 15,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D3FD3",
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#5D3FD3",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#5D3FD3",
  },
  notesContainer: {
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D3FD3",
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#5D3FD3",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#5D3FD3",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#FFD700",
    marginHorizontal: 40,
    marginTop: 30,
    padding: 18,
    borderRadius: 25,
    alignItems: "center",
    transform: [{ rotate: "-1deg" }],
    shadowColor: "#3A2784",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#5D3FD3",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5D3FD3",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    marginTop: 5,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#5D3FD3", // Primary blue color for the border
  },
  secondaryButtonText: {
    color: "#5D3FD3", // Primary blue color for the text
    fontWeight: "bold",
    fontSize: 14,
  },
});
