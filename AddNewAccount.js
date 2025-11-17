import React, { useState, useEffect } from 'react';
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

const AddNewAccount = () => {
  const [headCode, setHeadCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [headData, setHeadData] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalType, setModalType] = useState('headCode'); // To track which modal is open (Head Code or Head Name)

  useEffect(() => {
    // Fetch data for head codes and names
    fetch('https://5461283ce09c.ngrok-free.app/myapp/getlayout.php')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setHeadData(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching head data:', error);
        Alert.alert('Error', 'Unable to fetch head codes and names.');
      });

    // Fetch the latest account number
    fetch('https://5461283ce09c.ngrok-free.app/myapp/get_latest_account_number.php')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched account number:', data.latest_acct_no); // Debugging log
      if (data && data.latest_acct_no) {
        setAccountNumber(data.latest_acct_no.toString()); // No increment, just set the value
      }
    })
    .catch((error) => {
      console.error('Error fetching account number:', error);
      Alert.alert('Error', 'Unable to fetch the latest account number.');
    });
}, []);

const fetchLatestAccountNumber = () => {
  fetch('https://5461283ce09c.ngrok-free.app/myapp/get_latest_account_number.php')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched account number:', data.latest_acct_no);
      if (data && data.latest_acct_no) {
        setAccountNumber(data.latest_acct_no.toString());
      }
    })
    .catch((error) => {
      console.error('Error fetching account number:', error);
      Alert.alert('Error', 'Unable to fetch the latest account number.');
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

    fetch('https://5461283ce09c.ngrok-free.app/myapp/insert_acct.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Success', 'Account added successfully!');
          // Reset form fields
          setHeadCode('');
          setHeadName('');
          setAccountName('');
          setCategory('');
          setAccountNumber('');

          fetchLatestAccountNumber();
        } else {
          Alert.alert('Error', data.message || 'Failed to add the account.');
        }
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        Alert.alert('Error', 'An error occurred while adding the account.');
      });
  };

  const handleSelectItem = (item) => {
    if (modalType === 'headCode') {
      setHeadCode(item.no1);
      setHeadName(item.acct_type);
    } else {
      setHeadName(item.acct_type);
      setHeadCode(item.no1);
    }
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container}>
      

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Add New Account</Text>
        </View>

        {/* Head Code Modal */}
        <Modal
          visible={modalVisible && modalType === 'headCode'}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={headData}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectItem(item)}
                  >
                    <Text style={styles.modalItemText}>{item.no1}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.closeButton}>
                Close
              </Button>
            </View>
          </View>
        </Modal>

        {/* Head Name Modal */}
        <Modal
          visible={modalVisible && modalType === 'headName'}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={headData}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectItem(item)}
                  >
                    <Text style={styles.modalItemText}>{item.acct_type}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.closeButton}>
                Close
              </Button>
            </View>
          </View>
        </Modal>

        <View style={styles.row}>
        <View style={styles.pickerContainer}>
  <Text style={styles.label}>Head Code:</Text>
  <Button
    mode="outlined"
    onPress={() => { setModalVisible(true); setModalType('headCode'); }}
    style={[styles.input, { flex: 1 }]} // Adjusted to match other input sizes
    labelStyle={{ color: headCode ? 'black' : 'gray' }} // Set text color for headCode
  >
    {headCode || 'Select Head Code'}
  </Button>
</View>

<View style={styles.pickerContainer}>
  <Text style={styles.label}>Head Name:</Text>
  <Button
    mode="outlined"
    onPress={() => { setModalVisible(true); setModalType('headName'); }}
    style={[styles.input, { flex: 1 }]} // Adjusted to match other input sizes
    labelStyle={{ color: headName ? 'black' : 'gray' }} // Set text color for headName
  >
    {headName || 'Select Head Name'}
  </Button>
</View>

</View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Account Number:</Text>
          <TextInput
            value={accountNumber}
            editable={false}
            style={styles.inputSmall}
          />
        </View>

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
          Add Account
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  headingContainer: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  appbar: {
    backgroundColor: '#3E2723',
  },
  appbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 20, // Add space below the Picker boxes
    justifyContent: 'flex-start', // Ensure the text is left-aligned
  },
  label: {
    fontSize: 16,
    
    fontWeight: "bold",
    color: '#555',
    marginBottom: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    width: '50%',
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Limit the width of the modal
    maxHeight: '70%', // Limit the height to avoid full screen
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20, // Increase space between inputs
  },
  accountNumberContainer: {
    marginTop: 20, // Add space specifically for the "Account Number" label
  },
});

export default AddNewAccount;




