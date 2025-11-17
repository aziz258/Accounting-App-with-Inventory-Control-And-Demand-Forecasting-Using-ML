import React from 'react';
import { View, Text, StyleSheet, ImageBackground, button } from 'react-native';

const Welcome = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREhM2hDwY1j30lOn3qdmX5UJ3YpN--4wBBa02rKwbuqr3mDvB8wyUwKF2NEXmsyjeCv4U&usqp=CAU' }}
      style={styles.background}
    >
      <View style={styles.content}>
        <Text style={styles.text}>Hello, here we provide you sports related products!</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    color: 'black',
    fontWeight:"bold",
    margin: 15,
    marginBottom: 150
  },
});

export default Welcome;