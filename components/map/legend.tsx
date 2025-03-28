import { View, Image, Text } from "react-native";
import { styles } from "@/components/styles/mapViewStyles";

export default function Legend() {
  return (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={styles.markerContainer}>
          <Image
            source={require("../../assets/images/crown1.png")}
            style={styles.legendCrownMarkerImage}
          />
        </View>
        <Text style={styles.legendText}>Verified</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={styles.markerContainer}>
          <Image
            source={require("../../assets/images/toilet.png")}
            style={styles.legendThroneMarkerImage}
          />
        </View>
        <Text style={styles.legendText}>Unverified</Text>
      </View>
    </View>
  );
}
