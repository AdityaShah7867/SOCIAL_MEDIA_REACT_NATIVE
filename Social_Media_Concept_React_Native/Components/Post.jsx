import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API_CONFIG from "../constants/API_CONFIG"; // Adjust the path accordingly

const Post = ({ data }) => {
  const { _id, author, content, likes, comments, createdAt, media } = data;
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/likes/likeDislikePost/${_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking/disliking post:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: author.avatar.url }} style={styles.postImage} />
          <Text style={styles.userName}>{author.username}</Text>
        </View>

        <Text style={styles.postDescription}>{content}</Text>

        {media && (
          <View style={styles.centeredImageContainer}>
            <Image
              source={{ uri: media }}
              style={styles.postContentImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Like, Comment, Share Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Ionicons name="heart-outline" size={24} color="black" />
            <Text style={styles.buttonText}>{likes.length} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.buttonText}>{comments.length} Comments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Ionicons name="arrow-redo-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3, // Add elevation for shadow (Android)
    shadowColor: "#000", // Add shadow (iOS)
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  postContentImage: {
    width: "80%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  centeredImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 5,
  },
});

export default Post;
