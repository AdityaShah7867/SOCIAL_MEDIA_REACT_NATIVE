import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,SafeAreaView, View, Text, TextInput, Button, FlatList } from 'react-native';

const Chat = ({ senderName, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Simulated messaging data fetching, replace with your actual logic
    const fetchMessages = async () => {
      const initialMessages = [
        // Example messages with relevant properties
        { id: 1, sender: 'User1', message: 'Hello!', timestamp: new Date().toISOString() },
        { id: 2, sender: recipientName, message: 'Hi there!', timestamp: new Date().toISOString() },
      ];
      setMessages(initialMessages);
    };
    fetchMessages();
  }, []); // Run only once on initial render

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return; // Prevent sending empty messages
    }

    const newMessageData = {
      id: Math.random().toString().substring(2, 7), // Generate unique ID
      sender: senderName,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessageData]);
    setNewMessage(''); // Clear input field after sending
    inputRef.current.focus(); // Refocus input field for easy continuity
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === senderName ? styles.myMessage : styles.recipientMessage}>
      <Text style={styles.senderName}>{item.sender}</Text>
      <Text>{item.message}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.recipientName}>{recipientName}</Text>
      </View>
      <FlatList
        inverted // Display newest messages at the top
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          multiline
        />
        <Button title="Send" onPress={sendMessage} disabled={!newMessage.trim()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 10,
    backgroundColor: '#eee',
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  recipientMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 10,
    color: '#ccc',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});

export default Chat;
