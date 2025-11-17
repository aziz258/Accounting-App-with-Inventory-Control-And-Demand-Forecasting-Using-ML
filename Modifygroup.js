import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";

const ModifyGroup = () => {
  const [groupNo, setGroupNo] = useState("");  
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");

  const fetchGroupDetails = () => {
    // Validate groupNo input
    if (!groupNo) {
      Alert.alert("Error", "Please enter a Group No.");
      return;
    }

    // Send request to fetch group name and category based on group_no
    fetch("https://5461283ce09c.ngrok-free.app/myapp/fetchgroupdata.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group_no: groupNo }),  // Only send group_no
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setGroupName(data.group_name);  // Set the fetched group name
          setCategory(data.category);     // Set the fetched category
        } else {
          Alert.alert("Error", "Group not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching group details:", error);
        Alert.alert("Error", "Unable to fetch group details.");
      });
  };

  const handleSubmit = () => {
    if (!groupNo || !groupName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const data = { group_no: groupNo, group_name: groupName, category: category };

    fetch("https://5461283ce09c.ngrok-free.app/myapp/insertmodifygroup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Group added successfully.");
          setGroupName("");
          setCategory("");
          setGroupNo("");
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
          <Text style={styles.heading}>Modify Group</Text>
        </View>

        <View style={styles.inputRow}>
  <View style={styles.smallInputContainer}>
    <Text style={styles.label}>Group No:</Text>
    <TextInput
      style={styles.smallInput}
      value={groupNo}
      onChangeText={(text) => {
        // Allow only numeric input
        if (/^\d+$/.test(text) || text === '') {
          setGroupNo(text); // Update state with numeric value
        }
      }}
      placeholder="Enter Group Number"
      keyboardType="numeric" // This will bring up the numeric keyboard on mobile devices
    />
  </View>



          <TouchableOpacity 
            style={styles.fetchButton} 
            onPress={fetchGroupDetails}
          >
            <Text style={styles.fetchButtonText}>Fetch</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Group Name:</Text>
          <TextInput 
            style={styles.input} 
            value={groupName} 
            onChangeText={setGroupName} 
            placeholder="Group Name"
           
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category:</Text>
          <TextInput 
            style={styles.input} 
            value={category} 
            onChangeText={setCategory} 
            placeholder="Category"
           
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
    borderColor: "#34495E",
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
    alignItems: "center",
  },
  smallInputContainer: {
    width: "70%",
    marginBottom: 15,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  fetchButton: {
    backgroundColor: "#28a745", // Green color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fetchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModifyGroup;
