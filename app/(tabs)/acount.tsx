import { Text, View, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function AcountScreen() {
  const { signOut } = useAuth();
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    signOut();
    router.replace('/login');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acount screen</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        color="#ff6b6b"  // A reddish color for the logout button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});