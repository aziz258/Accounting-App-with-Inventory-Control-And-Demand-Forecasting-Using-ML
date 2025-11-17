import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useCompany } from "./CompanyContext";
const AddNewGroup = () => {
  const [groupNo, setGroupNo] = useState("");
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");

  const { companyCode } = useCompany();

  const fetchLatestGroupNumber = () => {
    fetch("https://5461283ce09c.ngrok-free.app/myapp/getlatestgroupno.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched group number:", data.latest_group_no); // Debugging log
        if (data && data.latest_group_no) {
          setGroupNo(data.latest_group_no.toString()); // Set the latest group number
        }
      })
      .catch((error) => {
        console.error("Error fetching group number:", error);
        Alert.alert("Error", "Unable to fetch the latest group number.");
      });
  };

  // Fetch latest group number on component mount
  useEffect(() => {
    fetchLatestGroupNumber();
  }, []);

  const handleSubmit = () => {
    // Validate input fields
    if (!groupName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Prepare data to send to the backend
    const data = {
      group_no: groupNo,
      group_name: groupName,
      category: category,
    };

    // Send the data to the PHP backend using fetch
    fetch("https://5461283ce09c.ngrok-free.app/myapp/insertnewgroup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),  // Convert data to JSON format
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Group added successfully.");

          // Reset group name and category after successful insert
          setGroupName("");
          setCategory("");

          // Fetch the latest group number again
          fetchLatestGroupNumber();
        } else {
          Alert.alert("Error", "Failed to add group.");
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        Alert.alert("Error", "Unable to add the group.");
      });
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Add New Group</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Group No:</Text>
            <TextInput 
              style={styles.smallInput} 
              value={groupNo} 
              editable={false}  // Make it read-only
            />
          </View>
        </View>
        <View>
      <Text>Company Code: {companyCode}</Text>  {/* Display company code */}
    </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Group Name:</Text>
          <TextInput 
            style={styles.input} 
            value={groupName} 
            onChangeText={setGroupName} 
            placeholder="Enter Group Name"
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
    marginTop: -390,
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
});

export default AddNewGroup;
