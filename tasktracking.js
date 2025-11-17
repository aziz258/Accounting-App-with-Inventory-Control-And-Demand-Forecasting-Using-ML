import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserActivityForm = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    fetch('https://5461283ce09c.ngrok-free.app/myapp/getusers.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          setSelectedUser(data[0]);
        } else {
          setUsers([]);
          setSelectedUser('');
        }
      })
      .catch(error => {
        console.error("Failed to load users:", error);
        const dummyUsers = ['admin', 'testuser'];
        setUsers(dummyUsers);
        setSelectedUser(dummyUsers[0]);
      });
  }, []);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleSubmit = () => {
    navigation.navigate('activity', {
      uname: selectedUser,
      from: formatDate(fromDate),
      to: formatDate(toDate)
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Task Tracking</Text>
      <View style={styles.card}>

        <Text style={styles.label}>👤 Select User:</Text>
        {users.length > 0 ? (
          <Picker
            selectedValue={selectedUser}
            onValueChange={setSelectedUser}
            style={styles.picker}
          >
            {users.map((user, idx) => (
              <Picker.Item label={user} value={user} key={idx} />
            ))}
          </Picker>
        ) : (
          <Text style={styles.warning}>No users found.</Text>
        )}

        <Text style={styles.label}>📅 From Date:</Text>
        <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateBox}>
          <Text>{formatDate(fromDate)}</Text>
        </TouchableOpacity>
        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowFromPicker(false);
              if (date) setFromDate(date);
            }}
          />
        )}

        <Text style={styles.label}>📅 To Date:</Text>
        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateBox}>
          <Text>{formatDate(toDate)}</Text>
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowToPicker(false);
              if (date) setToDate(date);
            }}
          />
        )}

        <View style={{ marginTop: 20 }}>
          <Button title="🔍 Generate Report" onPress={handleSubmit} color="#007bff" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#f2f4f7',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#444',
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingVertical: 6,
    marginBottom: 10,
  },
  dateBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  warning: {
    color: 'red',
    marginBottom: 10,
  },
});

export default UserActivityForm;
