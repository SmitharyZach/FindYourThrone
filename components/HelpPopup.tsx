import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

interface HelpPopupProps {
  visible: boolean;
  onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Find Your Throne</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="close" size={24} color="#5D3FD3" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalText}>
              Discover nearby restrooms with verified ratings, access codes, and
              essential details like gender-neutral options and toiletry
              availability—all at your fingertips.
            </Text>
            <Text style={styles.sectionTitle}>Map Features</Text>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>
                <Text style={styles.bold}>Verified Bathrooms:</Text> Marked with
                a royal crown icon. These premium spots have been thoroughly
                reviewed with essential details added by our community!
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>
                <Text style={styles.bold}>Unverified Bathrooms:</Text>{" "}
                Unverified Bathrooms: Identified by a toilet icon. Be a
                trailblazer, tap to add the first review and claim your status
                as a bathroom hero!
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureText}>
                <Text style={styles.bold}>Refresh Button:</Text> While the map
                automatically updates as you navigate, tap this button anytime
                you need to instantly reveal nearby thrones that may not be
                displaying.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Using the App</Text>
            <Text style={styles.modalText}>
              1. Navigate your realm: Pan and zoom to discover thrones in any
              territory.
            </Text>
            <Text style={styles.modalText}>
              2. Royal sources: Bathrooms appear from our exclusive database or
              Google when not yet knighted by our bathroom heroes.
            </Text>
            <Text style={styles.modalText}>
              3. Join the kingdom: Create your royal account from the account
              tab!
            </Text>
            <Text style={styles.modalText}>
              4. Inspect your options: Tap any marker to reveal a bathroom's
              secrets.
            </Text>
            <Text style={styles.modalText}>
              5. Share your wisdom: Rate and review to guide fellow
              throne-seekers on their journeys.
            </Text>
            <View style={styles.spacer} />
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#5D3FD3",
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    maxHeight: height * 0.6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5D3FD3",
    marginTop: 15,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
  spacer: {
    height: 20,
  },
  doneButton: {
    backgroundColor: "#5D3FD3",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  doneButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default HelpPopup;
