import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { removeItem } from "../utils/asyncStorage";
import API_CONFIG from "../constants/API_CONFIG"; // Adjust the path accordingly
import Post from "../Components/Post";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          `${API_CONFIG.baseUrl}/auth/loggedinuser`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_CONFIG.authToken}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error(`HTTP error! Status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        if (userData.user) {
          setUserData(userData.user);
        }

        // Fetch posts data
        const postsResponse = await fetch(
          `${API_CONFIG.baseUrl}/products/getproductsById/651250307ea1e18d7f8d69ae`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_CONFIG.authToken}`,
            },
          }
        );
  
        if (!postsResponse.ok) {
          throw new Error(`HTTP error! Status: ${postsResponse.status}`);
        }
  
        const data = await postsResponse.json();
        setPostData(data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        console.log("User Profile fetched successfully");
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData && (
        <>
          <Image
            source={{ uri: userData.avatar.url }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{userData.username}</Text>
         
            <Text style={styles.userDescription}>{userData.bio}</Text>
          
        </>
      )}
    
      <ScrollView>
      <View style={styles.centeredTextContainer}>
  <Text style={styles.centeredText}>YOUR POSTS</Text>
</View>
        <View style={styles.post}>
          {postData.map((post) => (
            <Post key={post._id} data={post} />
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    marginTop: 20,
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
 
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bioScrollView: {
    maxHeight: 200, // Adjust the maxHeight as needed
    marginBottom: 20,
  },
  userDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  editButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#a7f3d0",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default Profile;
