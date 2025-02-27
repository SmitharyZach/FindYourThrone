import { Venue } from "@/api/placesApi"
import { View, Text, StyleSheet } from "react-native"

export default function UnverifiedVenue({ venue }: { venue: Venue }) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{venue.name}</Text>
            <Text style={styles.cardRating}>Rating: {venue.rating || 'N/A'}</Text>
            <Text style={styles.cardVicinity}>{venue.vicinity}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFD700',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        width: '90%',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardRating: {
        fontSize: 16,
        color: '#666',
    },
    cardVicinity: {
        fontSize: 14,
        color: '#999',
    },
})  