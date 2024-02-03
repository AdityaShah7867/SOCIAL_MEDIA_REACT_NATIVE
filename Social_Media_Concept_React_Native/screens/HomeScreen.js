import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Post from '../Components/Post';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1MTI1MDMwN2VhMWUxOGQ3ZjhkNjlhZSIsImF2YXRhciI6eyJ1cmwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTIxNzMxMzk5P3Y9NCIsIl9pZCI6IjY1MTI1MDMwN2VhMWUxOGQ3ZjhkNjlhZCJ9LCJlbWFpbCI6ImFkaXR5YXNoYWg5ODY2QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYWRpdHlhIHNoYWgiLCJiaW8iOiJCdWlsZGluZyBOT1RFUyBCRVRBIiwicG9pbnRzIjoxMDMwLCJsZXZlbCI6Ik5ldyBVc2VyIiwiYmFkZ2VzIjpbIkV4cGVydCJdLCJmb2xsb3dlcnMiOltdLCJmb2xsb3dpbmciOlsiNjUxMjdlNjlmYTgzMmYwZDA5OTZkMTVlIiwiNjUxMjQ5YjNlMTZjOWM3MjRhOGJjMTNhIl0sImRpc2N1c3Npb25zUGFydGljaXBhdGVkIjpbXSwicmVmZXJyZWRCeSI6W10sInJlZmVycmVkVXNlcnMiOltdLCJDb21wYW55TmFtZSI6Ik5PVEVTIEJFVEEiLCJyZWZlcnJhbCI6Ii1yZWYtMDMyYTg4NDhlYiIsIlRvdGFsUmVmZXJyYWwiOjAsIlBsYWNlIjoiTVVNQkFJIiwiSW5zdGFncmFtTGluayI6Imh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vYWRpdHlhc2hhaDc4NjcvIiwiTGlua2VkSW5MaW5rIjoiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2FkaXR5YS1zaGFoLWExMDQ5NDI2My8iLCJpc0FkbWluIjpmYWxzZSwiaXNWZXJpZmllZCI6dHJ1ZSwidmVyaWZpY2F0aW9uVG9rZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMjMtMDktMjZUMDM6Mjk6NTIuMjQ0WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDItMDNUMTY6MDc6MzYuODMwWiIsIl9fdiI6MjksInN1YnNjcmlwdGlvbiI6InByZW1pdW0iLCJ0cm9waGllcyI6W119LCJpYXQiOjE3MDY5NzY2ODksImV4cCI6MTcwNzA2MzA4OX0.f6VXZ12GXVOoWgKdiz_aj7iFrh_2Qu1SniqyjSFtnlo'; // Replace with your actual static token
        console.log('Fetching data...');
        const response = await fetch('http://192.168.0.186:4000/api/v1/products/getproducts/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPostData(data.products);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        console.log('Finally');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        postData.map(post => (
          <Post key={post._id} data={post} />
        ))
      )}
    </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 50,
  },
});
