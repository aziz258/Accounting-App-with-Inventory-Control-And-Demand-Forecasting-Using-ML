import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LogoutScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Logic to handle logout can be added here.
    // For example, you can clear user session, tokens, etc.
    
    // After logging out, navigate to the Login screen.
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/random/800x600' }} // Background image
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Icon name="logout" size={70} color="white" style={styles.icon} />
          <Text style={styles.title}>Log Out</Text>
          <Text style={styles.subtitle}>Are you sure you want to log out?</Text>
          <Text style={styles.description}>You will be logged out from the app, and your session will end.</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(128, 128, 128, 0.7)', // Apply gray color with some transparency
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15, // Rounded corners for a modern look
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
     // Max width to avoid overly stretched content
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 10, // Soft shadow for depth
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50', // Dark color for title
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d', // Light gray color for subtitle
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#95a5a6', // Lighter gray for the description text
    marginBottom: 25,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#e74c3c', // Bold red for logout button
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 8,
  },
  cancelButton: {
    backgroundColor: '#34495e', // Dark gray for cancel button
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#34495e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LogoutScreen;
