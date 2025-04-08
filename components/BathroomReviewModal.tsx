import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import BathroomReviewForm from "./BathroomReviewForm";
import { useRouter } from "expo-router";

interface BathroomReviewModalProps {
  visible: boolean;
  onClose: () => void;
  bathroomId: string;
  bathroomName?: string;
}

const BathroomReviewModal: React.FC<BathroomReviewModalProps> = ({
  visible,
  onClose,
  bathroomId,
  bathroomName,
}) => {
  const router = useRouter();
  const handleSubmitSuccess = () => {
    // Close the modal after successful submission
    onClose();
    // You might want to add a callback here to refresh the reviews list
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Throne Review</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={styles.formContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <BathroomReviewForm
                bathroomId={bathroomId}
                submitButtonText="Dump your thoughts! 🚽"
                onSubmitSuccess={handleSubmitSuccess}
              />
            </ScrollView>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBlur: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D3FD3",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(93, 63, 211, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#5D3FD3",
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    paddingBottom: 30,
  },
});

export default BathroomReviewModal;
