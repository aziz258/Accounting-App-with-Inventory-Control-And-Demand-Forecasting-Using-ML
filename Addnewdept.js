import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, FlatList } from "react-native";

const AddNewDept = () => {
  const [departmentNo, setDepartmentNo] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [category, setCategory] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroupNo, setSelectedGroupNo] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null);

  const fetchGroupData = () => {
    fetch("https://5461283ce09c.ngrok-free.app/myapp/getgroups.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched group data:", data);
        if (data && data.groups) {
          setGroupData(data.groups); // Set the fetched group data
        }
      })
      .catch((error) => {
        console.error("Error fetching group data:", error);
        Alert.alert("Error", "Unable to fetch group data.");
      });
  };

  // Fetch group data on component mount
  useEffect(() => {
    fetchGroupData();
  }, []);

  const fetchLatestDepartmentNumber = () => {
    fetch("https://5461283ce09c.ngrok-free.app/myapp/latestdept.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched department number:", data.latest_group_no); // Debugging log
        if (data && data.latest_group_no) {
          setDepartmentNo(data.latest_group_no.toString()); // Set the latest department number
        }
      })
      .catch((error) => {
        console.error("Error fetching department number:", error);
        Alert.alert("Error", "Unable to fetch the latest department number.");
      });
  };

  // Fetch latest department number on component mount
  useEffect(() => {
    fetchLatestDepartmentNumber();
  }, []);

  const handleSubmit = () => {
    // Validate input fields
    if (!departmentName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Prepare data to send to the backend
    const data = {
      group_no: departmentNo,
      group_name: departmentName,
      category: category,
      gcode: selectedGroupNo,
    };

    // Send the data to the PHP backend using fetch
    fetch("https://5461283ce09c.ngrok-free.app/myapp/insertnewdept.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),  // Convert data to JSON format
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Department added successfully.");

          // Reset department name and category after successful insert
          setDepartmentName("");
          setCategory("");

          // Fetch the latest department number again
          fetchLatestDepartmentNumber();
        } else {
          Alert.alert("Error", "Failed to add department.");
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        Alert.alert("Error", "Unable to add the department.");
      });
  };
  const renderGroupItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          setSelectedGroupNo(item.gcode);
          setSelectedGroupName(item.gname);
          setModalVisible(false); // Close the modal after selection
        }}
      >
        <Text style={styles.dropdownText}>{item.gcode} - {item.gname}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Add New Department</Text>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Group No:</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
              <Text style={styles.inputText}>{selectedGroupNo ? selectedGroupNo : "Select Group No"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Group Name:</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
              <Text style={styles.inputText}>{selectedGroupName ? selectedGroupName : "Select Group Name"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Department No:</Text>
            <TextInput 
              style={styles.smallInput} 
              value={departmentNo} 
              editable={false}  // Make it read-only
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Department Name:</Text>
          <TextInput 
            style={styles.input} 
            value={departmentName} 
            onChangeText={setDepartmentName} 
            placeholder="Enter Department Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category:</Text>
          <TextInput 
            style={styles.input} 
            value={category} 
            onChangeText={setCategory} 
            placeholder="Enter Category"
          />
        </View>

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
                data={groupData}
                renderItem={renderGroupItem}
                keyExtractor={(item) => item.gcode.toString()}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#34495E", // Match heading background color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginTop: -290,
  },
  headingContainer: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInputContainer: {
    width: "45%",
    marginBottom: 15,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f0f0f0",  // Light gray to indicate read-only
    color: "#888",  // Dim text for readability
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  submitButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default AddNewDept;
