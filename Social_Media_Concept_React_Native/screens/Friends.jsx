import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import API_CONFIG from "../constants/API_CONFIG";

const Friends = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const response = await fetch(`${API_CONFIG.baseUrl}/auth/getAllUsers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_CONFIG.authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        console.log('Finally fetched user data!');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ScrollView style={styles.bgc}>
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          users.map((user) => (
            <View key={user._id} style={styles.userContainer}>
              <Image source={{ uri: user.avatar.url }} style={styles.userImage} />
              <Text style={styles.userName}>{user.username}</Text>
              <Text style={styles.bio}>{user.bio}</Text>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bgc: {
    backgroundColor: "#fff",
  },
  userContainer: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bio:{
    fontSize: 14,
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 5,
  },
  connectButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Friends;
