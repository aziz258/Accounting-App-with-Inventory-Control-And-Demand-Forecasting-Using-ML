import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Linking, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompany } from './CompanyContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const Deptstockposition = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { companyCode } = useCompany();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeptNo, setSelectedDeptNo] = useState(null);
  const [selectedDeptName, setSelectedDeptName] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);

  // Format date as DD/MM/YYYY
  const formatDate = (date) => format(date, 'dd/MM/yyyy');

  // Handle date selection
  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) setSelectedDate(selected);
  };

  // Handle department selection
  const renderDeptItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedDeptNo(item.dcode);
        setSelectedDeptName(item.dname);
        setModalVisible(false);
      }}
    >
      <Text style={styles.dropdownText}>{item.dcode} - {item.dname}</Text>
    </TouchableOpacity>
  );

  // Open report URL
 const openReport = () => {
  if (!companyCode || !selectedDate || !selectedDeptNo) {
    console.error('Company code, department number, or date is missing!');
    return;
  }

  const pdfUrl = `https://5461283ce09c.ngrok-free.app/myapp/rptdeptstock.php?com_code=${companyCode}&date=${formatDate(selectedDate)}&deptno=${selectedDeptNo}`;
  Linking.openURL(pdfUrl).catch((err) => console.error('Error opening PDF:', err));
};


  const fetchDepartmentData = () => {
    fetch("https://5461283ce09c.ngrok-free.app/myapp/getdepts.php")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.groups) {
          setDepartmentData(data.groups);
        }
      })
      .catch((error) => {
        console.error("Error fetching department data:", error);
        Alert.alert("Error", "Unable to fetch department data.");
      });
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);
  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={['#6200ee', '#3700b3']} style={styles.gradient}>
        <Text style={styles.heading}>Dept Wise Stock Position</Text>
      </LinearGradient>

      {/* Department Selection Row */}
      <View style={styles.inputRow}>
        <View style={styles.deptInputContainer}>
          <Text style={styles.label}>Department No:</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputBox}>
            <Text style={styles.inputText}>{selectedDeptNo || "Select Dept No"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deptInputContainer}>
          <Text style={styles.label}>Department Name:</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputBox}>
            <Text style={styles.inputText}>{selectedDeptName || "Select Dept Name"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Selection */}
      <View style={styles.dateSelectionContainer}>
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{selectedDate ? formatDate(selectedDate) : 'Select Date'}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Show Button */}
        <TouchableOpacity style={styles.showButton} onPress={openReport}>
          <Text style={styles.showButtonText}>Show</Text>
        </TouchableOpacity>
      </View>

      {/* Department Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={departmentData}
              renderItem={renderDeptItem}
              keyExtractor={(item) => item.dcode}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 20,
     backgroundColor: '#34495E',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  deptInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dateSelectionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  showButton: {
    backgroundColor: '#34495E',
    padding: 12,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  showButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#34495E',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Deptstockposition;
