import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import API_CONFIG from '../constants/API_CONFIG';

const Community = () => {
    const [groupData, setGroupData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data...');
                const response = await fetch(`${API_CONFIG.baseUrl}/groups/getgroups`, {
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
                setGroupData(data.groups);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                console.log('Finally fetched group data!');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.groupContainer}>
            <Image source={{ uri: item.avatar }} style={styles.groupAvatar} />
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={groupData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

export default Community;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupContainer: {
        marginVertical: 10,
        padding: '4%',
        backgroundColor: 'white',
        borderRadius: 8,
    },
    groupAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    groupDescription: {
        fontSize: 14,
        marginTop: 5,
    },
});
