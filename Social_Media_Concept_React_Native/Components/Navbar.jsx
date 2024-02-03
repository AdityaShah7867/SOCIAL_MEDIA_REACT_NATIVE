import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const Navbar = () => {
  return (
    <View style={styles.container}>
      {/* Left Circle with Profile Image */}
      <TouchableOpacity style={styles.leftCircle}>
        <Image
          source={{ uri: 'https://avatars.githubusercontent.com/u/121731399?s=400&u=c34d7d9dbece397ef8977c7eb1220d770e94c692&v=4' }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* Centered Search Bar */}
      <View style={styles.centerContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#a9a9a9"
        />
      </View>

      {/* Right Chat Icon */}
      <TouchableOpacity style={styles.rightIcon}>
        <Ionicons name="chatbubble-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ffffff',
    // elevation: 3, // for Android shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.2, // for iOS shadow
    borderBottomWidth: 1,
  },
  leftCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    color: '#a9a9a9',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    
  },
  centerContainer: {
    flex: 1,
    marginLeft: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default Navbar;
