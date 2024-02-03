import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Post = ({ data }) => {
  const { author, content, likes, comments, createdAt, media } = data;

  return (
    <FlatList
      style={styles.container}
      data={[data]}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.main}>
          <View style={styles.header}>
            <Image
              source={{
                uri: item.author.avatar.url,
              }}
              style={styles.postImage}
            />
            <Text style={styles.userName}>{item.author.username}</Text>
          </View>
          {/* Post Description */}
          <Text style={styles.postDescription}>{item.content}</Text>
          <Image
            source={{ uri: item.media }}
            style={styles.postContentImage}
            resizeMode="contain" // Added for image handling
          />
          {/* <View style={styles.buttons}>
            <Ionicons name="heart-outline" size={24} color="black" />
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Ionicons name="arrow-redo-outline" size={24} color="black" />
          </View> */}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  postImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  hashtag: {
    color: '#3b82f6',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    marginRight: 20,
    marginTop: 10,
  },
  main: {
    flexGrow: 1, // Allow post to expand height
    minHeight: 300, // Set a minimum height
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: 10,
    marginBottom: 30, // Increase spacing
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  postContentImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default Post;
