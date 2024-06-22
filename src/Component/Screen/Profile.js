import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';


const Profile = ({ navigation, route }) => {
    const userData = route.params?.userData;
    const userId = route.params?.userId;
    const [name, setName] = useState();
    const [profileImage, setProfileImage] = useState();
    const [email, setEmail] = useState();
    const [mobile, setMobile] = useState();
    const [pan, setPan] = useState();



    useEffect(() => {
        setEmail(userData?.email)
        setMobile(userData?.mobile)
        setName(userData?.name)
        setProfileImage(userData?.profileImage)
        setPan(userData?.pan)
    }, [route])


    const handleSubmission = async () => {
        // Validation for name
        if (!name || !/^[a-zA-Z]+$/.test(name.trim())) {
            showAlert('Name can only contain alphabets');
            return;
        }

        // Validation for email
        if (!email || !email.trim()) {
            showAlert('Email cannot be empty');
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            showAlert('Invalid email address');
            return;
        }


        // Validation for mobile number
        if (!mobile || !mobile.trim()) {
            showAlert('Mobile number cannot be empty');
            return;
        }
        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(mobile.trim())) {
            showAlert('Invalid mobile number');
            return;
        }
        // Validation for PAN number
        if (!pan || !pan.trim()) {
            showAlert('PAN number cannot be empty');
            return;
        }
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (!panPattern.test(pan.trim().toUpperCase())) {
            showAlert('Invalid PAN number');
            return;
        }

        // If all validations pass, proceed with submission
        try {
            const updatedUserData = {
                name,
                email,
                mobile,
                pan,
                profileImage,
            };

            if (userId) {
                // Editing existing user: update user data in AsyncStorage
                await AsyncStorage.setItem(userId, JSON.stringify(updatedUserData));
                setEmail("")
                setMobile("")
                setName("")
                setPan("")
                setProfileImage("")
            } else {
                // Adding new user: generate a unique ID and store user data in AsyncStorage
                const timestamp = Date.now();
                const key = `userData_${timestamp}`;
                await AsyncStorage.setItem(key, JSON.stringify(updatedUserData));
                Alert.alert('Profile Submitted successfully');
                setEmail("")
                setMobile("")
                setName("")
                setPan("")
                setProfileImage("")
            }

            Alert.alert('User data updated successfully');
            navigation.navigate('List');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const showAlert = (message) => {
        Alert.alert('Validation Error', message);
    };
    const uploadProfile = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image?.path);
            setProfileImage(image?.path);
        }).catch(error => {
            console.log('ImagePicker Error:', error);
        });
    };




    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.imageContainer}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('../../assets/Image/Profile.png')}
                        style={styles.image}
                    />
                    <TouchableOpacity onPress={uploadProfile}>
                        <Text style={styles.uploadText}>Upload Profile Picture</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View>
                    <Text style={styles.label}>Mobile No:</Text>
                    <TextInput
                        style={styles.input}
                        value={mobile}
                        onChangeText={setMobile}
                    />
                </View>
                <View>
                    <Text style={styles.label}>PAN No:</Text>
                    <TextInput
                        style={styles.input}
                        value={pan}
                        onChangeText={setPan}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmission}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("List", {})}>
                    <Text style={styles.buttonText}>Show All User Data</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    uploadText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: 'grey',
        alignItems: 'center',
        padding: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
});

export default Profile;
