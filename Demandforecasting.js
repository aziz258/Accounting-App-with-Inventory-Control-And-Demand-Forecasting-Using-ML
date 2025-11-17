import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

const Demandforecasting = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Demand Forecasting</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ForeCast')}
          activeOpacity={0.7}>
          <Icon name="account-plus" size={28} color="white" />
          <Text style={styles.buttonText}>Product wise forecast</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GraphicalForeCast')}
          activeOpacity={0.7}>
          <Icon name="account-edit" size={28} color="white" />
          <Text style={styles.buttonText}>Graphically forecast</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CombineGraphicalForeCast')}
          activeOpacity={0.7}>
          <Icon name="cash-plus" size={28} color="white" />
          <Text style={styles.buttonText}>High Demand products</Text>
        </TouchableOpacity>

        

      </View>
      <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                <Ionicons name="home-outline" size={28} color="white" />
            </TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="white" />
            <TouchableOpacity onPress={() => navigation.navigate("LogOut")}>
                <Ionicons name="settings-outline" size={28} color="white" />
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    width: '100%',
    backgroundColor: '#34495E', // Elegant purple background
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  heading: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 2,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9', // Sleek blue background
    paddingVertical: 18,
    borderRadius: 15,
    marginVertical: 15,
    justifyContent: 'center',
    shadowColor: '#34495e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10, // Enhanced shadow for iOS
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 15,
    letterSpacing: 1.2,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#34495E', // Dark blue-gray for the footer
    paddingVertical: 12,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
},
});

export default Demandforecasting;
