import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const Journalvoucher = () => {
  const [ojvno, setOjvno] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNos, setAccountNos] = useState([]);
  const [accountNames, setAccountNames] = useState([]);
  const [accountNoModalVisible, setAccountNoModalVisible] = useState(false);
  const [accountNameModalVisible, setAccountNameModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("debit");
  const [debitAmount, setDebitAmount] = useState("0");
  const [creditAmount, setCreditAmount] = useState("0");
  const [difference, setDifference] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rows, setRows] = useState([]); // State for the table rows
  const [selectedRow, setSelectedRow] = useState(null); // Track selected row for editing
const [showModifyDeleteModal, setShowModifyDeleteModal] = useState(false); // Modal for modify/delete option


  useEffect(() => {
    axios
      .get("https://5461283ce09c.ngrok-free.app/myapp/fetchjvno.php")
      .then((response) => {
        if (response.data.success) {
          setOjvno(response.data.ojvno);
          setSelectedDate(new Date());
        } else {
          console.error("Failed to fetch OJV No:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching OJV No:", error);
      });
      
    axios
      .get("https://5461283ce09c.ngrok-free.app/myapp/fetchaccounts.php")
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

  const insertData = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!ojvno || rows.length === 0) {
      Alert.alert("Validation Error", "Please provide OJV No and rows.");
      return;
    }
  
    if (parseFloat(difference) !== 0) {
      Alert.alert("Validation Error", "The difference must be 0 to proceed.");
      return;
    }
  
    setIsSubmitting(true); // Set submitting state to true
  
    const payload = {
      ojvno: ojvno, // Include OJV No
      date: selectedDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      rows: rows.map((row) => ({
        accountNo: row.accountNo,
        description: row.description,
        debit: parseFloat(row.debit) || 0,
        credit: parseFloat(row.credit) || 0,
      })),
    };
  
    fetch("https://5461283ce09c.ngrok-free.app/myapp/insertjvno.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Rows inserted successfully!");
  
          // Recall fetchOJVNo to update ojvno
          axios
            .get("https://5461283ce09c.ngrok-free.app/myapp/fetchjvno.php")
            .then((response) => {
              if (response.data.success) {
                setOjvno(response.data.ojvno); // Update OJV No
              } else {
                console.error("Failed to fetch OJV No:", response.data.message);
              }
            })
            .catch((error) => {
              console.error("Error fetching OJV No:", error);
            });
  
          // Reset form fields
          setRows([]);
          setDifference("0");
          setAmount("");
          setDebitAmount("");
          setCreditAmount("");
          setSelectedDate(new Date());
          setSelectedRow(null);
        } else {
          Alert.alert("Error", data.message || "Failed to insert rows");
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Error occurred while inserting rows");
      })
      .finally(() => {
        setIsSubmitting(false); // Reset submitting state
      });
  };
  
  
  

  const onChangeDate = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

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

  const calculateTotals = (updatedRows) => {
    let totalDebit = 0;
    let totalCredit = 0;
  
    // Iterate through all rows to calculate totals
    updatedRows.forEach((row) => {
      totalDebit += parseFloat(row.debit || 0); // Add debit amounts
      totalCredit += parseFloat(row.credit || 0); // Add credit amounts
    });
  
    setDebitAmount(totalDebit.toFixed(2)); // Update total debit amount
    setCreditAmount(totalCredit.toFixed(2)); // Update total credit amount
    setDifference((totalDebit - totalCredit).toFixed(2)); // Update the difference
  };
  
  const addRow = () => {
    if (!accountNo || !accountName || !description || !amount) {
      alert("Please fill all the fields before adding a row.");
      return;
    }
  
    const newRow = {
      id: Date.now(), // Generate a unique id for the new row
      accountNo,
      accountName,
      description,
      debit: transactionType === "debit" ? parseFloat(amount) : 0,
      credit: transactionType === "credit" ? parseFloat(amount) : 0,
    };
  
    const updatedRows = [...rows, newRow]; // Add the new row
    setRows(updatedRows); // Update rows state
    calculateTotals(updatedRows); // Recalculate totals with the updated rows
    setDescription("");
  };
  
  const handleRowClick = (row) => {
    setSelectedRow(row); // Set the selected row
    setAccountNo(row.accountNo);
    setAccountName(row.accountName);
    setDescription(row.description);
  
    // Set the amount based on the side (debit or credit)
    if (row.debit > 0) {
      setAmount(row.debit.toString()); // Set amount as debit (convert to string)
      setTransactionType("debit"); // Set transaction type as debit
    } else {
      setAmount(row.credit.toString()); // Set amount as credit (convert to string)
      setTransactionType("credit"); // Set transaction type as credit
    }
  
    console.log("Selected row in handleRowClick:", row); // Log selected row for debugging
    setShowModifyDeleteModal(true); // Show the modal
  };
  
  
  
  const handleModifyRow = () => {
    if (selectedRow) {
      const updatedRows = rows.map((row) =>
        row.id === selectedRow.id // Use `id` for comparison
          ? {
              ...row,
              accountNo,
              accountName,
              description,
              debit: transactionType === "debit" ? amount : 0,
              credit: transactionType === "credit" ? amount : 0,
            }
          : row
      );
      setRows(updatedRows); // Update the rows with the modified row
    }
    handleDeleteRow();
    setShowModifyDeleteModal(false); // Close the modal after modification
  };
  
  
  const handleDeleteRow = () => {
    console.log("Deleting row:", selectedRow); // Log selected row for debugging
  
    if (selectedRow && selectedRow.id) {
      const updatedRows = rows.filter((row) => row.id !== selectedRow.id); // Filter out the row based on `id`
      setRows(updatedRows); // Update rows state
      calculateTotals(updatedRows); // Recalculate totals after deletion
    } else {
      console.error("No row selected for deletion");
    }
  
    setShowModifyDeleteModal(false); // Close the modal after deletion
  };
  
  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  <ScrollView contentContainerStyle={styles.scrollView}>
  <View style={styles.headingContainer}>
  <Text style={styles.heading}>Add Journal Voucher</Text>
