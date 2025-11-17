import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Platform, Linking,  Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompany } from "./CompanyContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import axios from "axios";

const HeadWise = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const { companyCode } = useCompany(); 
    const [accountNo, setAccountNo] = useState("");
      const [accountName, setAccountName] = useState("");
      
      const [accountNos, setAccountNos] = useState([]);
      const [accountNames, setAccountNames] = useState([]);
      const [accountNoModalVisible, setAccountNoModalVisible] = useState(false);
      const [accountNameModalVisible, setAccountNameModalVisible] = useState(false);

    // Function to format date as DD/MM/YYYY
    const formatDate = (date) => format(date, 'dd/MM/yyyy');

    // Handle From Date Selection
    const onFromDateChange = (event, selectedDate) => {
        setShowFromPicker(false);
        if (selectedDate) setFromDate(selectedDate);
    };

    // Handle To Date Selection
    const onToDateChange = (event, selectedDate) => {
        setShowToPicker(false);
        if (selectedDate) setToDate(selectedDate);
    };

    const openReport = () => {
        if (!companyCode || !fromDate || !toDate || !accountNo || !accountName) {
            console.error('Company code, date range, account number, or account name is missing!');
            return;
        }
    
        const pdfUrl = `https://5461283ce09c.ngrok-free.app/myapp/rptheadwise.php?com_code=${companyCode}&account_name=${encodeURIComponent(accountName)}&from_date=${formatDate(fromDate)}&to_date=${formatDate(toDate)}`;
    
        Linking.openURL(pdfUrl).catch((err) => console.error('Error opening PDF:', err));
    };
    
    useEffect(() => {
     
          
        axios
          .get("https://5461283ce09c.ngrok-free.app/myapp/getlayout1.php")
          .then((response) => {
            if (response.data.success) {
              setAccountNos(response.data.accountNos);
              setAccountNames(response.data.accountNames);
            } else {
              console.error("Failed to fetch account details:", response.data.message);
            }
          })
          .catch((error) => {
            console.error("Error fetching account details:", error);
          });
      }, []);

        const renderAccountNoItem = ({ item }) => (
          <TouchableOpacity
            onPress={() => handleAccountNoSelect(item)}
            style={styles.companyItem}
          >
            <Text style={styles.companyItemText}>{item}</Text>
          </TouchableOpacity>
        );
      
        const renderAccountNameItem = ({ item }) => (
          <TouchableOpacity
            onPress={() => handleAccountNameSelect(item)}
            style={styles.companyItem}
          >
            <Text style={styles.companyItemText}>{item}</Text>
          </TouchableOpacity>
        );

        const handleAccountNoSelect = (selectedAccountNo) => {
            setAccountNo(selectedAccountNo);
            const correspondingAccountName = accountNames[accountNos.indexOf(selectedAccountNo)];
            setAccountName(correspondingAccountName);
            setAccountNoModalVisible(false);
          };
        
          const handleAccountNameSelect = (selectedAccountName) => {
            setAccountName(selectedAccountName);
            const correspondingAccountNo = accountNos[accountNames.indexOf(selectedAccountName)];
            setAccountNo(correspondingAccountNo);
            setAccountNameModalVisible(false);
          };
    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient colors={['#6200ee', '#3700b3']} style={styles.gradient}>
                <Text style={styles.heading}>Head Wise Details</Text>
            </LinearGradient>
 <View style={styles.row}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Head No:</Text>
        <TouchableOpacity
          onPress={() => setAccountNoModalVisible(true)}
          style={styles.input}
        >
          <Text>{accountNo || "Select Account No"}</Text>
        </TouchableOpacity>
        <Modal
          visible={accountNoModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAccountNoModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={accountNos}
                renderItem={renderAccountNoItem}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setAccountNoModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Head Name:</Text>
        <TouchableOpacity
          onPress={() => setAccountNameModalVisible(true)}
          style={styles.input}
        >
          <Text>{accountName || "Select Account Name"}</Text>
        </TouchableOpacity>
        <Modal
          visible={accountNameModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAccountNameModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={accountNames}
                renderItem={renderAccountNameItem}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setAccountNameModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
            {/* Date Selection Form */}
            <View style={styles.dateSelectionContainer}>
                <Text style={styles.label}>From Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromPicker(true)}>
                    <Text style={styles.dateText}>{fromDate ? formatDate(fromDate) : 'Select Date'}</Text>
                </TouchableOpacity>
                {showFromPicker && (
                    <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onFromDateChange}
                    />
                )}

                <Text style={styles.label}>To Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowToPicker(true)}>
                    <Text style={styles.dateText}>{toDate ? formatDate(toDate) : 'Select Date'}</Text>
                </TouchableOpacity>
                {showToPicker && (
                    <DateTimePicker
                        value={toDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onToDateChange}
                    />
                )}

                {/* Show Button */}
                <TouchableOpacity style={styles.showButton} onPress={openReport}>
                    <Text style={styles.showButtonText}>Show</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', paddingTop: 20 },
    gradient: { paddingVertical: 20, paddingHorizontal: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15, marginBottom: 20, backgroundColor: '#34495E' },
    heading: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    dateSelectionContainer: { marginHorizontal: 20, marginBottom: 20 },
    dateInput: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10, fontSize: 16 },
    dateText: { fontSize: 16, color: '#333' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    showButton: { backgroundColor: '#34495E', padding: 10, marginTop: 15, borderRadius: 5, alignItems: 'center' },
    showButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
   
      scrollView: {
        flexGrow: 1,
      },
   
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
      },
      inputContainer: {
        flex: 1,
        marginHorizontal: 5,
        marginBottom: 10,
      },
      label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 0,
      },
      amountLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 0,
      },
      input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        width: "80%",
        maxWidth: 350,
        height: 400,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
      },
      modalCloseButton: {
        padding: 10,
        backgroundColor: "#6200ee",
        marginTop: 10,
        borderRadius: 5,
        alignItems: "center",
      },
      modalCloseText: {
        color: "white",
        fontSize: 16,
      },
      companyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      },
      companyItemText: {
        fontSize: 16,
        color: "#333",
      },
      transactionTypeContainer: {
        marginTop: 0,
      },
      transactionTypeToggle: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        marginTop: 10,
      },
      transactionTypeButton: {
        flex:1,
        paddingVertical: 9,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      },
      selectedTransactionButton: {
        backgroundColor: "green", // Accent color for the selected button
      },
      transactionTypeButtonText: {
        color: "#333",
        fontSize: 14,
        fontWeight: "bold",
      },
      selectedTransactionButtonText: {
        color: "#fff", // White text for selected option
      },
      row: {
        flexDirection: "row",
        justifyContent: "center", // Center horizontally
        alignItems: "center",     // Center vertically
        marginVertical: 10,       // Space around the row
      },
      
      addRowButton: {
        paddingVertical: 12,        // Reduced vertical padding
        paddingHorizontal: 20,     // Add horizontal padding if needed
        backgroundColor: "#007BFF",
        borderRadius: 8,           // Reduced corner radius
        justifyContent: "center",
        alignItems: "center",
      },
      
      addRowButtonText: {
        color: "#fff",
        fontSize: 14,             // Reduced font size
        fontWeight: "bold",
      },
      
      tableContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingVertical: 10,
      },
      tableHeading: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
      },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: "grey",
        borderRadius: 8,
        padding: 10,
      },
      tableHeaderText: {
        flex: 1,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
      },
      tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingVertical: 10,
      },
      tableRowText: {
        flex: 1,
        textAlign: "center",
        color: "#333",
      },
      modalHeading: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
      modalButton: {
        padding: 10,
        backgroundColor: "#6200ee",
        marginVertical: 5,
        borderRadius: 5,
        alignItems: "center",
      },
      modalButtonText: {
        color: "#fff",
        fontSize: 16,
      },
      modalCloseButton: {
        padding: 10,
        backgroundColor: "#ccc",
        marginTop: 10,
        borderRadius: 5,
        alignItems: "center",
      },
      modalCloseText: {
        color: "#333",
        fontSize: 16,
      },
      submitButton: {
        backgroundColor: '#007BFF', // Professional blue shade
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8, // Rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -18,
        shadowColor: '#000', // Optional shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
      },
      submitButtonText: {
        color: '#FFFFFF', // White text for contrast
        fontSize: 16,
        fontWeight: 'bold',
      },
      submitButtonContainer: {
        alignItems: 'center', // Center horizontally
        marginTop: 20,
        marginBottom: 40, // Add spacing at the bottom
      },
      headingContainer: {
        backgroundColor: '#34495E', // Professional blue shade
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10, // Rounded corners
        marginVertical: 10, // Spacing around the heading
        alignItems: 'center', // Center the text horizontally
      },
      heading: {
        color: '#FFFFFF', // White text for contrast
        fontSize: 20, // Larger font size for emphasis
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });

export default HeadWise;
