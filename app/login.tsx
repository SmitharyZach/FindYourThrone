// ... existing code ...
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Animated
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleLogin from '@/components/GoogleLogin';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
    const { signIn, signUp } = useAuth();
    const buttonScale = new Animated.Value(1);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            if (isLogin) {
                await signIn({ email, password });
            } else {
                await signUp({ email, password });
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.emoji}>💩</Text>
                        <Text style={styles.appTitle}>Find Your Throne</Text>
                        <Text style={styles.tagline}>Relief is just a flush away!</Text>
                    </View>
                    <View style={styles.formCard}>
                        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                        <GoogleLogin />

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#5D3FD3"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor="#5D3FD3"
                            />
                        </View>

                        <TouchableOpacity
                            onPressIn={animateButton}
                            onPress={handleAuth}
                            disabled={loading}
                        >
                            <Animated.View
                                style={[
                                    styles.button,
                                    { transform: [{ scale: buttonScale }] }
                                ]}
                            >
                                <Text style={styles.buttonText}>
                                    {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                            <Text style={styles.toggleText}>
                                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.decorationCircle1} />
                    <View style={styles.decorationCircle2} />
                    <View style={styles.decorationCircle3} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFDD0',
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    emoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    appTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#5D3FD3',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'normal',
    },
    tagline: {
        fontSize: 16,
        color: '#5D3FD3',
        marginTop: 5,
        fontStyle: 'italic',
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#5D3FD3',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(93, 63, 211, 0.2)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#5D3FD3',
    },
    inputContainer: {
        backgroundColor: '#FFFDD0',
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#FFD700',
        overflow: 'hidden',
    },
    input: {
        padding: 15,
        fontSize: 16,
        color: '#5D3FD3',
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#5D3FD3',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#5D3FD3',
        fontWeight: 'bold',
        fontSize: 16,
    },
    toggleText: {
        color: '#5D3FD3',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: '500',
    },
    decorationCircle1: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(93, 63, 211, 0.2)',
        top: 50,
        left: -50,
        zIndex: -1,
    },
    decorationCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        bottom: 30,
        right: -80,
        zIndex: -1,
    },
    decorationCircle3: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(93, 63, 211, 0.15)',
        top: 150,
        right: 20,
        zIndex: -1,
    },
});

export default LoginScreen;