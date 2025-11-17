import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Alert, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useCompany } from './CompanyContext';

const Productledger = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeptNo, setSelectedDeptNo] = useState(null);
  const [selectedDeptName, setSelectedDeptName] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);

  const { companyCode } = useCompany();

  const formatDate = (date) => format(date, 'dd/MM/yyyy');

  const onFromDateChange = (event, selected) => {
    setShowFromDatePicker(false);
    if (selected) setFromDate(selected);
  };

  const onToDateChange = (event, selected) => {
    setShowToDatePicker(false);
    if (selected) setToDate(selected);
  };

  const openReport = () => {
    if (!companyCode || !fromDate || !toDate || !selectedDeptNo || !selectedDeptName) {
      Alert.alert('Missing Data', 'Please select all required fields.');
      return;
    }

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    const encodedPname = encodeURIComponent(selectedDeptName);

    const pdfUrl = `https://5461283ce09c.ngrok-free.app/myapp/rptproductledger.php?com_code=${companyCode}&fromDate=${formattedFromDate}&toDate=${formattedToDate}&pcode=${selectedDeptNo}&pname=${encodedPname}`;
    
    console.log('Opening URL:', pdfUrl);
    Linking.openURL(pdfUrl).catch(err => console.error('Error opening PDF:', err));
  };

  const fetchDepartmentData = () => {
    fetch("https://5461283ce09c.ngrok-free.app/myapp/getproducts12.php")
      .then(response => response.json())
      .then(data => {
        if (data && data.groups) {
          setDepartmentData(data.groups);
        }
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        Alert.alert("Error", "Could not fetch product list.");
      });
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const renderDeptItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedDeptNo(item.pcode);
        setSelectedDeptName(item.pname);
        setModalVisible(false);
      }}
    >
      <Text style={styles.dropdownText}>{item.pcode} - {item.pname}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#6200ee', '#3700b3']} style={styles.gradient}>
        <Text style={styles.heading}>Product Ledger</Text>
      </LinearGradient>

      <View style={styles.inputRow}>
        <View style={styles.deptInputContainer}>
          <Text style={styles.label}>Product No:</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputBox}>
            <Text style={styles.inputText}>{selectedDeptNo || "Select Product No"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deptInputContainer}>
          <Text style={styles.label}>Product Name:</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputBox}>
            <Text style={styles.inputText}>{selectedDeptName || "Select Product Name"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dateSelectionContainer}>
        <Text style={styles.label}>From Date</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromDatePicker(true)}>
          <Text style={styles.dateText}>{fromDate ? formatDate(fromDate) : 'Select From Date'}</Text>
        </TouchableOpacity>
        {showFromDatePicker && (
          <DateTimePicker
            value={fromDate || new Date()}
            mode="date"
            display="default"
            onChange={onFromDateChange}
          />
        )}

        <Text style={[styles.label, { marginTop: 15 }]}>To Date</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowToDatePicker(true)}>
          <Text style={styles.dateText}>{toDate ? formatDate(toDate) : 'Select To Date'}</Text>
        </TouchableOpacity>
        {showToDatePicker && (
          <DateTimePicker
            value={toDate || new Date()}
            mode="date"
            display="default"
            onChange={onToDateChange}
          />
        )}

        <TouchableOpacity style={styles.showButton} onPress={openReport}>
          <Text style={styles.showButtonText}>Show Report</Text>
        </TouchableOpacity>
      </View>

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
              keyExtractor={(item, index) => index.toString()}
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
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  gradient: { paddingVertical: 20, paddingHorizontal: 20 },
  heading: { fontSize: 26, color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 20 },
  deptInputContainer: { flex: 1, marginHorizontal: 5 },
  inputBox: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#f1f1f1' },
  inputText: { fontSize: 16 },
  label: { fontSize: 14, marginBottom: 5 },
  dateSelectionContainer: { marginHorizontal: 20 },
  dateInput: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#f1f1f1' },
  dateText: { fontSize: 16 },
  showButton: { backgroundColor: '#34495E', padding: 12, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  showButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', maxHeight: '70%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  dropdownItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 16 },
  closeButton: { marginTop: 10, backgroundColor: '#6200ee', padding: 10, borderRadius: 5, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default Productledger;
