import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from "react-native";

const ModifyProduct = () => {
  const [productNo, setProductNo] = useState("");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [selectedDeptNo, setSelectedDeptNo] = useState(null);
  const [selectedDeptName, setSelectedDeptName] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [minQty, setMinQty] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const handleFetch = () => {
    if (!productNo) {
      Alert.alert("Error", "Please enter a product code.");
      return;
    }
  
    fetch("https://5461283ce09c.ngrok-free.app/myapp/fetchproductdata.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pcode: productNo }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          const data = responseJson.data;
          setProductName(data.pname);
          setUnit(data.unit);
          setMinQty(data.mqty.toString());
          setPurchasePrice(data.pprice.toString());
          setSalePrice(data.sprice.toString());
          setWholesalePrice(data.wprice.toString());
          setSelectedDeptNo(data.dcode); // assuming you have this too
          setSelectedDeptName(data.dname);
        } else {
          Alert.alert("Error", responseJson.error || "Product not found.");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        Alert.alert("Error", "Failed to fetch product data.");
      });
  };
  
  

  const unitOptions = ["kg", "meter", "lbs", "gz", "pcs", "nos", "ft"];

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

  const handleSubmit = () => {
    if (!productNo || !productName || !unit) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const data = {
      group_no: productNo,
      group_name: productName,
      unit: unit,
      min_qty_level: minQty, // ✅ fixed this line
      purchase_price: purchasePrice,
      sale_price: salePrice,
      wholesale_price: wholesalePrice,
      gcode: selectedDeptNo,
    };

    fetch("https://5461283ce09c.ngrok-free.app/myapp/insertmodifypro.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Product added successfully.");
          setProductNo("");
          setProductName("");
          setUnit("");
          setMinQty("");
          setPurchasePrice("");
          setSalePrice("");
          setWholesalePrice("");
        } else {
          Alert.alert("Error", "Failed to add product.");
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        Alert.alert("Error", "Unable to add the product.");
      });
  };

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

  const renderUnitItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setUnit(item);
        setUnitModalVisible(false);
      }}
    >
      <Text style={styles.dropdownText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Modify Product</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Department No:</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
              <Text style={styles.inputText}>
                {selectedDeptNo ? selectedDeptNo : "Select Dept No"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Department Name:</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
              <Text style={styles.inputText}>
                {selectedDeptName ? selectedDeptName : "Select Dept Name"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Product No:</Text>
            <TextInput
              style={styles.input}
              value={productNo}
              onChangeText={setProductNo}
              placeholder="Enter Product No"
            />
          </View>

          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Product Name:</Text>
            <TextInput
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
              placeholder="Enter Product Name"
            />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Unit:</Text>
          <TouchableOpacity onPress={() => setUnitModalVisible(true)} style={styles.input}>
            <Text style={styles.inputText}>{unit ? unit : "Select Unit"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fetchButton} onPress={handleFetch} >
    <Text style={styles.fetchButtonText}>Fetch</Text>
  </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Min Qty Level:</Text>
            <TextInput
              style={styles.input}
              value={minQty}
              onChangeText={setMinQty}
              placeholder="e.g. 10"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Purchase Price:</Text>
            <TextInput
              style={styles.input}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="e.g. 100"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Sale Price:</Text>
            <TextInput
              style={styles.input}
              value={salePrice}
              onChangeText={setSalePrice}
              placeholder="e.g. 150"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.smallInputContainer}>
            <Text style={styles.label}>Wholesale Price:</Text>
            <TextInput
              style={styles.input}
              value={wholesalePrice}
              onChangeText={setWholesalePrice}
              placeholder="e.g. 130"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
                keyExtractor={(item) => item.dcode.toString()}
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

        {/* Unit Modal */}
        <Modal
          visible={unitModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setUnitModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={unitOptions}
                renderItem={renderUnitItem}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setUnitModalVisible(false)}
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
    borderColor: "#34495E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginTop: -230,
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
    width: "45%",
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
  inputText: {
    fontSize: 16,
    color: "#333",
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
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 0,
  },
  
  fetchButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 100,
  },
  
  fetchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ModifyProduct;
