import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import API_CONFIG from "../constants/API_CONFIG";
import * as DocumentPicker from "expo-document-picker";

const Post = () => {
  const [postText, setPostText] = useState("");
  const [attachedImages, setAttachedImages] = useState([]);
  const [attachedDocuments, setAttachedDocuments] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work."
        );
      }
    })();
  }, []);

  const handleAttachDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

      if (result.type === "success") {
        console.log("Selected Document URI:", result.uri);
        setAttachedDocuments([...attachedDocuments, result.uri]);
      }
    } catch (error) {
      console.error("DocumentPicker Error:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while picking a document. Please try again later."
      );
    }
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("content", postText);
  
      for (let i = 0; i < attachedImages.length; i++) {
        const uri = attachedImages[i];
        const fileType = uri.substring(uri.lastIndexOf(".") + 1);
        const fileName = `image_${i}.${fileType}`;
  
        formData.append("media", {
          name: fileName,
          type: `image/${fileType}`,
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        });
      }
  
      for (let i = 0; i < attachedDocuments.length; i++) {
        const uri = attachedDocuments[i];
        const fileType = uri.substring(uri.lastIndexOf(".") + 1);
        const fileName = `document_${i}.${fileType}`;
  
        formData.append("media", {
          name: fileName,
          type: `document/${fileType}`,
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        });
      }
  
      const response = await fetch(
        `${API_CONFIG.baseUrl}/products/createproduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${API_CONFIG.authToken}`,
          },
          body: formData,
        }
      );
  
      if (response.ok) {
        console.log("Post successfully submitted!");
        setPostText("");
        setAttachedImages([]);
        setAttachedDocuments([]);
      } else {
        console.error("Failed to submit post:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Your text here..."
        value={postText}
        onChangeText={setPostText}
        multiline
      />

      {attachedDocuments.map((document, index) => (
        <Text key={index}>{document}</Text>
      ))}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleAttachDocument}
        >
          <Ionicons name="document-attach" size={24} color="#3b82f6" />
          <Text>Attach Documents</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    marginTop: 50,
  },
  attachedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  postButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Post;
