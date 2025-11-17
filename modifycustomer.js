import React, { useState } from "react";
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

const ModifyCustomer = () => {
  const [supplierCode, setSupplierCode] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const handleFetch = () => {
    if (!supplierCode) {
      Alert.alert("Error", "Please enter a Supplier Code to fetch.");
      return;
    }
  
    fetch("https://5461283ce09c.ngrok-free.app/myapp/fetchcustomerdata.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scode: supplierCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const supplier = data.data;
          setSupplierName(supplier.cname);
          setAddress(supplier.cadd);
          setCity(supplier.ccity);
          setCountry(supplier.ccountry);
          setContactNo(supplier.cmob);
          setEmail(supplier.cemail);
          setCategory(supplier.category1);
          Alert.alert("Success", "Customer data fetched successfully.");
        } else {
          Alert.alert("Not Found", data.message || "Customer not found.");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        Alert.alert("Error", "Failed to fetch Customer data.");
      });
  };
  

  const handleSubmit = () => {
    if (!supplierName) {
      Alert.alert("Error", "Please fill in the Customer Name.");
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

    fetch("https://5461283ce09c.ngrok-free.app/myapp/insertmodifycustomer.php", {
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
          setSupplierCode("");
          setSupplierName("");
          setAddress("");
          setCity("");
          setCountry("");
          setContactNo("");
          setEmail("");
          setCategory("");
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
            <Text style={styles.heading}>Modify Customer</Text>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.label}>Customer Code:</Text>
              <TextInput
                style={styles.input}
                value={supplierCode}
                onChangeText={setSupplierCode}
                placeholder="Enter Supplier Code"
              />
            </View>

            <View style={styles.smallInputContainer}>
              <Text style={styles.label}>Customer Name:</Text>
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
  <View style={styles.rowContainer}>
    <TextInput
      style={[styles.input, { flex: 1, marginRight: 10 }]}
      value={address}
      onChangeText={setAddress}
      placeholder="Enter Address"
    />
   <TouchableOpacity style={styles.fetchButton} onPress={handleFetch}>
  <Text style={styles.fetchButtonText}>Fetch</Text>
</TouchableOpacity>

  </View>
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fetchButton: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  fetchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});

export default ModifyCustomer;
