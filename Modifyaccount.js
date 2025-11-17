import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Appbar, Button } from 'react-native-paper';

const Modifyaccount = () => {
  const [headCode, setHeadCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [headData, setHeadData] = useState([]); // Stores head codes and names together
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState('');

  useEffect(() => {
    // Fetch data for head codes and names
    fetch('https://5461283ce09c.ngrok-free.app/myapp/getlayout.php') // Replace with your actual URL
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setHeadData(data); // Store the entire response for mapping
        }
      })
      .catch((error) => {
        console.error('Error fetching head data:', error);
        Alert.alert('Error', 'Unable to fetch head codes and names.');
      });
  }, []);

  const handleFetchData = () => {
    if (!accountNumber) {
      Alert.alert('Validation Error', 'Please enter an account number.');
      return;
    }

    fetch('https://5461283ce09c.ngrok-free.app/myapp/fetchacctinfo.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ acctno: accountNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.acct_name) {
          // Populate fields with fetched data
          setAccountName(data.acct_name);
          setCategory(data.acct_cat);
          setHeadCode(data.no1); // Update head code
          setHeadName(data.acct_head); // Update head name
        } else if (data.error) {
          Alert.alert('Error', data.error);
        }
      })
      .catch((error) => {
        console.error('Error fetching account data:', error);
        Alert.alert('Error', 'An error occurred while fetching the account data.');
      });
  };

  const handleSubmit = () => {
    if (!headCode || !accountNumber || !accountName) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const payload = {
      headCode,
      headName,
      accountNumber,
      accountName,
      category,
    };

    fetch('https://5461283ce09c.ngrok-free.app/myapp/insertmodifyacct.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Success', 'Account modified successfully!');
          // Reset form fields
          setHeadCode('');
          setHeadName('');
          setAccountName('');
          setCategory('');
          setAccountNumber('');
        } else {
          Alert.alert('Error', data.message || 'Failed to modify the account.');
        }
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        Alert.alert('Error', 'An error occurred while modifying the account.');
      });
  };

  const handleSelectHeadCode = (item) => {
    setHeadCode(item.no1);
    setHeadName(item.acct_type);
    setModalVisible(false);
    setSelectedField('');
  };

  const handleSelectHeadName = (item) => {
    setHeadName(item.acct_type);
    setHeadCode(item.no1);
    setModalVisible(false);
    setSelectedField('');
  };

  const renderModalContent = () => {
    return (
      <FlatList
        data={headData}
        keyExtractor={(item) => item.no1}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.modalItem}
            onPress={
              selectedField === 'headCode'
                ? () => handleSelectHeadCode(item)
                : () => handleSelectHeadName(item)
            }
          >
            <Text style={styles.modalItemText}>{selectedField === 'headCode' ? item.no1 : item.acct_type}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Modify Account</Text>
        </View>

        {/* Head Code and Head Name */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Head Code:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setModalVisible(true);
                setSelectedField('headCode');
              }}
            >
              <Text style={styles.inputText}>{headCode || 'Select Head Code'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Head Name:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setModalVisible(true);
                setSelectedField('headName');
              }}
            >
              <Text style={styles.inputText}>{headName || 'Select Head Name'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Number and Fetch Button */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Number:</Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              style={styles.inputSmall}
              placeholder="Enter account number"
            />
          </View>
          <Button mode="contained" onPress={handleFetchData} style={styles.fetchButton}>
            Fetch
          </Button>
        </View>

        {/* Other Inputs */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Account Name:</Text>
          <TextInput
            value={accountName}
            onChangeText={setAccountName}
            style={styles.input}
            placeholder="Enter account name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category:</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            placeholder="Enter category"
          />
        </View>

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Modify Account
        </Button>
      </ScrollView>

      {/* Modal for selecting head code or head name */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderModalContent()}
            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.closeButton}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f4f4f4', // Lighter background color for better contrast
  },
  headingContainer: {
    backgroundColor: '#34495E', // Dark brown background for a more refined look
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000', // Subtle shadow for a modern look
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Add shadow effect for Android
  },
  heading: {
    color: '#fff', // White text for contrast
    fontSize: 24, // Slightly larger font size
    fontWeight: '600', // Slightly less bold for a modern feel
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#555', // Darker color for better readability
    marginBottom: 8, // Add more space between label and input
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc', // Light grey border color for subtle contrast
    borderRadius: 10, // Rounded corners for a soft look
    padding: 12, // More padding for a spacious feel
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333', // Slightly darker text for readability
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    width: '100%',
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
  },
  fetchButton: {
    marginTop: 30,
    height: 50,
    alignSelf: 'center',
    backgroundColor: 'green',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Limit the width of the modal
    maxHeight: '70%'
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Modifyaccount;
