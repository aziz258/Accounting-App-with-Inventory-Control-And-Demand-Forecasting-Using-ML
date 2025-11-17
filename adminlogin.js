import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Modal, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useCompany } from "./CompanyContext"; 

const AdminScreen = () => {
    const [companyCode, setCompanyCode] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [companies, setCompanies] = useState([]);
    const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
    const [selectedField, setSelectedField] = useState('code'); // 'code' or 'name'
    const navigation = useNavigation();
    const { setCompanyCode: setGlobalCompanyCode } = useCompany();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('https://5461283ce09c.ngrok-free.app/myapp/fetchcompanydata.php');
                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                } else {
                    setCompanies(data);

                    if (data.length > 0) {
                        setCompanyCode(data[0].com_code);
                        setCompanyName(data[0].cname);
                    }
                }
            } catch (error) {
                setError('An error occurred while fetching company data');
                console.error(error);
            }
        };

        fetchCompanies();
    }, []);

    const handleLogin = async () => {
        console.log("Selected Company Code:", companyCode);
        if (!companyCode || !companyName) {
            setError('Please select both company code and company name');
            return;
        }

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        try {
            const response = await fetch('https://5461283ce09c.ngrok-free.app/myapp/adminlogin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    company_code: companyCode,
                    company_name: companyName,
                    name: username.trim(),
                    password: password.trim(),
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccessMessage('Login successful!');
                setError('');
                setGlobalCompanyCode(companyCode); // Store companyCode globally
                navigation.replace('AdminDrawerNavigator', { isAdmin: true });


            } else {
                setError(result.message || 'Login failed');
                setSuccessMessage('');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
            setSuccessMessage('');
        }
    };

    const renderCompanyItem = ({ item }) => {
        const handleSelect = () => {
            if (selectedField === 'code') {
                setCompanyCode(item.com_code);
                setCompanyName(item.cname);
            } else {
                setCompanyName(item.cname);
                setCompanyCode(item.com_code);
            }
            setIsCompanyModalVisible(false);
        };

        return (
            <TouchableOpacity onPress={handleSelect} style={styles.companyItem}>
                <Text style={styles.companyItemText}>
                    {selectedField === 'code' ? item.com_code : item.cname}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
       
      
      
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <LinearGradient colors={['#6200ee', '#3700b3']} style={styles.gradient}>
                            <Text style={styles.heading}>Admin's Login</Text>
                        </LinearGradient>

                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

                        {/* Company Code and Name Select in One Row */}
                        <View style={styles.companySelectionContainer}>
                            <View style={styles.companyInputWrapper}>
                                <Text style={styles.label}>Company Code</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedField('code');
                                        setIsCompanyModalVisible(true);
                                    }}
                                    style={styles.companyInput}
                                >
                                    <Text style={styles.companyInputText}>{companyCode || 'Select Company Code'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.companyInputWrapper}>
                                <Text style={styles.label}>Company Name</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedField('name');
                                        setIsCompanyModalVisible(true);
                                    }}
                                    style={styles.companyInput}
                                >
                                    <Text style={styles.companyInputText}>{companyName || 'Select Company Name'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* User Name Input */}
                        <View style={styles.inputContainer}>
                            <FontAwesome name="user" size={24} color="#6200ee" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                placeholderTextColor="#999"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <FontAwesome name="lock" size={24} color="#6200ee" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>

                {/* Modal for Company Selection */}
                <Modal
                    visible={isCompanyModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsCompanyModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={companies}
                                renderItem={renderCompanyItem}
                                keyExtractor={(item) => item.com_code.toString()}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setIsCompanyModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    inner: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#34495E',
        marginBottom: 50,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingLeft: 10,
    },
    icon: {
        marginRight: 10,
        color: '#34495E',
    },
    input: {
        height: 40,
        fontSize: 16,
        flex: 1,
        color: '#333',
    },
    companySelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    companyInputWrapper: {
        flex: 0.48,
    },
    companyInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        justifyContent: 'center',
    },
    companyInputText: {
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    success: {
        color: 'green',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalCloseButton: {
        padding: 10,
        backgroundColor: '#34495E',
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalCloseText: {
        color: 'white',
        fontSize: 16,
    },
    companyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    companyItemText: {
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#34495E',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdminScreen;