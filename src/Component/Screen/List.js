import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const List = ({ navigation }) => {
    const [userData, setUserData] = useState([]);
    const img = require("../../assets/Image/Profile.png")
    useEffect(() => {
        const displayAllUserData = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const userEntries = await AsyncStorage.multiGet(keys);
                const users = userEntries.map(([key, value]) => ({ id: key, data: JSON.parse(value) }));
                setUserData(users);
                console.log('All users:', users);
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };
        displayAllUserData();
    }, []);


    const handleDelete = async (id) => {
        try {
            await AsyncStorage.removeItem(id);
            setUserData(prevData => prevData.filter(item => item.id !== id));
            Alert.alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (userId, userData) => {
        navigation.navigate('Profile', { userId, userData });
    };
    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Image source={{ uri: item.data.profileImage }} style={{ height: 70, width: 70 }} />
                <View>
                    <Text>Name: {item?.data.name}</Text>
                    <Text>Email: {item?.data.email}</Text>
                </View>
            </View>
            <Text>Mobile: {item?.data.mobile}</Text>
            <Text>PAN: {item?.data.pan}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => handleEdit(item.id, item.data)}>
                    <Text style={styles.btn}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={[styles.btn, { backgroundColor: "red" }]}>Delet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {userData.length === 0 ? (
                <Text style={styles.noDataText}>No user data available. Please add user data.</Text>
            ) : (
                <FlatList
                    data={userData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
};

export default List;
const styles = StyleSheet.create({
    container: { borderWidth: 1, margin: 15, padding: 10, gap: 10, width: Dimensions.get("screen").width - 50, borderRadius: 7 },
    btn: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        paddingHorizontal: 20,
        color: "white"
    },
    noDataText: { fontSize: 16, fontWeight: 'bold', color: 'gray' }
})