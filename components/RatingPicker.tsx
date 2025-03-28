import React, { useId } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface RatingPickerProps {
    value: number;
    onChange: (value: number) => void;
    title: string;
    id?: string; // Optional unique identifier
    maxRating?: number; // Optional to make rating scale customizable
}

const RatingPicker = ({
    value,
    onChange,
    title,
    id,
    maxRating = 5, // Default to 5-star rating
}: RatingPickerProps) => {
    // Generate a unique ID if one isn't provided
    const generatedId = useId();
    const ratingId = id || generatedId;

    // Handle rating press with half rating support
    const handleRatingPress = (position: number) => {
        // If current value is this exact position, decrease by 0.5
        if (value === position) {
            onChange(position - 0.5);
        }
        // If current value is 0.5 less than this position, decrease to next lower integer
        else if (value === position - 0.5) {
            onChange(Math.floor(position - 1));
        }
        // Otherwise set to this position
        else {
            onChange(position);
        }
    };

    // Function to render each rating item
    const renderRatingItem = (position: number) => {
        // Determine which icon to display based on the current value
        let icon = '⚫'; // Purple dot for empty state

        if (value >= position) {
            icon = '👑'; // Full rating
        } else if (value >= position - 0.5) {
            icon = '🌗'; // Half rating
        }

        return (
            <Pressable
                key={`rating-${ratingId}-${position}`}
                onPress={() => handleRatingPress(position)}
                style={styles.ratingButton}
                testID={`rating-button-${ratingId}-${position}`}
                accessibilityLabel={`Rating ${position} of ${maxRating}`}
                accessibilityRole="button"
            >
                <Text
                    style={[
                        styles.ratingIcon,
                        icon === '⚫' ? styles.ratingIconEmpty : null,
                        value >= position - 0.5 ? styles.ratingIconActive : null,
                        value >= position ? styles.ratingIconFull : null,
                    ]}
                >
                    {icon}
                </Text>
            </Pressable>
        );
    };

    return (
        <View
            style={styles.ratingContainer}
            testID={`rating-container-${ratingId}`}
        >
            <Text style={styles.ratingTitle}>
                {title} <Text style={styles.ratingValue}>({value})</Text>
            </Text>
            <View style={styles.ratingButtons}>
                {Array.from({ length: maxRating }, (_, i) => i + 1).map(renderRatingItem)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ratingContainer: {
        marginVertical: 10,
    },
    ratingTitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    ratingValue: {
        fontSize: 14,
        color: '#666',
    },
    ratingButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    ratingButton: {
        padding: 10,
        marginHorizontal: 5,
    },
    ratingIcon: {
        fontSize: 24,
        opacity: 0.5,
    },
    ratingIconEmpty: {
        color: '#5D3FD3', // Purple dot for empty state
    },
    ratingIconActive: {
        opacity: 0.8,
    },
    ratingIconFull: {
        opacity: 1,
    },
});

export default RatingPicker;