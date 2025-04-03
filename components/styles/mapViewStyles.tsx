import { Platform, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFDD0",
    flex: 1,
    height: "100%",
  },
  mapContainer: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  legendCrownMarkerImage: {
    width: 24,
    height: 24,
  },
  legendThroneMarkerImage: {
    width: 24,
    height: 28,
  },
  markerImage: {
    width: 30,
    height: 40,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  calloutContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: "#5D3FD3",
    marginBottom: 2,
  },
  calloutRating: {
    fontSize: 14,
    color: "#333",
  },
  calloutSubtext: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
  },
  legendContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    gap: 10,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  legendText: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  locationButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "white",
    width: 100,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    position: "absolute",
    top: 85,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5D3FD3",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  refresh: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5D3FD3",
    fontFamily: Platform.OS === "ios" ? "Marker Felt" : "normal",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#5D3FD3",
    fontStyle: "italic",
    padding: 20,
  },
});
