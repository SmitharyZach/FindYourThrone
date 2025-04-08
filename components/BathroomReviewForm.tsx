import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Fragment, useEffect, useState } from "react";
import React from "react";
import RatingPicker from "./RatingPicker";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export type BathroomReviewData = {
  clean: number;
  functional: number;
  privacy: number;
  stocked: number;
  notes: string;
};

type BathroomReviewFormProps = {
  initialValues?: Partial<BathroomReviewData>;
  bathroomId: string; // Required bathroom ID
  submitButtonText?: string;
  onSubmitSuccess: () => void;
};

export default function BathroomReviewForm({
  initialValues = {},
  bathroomId,
  submitButtonText = "DUMP YOUR THOUGHTS 💩",
  onSubmitSuccess,
}: BathroomReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<BathroomReviewData>({
    clean: initialValues.clean || 0,
    functional: initialValues.functional || 0,
    privacy: initialValues.privacy || 0,
    stocked: initialValues.stocked || 0,
    notes: initialValues.notes || "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const updateField = (field: keyof BathroomReviewData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!bathroomId) {
        Alert.alert("Error", "Missing bathroom information");
        return;
      }

      setIsSubmitting(true);

      // Create the rating
      const { error: ratingError, data: rating } = await supabase
        .from("ratings")
        .insert({
          clean_rating: formData.clean,
          functional_rating: formData.functional,
          privacy_rating: formData.privacy,
          stocked_rating: formData.stocked,
          review_text: formData.notes,
          user_id: user?.id ?? "",
          bathroom_id: bathroomId,
          is_verified_visit: true,
        })
        .select()
        .single();

      if (ratingError) {
        throw new Error(`Error creating rating: ${ratingError.message}`);
      }

      // Show success message
      Alert.alert("Success! 🚽", "Your throne review has been recorded!");

      // Call the onSubmitSuccess callback if provided
      onSubmitSuccess();
      router.push("/");
      queryClient.invalidateQueries();
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
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsVerticalScrollIndicator={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
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

          {user ? (
            <Pressable
              style={
                isSubmitting
                  ? [styles.submitButton, styles.submitButtonDisabled]
                  : styles.submitButton
              }
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "SUBMITTING..." : submitButtonText}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={
                isSubmitting
                  ? [styles.submitButton, styles.submitButtonDisabled]
                  : styles.submitButton
              }
              onPress={() => {
                onSubmitSuccess();
                router.push("/login"); // Redirect to login if user is not authenticated
              }}
            >
              <Text style={styles.submitButtonText}>Sign up to review!</Text>
            </Pressable>
          )}

          {/* Extra padding at the bottom to ensure scrollability when keyboard is up */}
          <View style={styles.bottomPadding} />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
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
    height: 200, // Extra padding at the bottom
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
  divider: {
    height: 2,
    backgroundColor: "#5D3FD3",
    opacity: 0.2,
    marginVertical: 15,
    borderRadius: 1,
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5D3FD3",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
});
