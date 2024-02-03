import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

const Friends = () => {
  const users = [
    {
      id: 1,
      name: "Sahil Chalke",
      image: "https://media.licdn.com/dms/image/D4D03AQEFces88mnw5A/profile-displayphoto-shrink_100_100/0/1703794785287?e=1710374400&v=beta&t=ExzF-vEP-5Okc2OxEMxLBHDpUkPgOFJWdGDf9bZjhk4",
    },
    {
      id: 2,
      name: "Karan Gandhi",
      image: "https://media.licdn.com/dms/image/D4D03AQE4p-SppOJM7A/profile-displayphoto-shrink_200_200/0/1663963216759?e=1710374400&v=beta&t=h6P1BKhp-a24qs27S5EhqFer7PRjrg9pUFp-T7m_19s",
    },
    {
      id: 3,
      name: "Rehman Khan",
      image: "https://avatars.githubusercontent.com/u/98531038?s=48&v=4",
    },
    {
      id: 4,
      name: "Abhay Upadhyaya",
      image: "https://media.licdn.com/dms/image/D4D03AQGwJj8FEdNtEw/profile-displayphoto-shrink_100_100/0/1688519205672?e=1710374400&v=beta&t=ou0rm5l4LJ4Vg6X9meYxVLzg5pEwb7V-uxGRxM9wt1c",
    },
    {
      id: 5,
      name: "Parth Patil",
      image: "https://i.stack.imgur.com/l60Hf.png",
    },
    // Add more users as needed
  ];

  return (
    <ScrollView style={styles.bgc}>
    <View style={styles.container}>
      {users.map((user) => (
        <View key={user.id} style={styles.userContainer}>
          <Image source={{ uri: user.image }} style={styles.userImage} />
          <Text style={styles.userName}>{user.name}</Text>
          <TouchableOpacity style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      ))}
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
  bgc:{
    backgroundColor: "#fff",
  },
  userContainer: {
    width: "48%", // Adjust as needed based on your layout
    // backgroundColor: "#f0f0f0",
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
