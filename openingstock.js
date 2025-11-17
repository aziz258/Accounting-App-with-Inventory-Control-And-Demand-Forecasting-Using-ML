import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';


const Openingstock = () => {
  const [selectedDeptNo, setSelectedDeptNo] = useState(null);
  const [selectedDeptName, setSelectedDeptName] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [productsData, setProductsData] = useState([]);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [idNo, setIdNo] = useState("");
  const [noOfPcs, setNoOfPcs] = useState("");
  const [qtyPerPcs, setQtyPerPcs] = useState("");
  const [qtyIn, setQtyIn] = useState("0");
  

  const [selectedProductCode, setSelectedProductCode] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const onDateChange = (event, date) => {
  setShowDatePicker(false);
  if (date) {
    setSelectedDate(date);
  }
};
const calculateQtyIn = (pcs, perPcs) => {
  const pcsNum = parseFloat(pcs) || 0;
  const perPcsNum = parseFloat(perPcs) || 0;
  setQtyIn((pcsNum * perPcsNum).toString());
};

const fetchLatestIdNo = () => {
  fetch("https://5461283ce09c.ngrok-free.app/myapp/idno.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.new_id) {
        setIdNo(data.new_id.toString());
      }
    })
    .catch((error) => {
      console.error("Error fetching latest ID No:", error);
      Alert.alert("Error", "Unable to fetch latest ID No");
    });
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

  const insertData = () => {
    // Validate fields
    if (
      !selectedProductCode ||
      !selectedDeptNo ||
      !idNo ||
      !selectedDate ||
      !noOfPcs ||
      !qtyPerPcs ||
      !qtyIn
    ) {
      Alert.alert("Error", "Please fill all fields before submitting.");
      return;
    }
  
    // Format date as yyyy-mm-dd string
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    const url = "https://5461283ce09c.ngrok-free.app/myapp/insertstock.php";
  
    const data = {
      pcode: selectedProductCode,
      dcode: selectedDeptNo,
      idno: idNo,
      dt_date: formattedDate,
      unitsin: noOfPcs,
      qperpc: qtyPerPcs,
      qtyin: qtyIn,
    };
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((responseText) => {
        Alert.alert("Success", responseText);
  
        // Reset fields after insert if needed
      
        setIdNo("");
        setSelectedDate(new Date());
        setNoOfPcs("");
        setQtyPerPcs("");
        setQtyIn("0");
        fetchLatestIdNo();
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to insert data. Check connection or backend.");
        console.error(error);
      });
  };
  
  

  const fetchProducts = (dcode) => {
    fetch("https://5461283ce09c.ngrok-free.app/myapp/getproducts.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dcode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.products) {
          setProductsData(data.products);
          setProductModalVisible(true);
        } else {
          setProductsData([]);
          Alert.alert("No Products", "No products found for this department.");
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        Alert.alert("Error", "Unable to fetch products.");
      });
  };

  useEffect(() => {
    fetchDepartmentData();
    fetchLatestIdNo(); // Add this line
  }, []);
  

  const handleDeptSelect = (item) => {
    setSelectedDeptNo(item.dcode);
    setSelectedDeptName(item.dname);
    setModalVisible(false);
    setSelectedProductCode(null);
    setSelectedProductName(null);
    fetchProducts(item.dcode);
  };

  const handleProductSelect = (item) => {
    setSelectedProductCode(item.pcode);
    setSelectedProductName(item.pname);
    setProductModalVisible(false);
  };

  const renderDeptItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleDeptSelect(item)}
    >
      <View style={styles.rowItem}>
        <Text style={styles.codeText}>{item.dcode}</Text>
        <Text style={styles.nameText}>{item.dname}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleProductSelect(item)}
    >
      <View style={styles.rowItem}>
        <Text style={styles.codeText}>{item.pcode}</Text>
        <Text style={styles.nameText}>{item.pname}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Opening Stock of Product</Text>

          {/* Department Row */}
          <View style={styles.rowContainer}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Dept No:</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.input}
              >
                <Text style={styles.inputText}>
                  {selectedDeptNo || "Select Dept No"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Dept Name:</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.input}
              >
                <Text style={styles.inputText}>
                  {selectedDeptName || "Select Dept Name"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Row */}
          <View style={styles.rowContainer}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Product Code:</Text>
              <TouchableOpacity
                onPress={() =>
                  selectedDeptNo
                    ? setProductModalVisible(true)
                    : Alert.alert(
                        "Select Department",
                        "Please select a department first."
                      )
                }
                style={styles.input}
              >
                <Text style={styles.inputText}>
                  {selectedProductCode || "Select Product Code"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Product Name:</Text>
              <TouchableOpacity
                onPress={() =>
                  selectedDeptNo
                    ? setProductModalVisible(true)
                    : Alert.alert(
                        "Select Department",
                        "Please select a department first."
                      )
                }
                style={styles.input}
              >
                <Text style={styles.inputText}>
                  {selectedProductName || "Select Product Name"}
                </Text>
              </TouchableOpacity>
            </View>
            
          </View>
          <View style={styles.rowContainer}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>ID No:</Text>
    <View style={[styles.input, { backgroundColor: "#eaeaea" }]}>
      <Text style={styles.inputText}>{idNo || "Loading..."}</Text>
    </View>
  </View>

  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Date:</Text>
    <TouchableOpacity
      style={styles.input}
      onPress={() => setShowDatePicker(true)}
    >
      <Text style={styles.inputText}>
        {selectedDate.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  </View>
</View>


{showDatePicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="default"
    onChange={onDateChange}
  />
)}

{/* Quantity Calculation Row */}
<View style={styles.rowContainer}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>No. of Pcs:</Text>
    <TouchableOpacity style={styles.input}>
      <TextInput
        keyboardType="numeric"
        placeholder="Enter No. of Pcs"
        value={noOfPcs}
        onChangeText={(text) => {
          setNoOfPcs(text);
          calculateQtyIn(text, qtyPerPcs);
        }}
      />
    </TouchableOpacity>
  </View>

  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Qty Per Pcs:</Text>
    <TouchableOpacity style={styles.input}>
      <TextInput
        keyboardType="numeric"
        placeholder="Enter Qty Per Pcs"
        value={qtyPerPcs}
        onChangeText={(text) => {
          setQtyPerPcs(text);
          calculateQtyIn(noOfPcs, text);
        }}
      />
    </TouchableOpacity>
  </View>
</View>

<View style={styles.rowContainer}>
  <View style={styles.halfInputContainer}>
    <Text style={styles.label}>Qty In:</Text>
    <View style={[styles.input, { backgroundColor: "#eaeaea" }]}>
      <Text style={styles.inputText}>{qtyIn || "0"}</Text>
    </View>
  </View>
</View>


<TouchableOpacity
  style={[styles.closeButton, { backgroundColor: "#007BFF" }]}
  onPress={insertData} // 👈 Call the insertData function here
>
  <Text style={styles.closeButtonText}>Submit</Text>
</TouchableOpacity>



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

          {/* Product Modal */}
          <Modal
            visible={productModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setProductModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {productsData.length > 0 ? (
                  <FlatList
                    data={productsData}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.pcode.toString()}
                  />
                ) : (
                  <Text style={{ textAlign: "center", marginVertical: 20 }}>
                    No Products Available
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setProductModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
    marginTop: -190,
  },
  heading: {
    color: "#FFFFFF",
    fontSize:25,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    backgroundColor: "#34495E",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
  },
  halfInputContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  codeText: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    flex: 2,
    color: "#555",
  },
  dropdownItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Openingstock;