</View>


    {/* OJV No and Date */}
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>JV No:</Text>
        <TextInput
          style={styles.input}
          value={ojvno.toString()}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
    </View>

    {/* Account No and Account Name */}
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account No:</Text>
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
        <Text style={styles.label}>Account Name:</Text>
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

    {/* Description and Amount */}
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          maxLength={35} // Set maximum length to 35
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.amountLabel}>Amount:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric" // Ensure the keyboard is numeric for amount
        />
      </View>
    </View>

    {/* Transaction Type (Debit / Credit) Toggle */}
    <View style={styles.transactionTypeContainer}>
      <Text style={styles.label}>Transaction Type:</Text>

      <View style={styles.transactionTypeToggle}>
        <TouchableOpacity
          onPress={() => setTransactionType("debit")}
          style={[styles.transactionTypeButton, transactionType === "debit" && styles.selectedTransactionButton]}
        >
          <Text style={[styles.transactionTypeButtonText, transactionType === "debit" && styles.selectedTransactionButtonText]}>
            Debit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTransactionType("credit")}
          style={[styles.transactionTypeButton, transactionType === "credit" && styles.selectedTransactionButton]}
        >
          <Text style={[styles.transactionTypeButtonText, transactionType === "credit" && styles.selectedTransactionButtonText]}>
            Credit
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Add Row Button */}
    <View style={styles.row}>
  <TouchableOpacity onPress={addRow} style={styles.addRowButton}>
    <Text style={styles.addRowButtonText}>Add Row</Text>
  </TouchableOpacity>
</View>


    {/* Table Display */}
    <View style={styles.tableContainer}>
      <Text style={styles.tableHeading}>Account Details</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Account No</Text>
        <Text style={styles.tableHeaderText}>Account Name</Text>
        <Text style={styles.tableHeaderText}>Description</Text>
        <Text style={styles.tableHeaderText}>Debit</Text>
        <Text style={styles.tableHeaderText}>Credit</Text>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRowClick(item)} style={styles.tableRow}>
            <Text style={styles.tableRowText}>{item.accountNo}</Text>
            <Text style={styles.tableRowText}>{item.accountName}</Text>
            <Text style={styles.tableRowText}>{item.description}</Text>
            <Text style={styles.tableRowText}>{item.debit}</Text>
            <Text style={styles.tableRowText}>{item.credit}</Text>
          </TouchableOpacity>
        )}
      />
    </View>

    {/* New Inputs: Debit, Credit, Difference */}
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Debit</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter debit amount"
          value={debitAmount}
          onChangeText={(text) => setDebitAmount(text)}
          keyboardType="numeric"
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Credit</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter credit amount"
          value={creditAmount}
          onChangeText={(text) => setCreditAmount(text)}
          keyboardType="numeric"
          editable={false}
        />
      </View>
    </View>

    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Difference</Text>
        <TextInput
          style={styles.input}
          placeholder="Difference"
          value={difference}
          editable={false} // The difference can be calculated based on debit and credit
        />
      </View>
    </View>

    {/* Modify or Delete Row Modal */}
    <Modal
      visible={showModifyDeleteModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowModifyDeleteModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Modify or Delete Row</Text>
          <TouchableOpacity onPress={handleModifyRow} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Modify</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteRow} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowModifyDeleteModal(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    {/* Submit Button */}
{/* Submit Button */}
<View style={styles.submitButtonContainer} >
  <TouchableOpacity style={styles.submitButton}    onPress={insertData}>
    <Text style={styles.submitButtonText}>Submit</Text>
  </TouchableOpacity>
</View>

  </ScrollView>
</KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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

export default Journalvoucher;

