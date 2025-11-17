import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const AddNewSupplier = () => {
  const [supplierCode, setSupplierCode] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");

  // Fetch latest supplier code on mount
  useEffect(() => {
    fetch("https://5461283ce09c.ngrok-free.app/myapp/latestsupplier.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSupplierCode(data.new_code.toString());
        } else {
          Alert.alert("Error", "Failed to fetch supplier code.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        Alert.alert("Error", "Unable to load supplier code.");
      });
  }, []);

  const handleSubmit = () => {
    if (!supplierName) {
      Alert.alert("Error", "Please fill in the Supplier Name.");
      return;
    }
  
    const data = {
      scode: supplierCode,
      sname: supplierName,
      sadd: address,
      scity: city,
      scountry: country,
      smob: contactNo,
      semail: email,
      category1: category,
    };
  
    fetch("https://5461283ce09c.ngrok-free.app/myapp/insertsupplier.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Supplier added successfully.");
          setSupplierName("");
          setAddress("");
          setCity("");
          setCountry("");
          setContactNo("");
          setEmail("");
          setCategory("");
  
          // Fetch next available code after insertion
          fetch("https://5461283ce09c.ngrok-free.app/myapp/latestsupplier.php")
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setSupplierCode(data.new_code.toString());
              }
            });
        } else {
          Alert.alert("Error", "Failed to add supplier.");
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        Alert.alert("Error", "Unable to add the supplier.");
      });
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Add New Supplier</Text>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.label}>Supplier Code:</Text>
              <TextInput
                style={styles.input}
                value={supplierCode}
                editable={false}
                placeholder="Auto-generated"
              />
            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.label}>Supplier Name:</Text>
              <TextInput
                style={styles.input}
                value={supplierName}
                onChangeText={setSupplierName}
                placeholder="Enter Name"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address:</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter Address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City:</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter City"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country:</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Enter Country"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact No:</Text>
            <TextInput
              style={styles.input}
              value={contactNo}
              onChangeText={setContactNo}
              placeholder="Enter Contact No"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
              keyboardType="email-address"
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
    </KeyboardAvoidingView>
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
    elevation: 4,
    marginTop: -40,
  },
  headingContainer: {
    backgroundColor: "#34495E",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInputContainer: {
    width: "48%",
    marginBottom: 15,
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
    alignItems: "center",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddNewSupplier;
