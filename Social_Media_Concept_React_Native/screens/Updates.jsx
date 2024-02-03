import React from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const Updates = () => {
  const notifications = [
    {
      id: '1',
      userName: 'John Doe',
      userImage: 'https://media.licdn.com/dms/image/D4D03AQGwJj8FEdNtEw/profile-displayphoto-shrink_100_100/0/1688519205672?e=1710374400&v=beta&t=ou0rm5l4LJ4Vg6X9meYxVLzg5pEwb7V-uxGRxM9wt1c',
      description: 'Posted a new update',
    },
    {
      id: '2',
      userName: 'Aditya Shah',
      userImage: 'https://media.licdn.com/dms/image/D4D35AQHgItE4pdilzQ/profile-framedphoto-shrink_100_100/0/1687620419026?e=1705338000&v=beta&t=_T9VmNJ1Cv2ndkVdfw-eAV_--E6OKWSjYyhtcatWybA',
      description: 'Liked your post',
    },
    // Add more notifications as needed
  ];

  const renderNotification = ({ item }) => (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationLeft}>
        <Image source={{ uri: item.userImage }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreOptions}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    minHeight: '100%'
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    // marginBottom: 10,
    marginTop: 10,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    maxWidth: '70%',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#666',
  },
  moreOptions: {
    marginLeft: 10,
  },
});

export default Updates;
