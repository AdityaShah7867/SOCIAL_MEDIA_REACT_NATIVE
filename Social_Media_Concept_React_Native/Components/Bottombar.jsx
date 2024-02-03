import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Bottombar = () => {
  const navigation = useNavigation();

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Home')}>
        <Ionicons name="home-outline" size={24} color="black" />
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Friends')}>
        <Ionicons name="people-outline" size={24} color="black" />
        <Text>Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Post')}>
        <Ionicons name="create-outline" size={24} color="black" />
        <Text>Post</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Updates')}>
        <Ionicons name="notifications-outline" size={24} color="black" />
        <Text>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Profile')}>
        <Ionicons name="person-outline" size={24} color="black" />
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
  },
  button: {
    alignItems: 'center',
  },
});

export default Bottombar;
