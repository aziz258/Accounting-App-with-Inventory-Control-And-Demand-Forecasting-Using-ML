// Purchaseinvc.js
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

const Salereturninvc = () => {
  const [ojvno, setOjvno] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNos, setAccountNos] = useState([]);
  const [accountNames, setAccountNames] = useState([]);
  const [accountNoModalVisible, setAccountNoModalVisible] = useState(false);
  const [accountNameModalVisible, setAccountNameModalVisible] = useState(false);

  const [supplierCode, setSupplierCode] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierCodes, setSupplierCodes] = useState([]);
  const [supplierNames, setSupplierNames] = useState([]);
  const [supplierCodeModalVisible, setSupplierCodeModalVisible] = useState(false);
  const [supplierNameModalVisible, setSupplierNameModalVisible] = useState(false);
    const [noOfPcs, setNoOfPcs] = useState("");
    const [qtyPerPcs, setQtyPerPcs] = useState("");
    const [qtyIn, setQtyIn] = useState("0");
    const [rows, setRows] = useState([]);
    const tableColumns = ["P-Code", "No. of Pcs", "Qty/Pcs", "QtyIn", "Price", "Amount"];




    const [selectedDeptNo, setSelectedDeptNo] = useState(null);
    const [selectedDeptName, setSelectedDeptName] = useState(null);
    const [departmentData, setDepartmentData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
  
    const [productsData, setProductsData] = useState([]);
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [grandTotal, setGrandTotal] = useState("0");
const [discountPercent, setDiscountPercent] = useState("");
const [discountAmount, setDiscountAmount] = useState("0");
const [netTotal, setNetTotal] = useState("0");

 
    
  
    const [selectedProductCode, setSelectedProductCode] = useState(null);
    const [selectedProductName, setSelectedProductName] = useState(null);
const [price, setPrice] = useState("");
const [amount, setAmount] = useState("0");

const calculateAmount = (qty, prc) => {
  const amt = parseFloat(qty || 0) * parseFloat(prc || 0);
  setAmount(amt.toFixed(2));
};

const handleSubmit = async () => {
  if (!ojvno || !accountNo || !supplierCode || !selectedDeptNo || rows.length === 0) {
    Alert.alert("Missing Information", "Please fill all required fields and add at least one product row.");
    return;
  }

  const payload = {
    grno: ojvno,
    date: selectedDate.toISOString().split('T')[0],
    ComboBox5: supplierCode,
    billno: ojvno,
    per: discountPercent || "0",
    discount: discountAmount || "0",
    nettotal: netTotal || "0",
    ComboBox7: accountNo,
    ComboBox9: selectedDeptNo,
    comission: "0",
    commamt: "0",
    tableData: rows.map(row => ({
      pcode: row.pcode,
      pcs: row.noOfPcs,
      qpcs: row.qtyPerPcs,
      qtyin: row.qtyIn,
      rate: row.price,
    }))
  };

  try {
    const response = await fetch("https://5461283ce09c.ngrok-free.app/myapp/insertrinvc.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.text();

    if (response.ok) {
      Alert.alert("Success", result);

      // ✅ Reset all fields
      setOjvno("");
      setSelectedDate(new Date());
      setAccountNo("");
      setAccountName("");
      setSupplierCode("");
      setSupplierName("");
      setSelectedDeptNo(null);
      setSelectedDeptName(null);
      setNoOfPcs("");
      setQtyPerPcs("");
      setQtyIn("0");
      setRows([]);
      setGrandTotal("0");
      setDiscountPercent("");
      setDiscountAmount("0");
      setNetTotal("0");
      setSelectedProductCode(null);
      setSelectedProductName(null);
      setPrice("");
      setAmount("0");

      // ✅ Re-fetch new GRNO
      fetchGrno(); // <- Make sure this function is defined elsewhere

    } else {
      Alert.alert("Server Error", result);
    }
  } catch (error) {
    Alert.alert("Network Error", error.message);
  }
};



const handleRowClick = (index) => {
  const selectedRow = rows[index];

  // Set input values from the selected row
  setSelectedProductCode(selectedRow.pcode);
  setNoOfPcs(selectedRow.noOfPcs);
  setQtyPerPcs(selectedRow.qtyPerPcs);
  setPrice(selectedRow.price);
  setAmount(selectedRow.amount);

  // Calculate derived fields
  calculateQtyIn(selectedRow.noOfPcs, selectedRow.qtyPerPcs);
  calculateAmount(selectedRow.qtyIn, selectedRow.price);

  // Remove row and update rows list
  const updatedRows = [...rows];
  updatedRows.splice(index, 1);
  setRows(updatedRows);

  // Recalculate totals
  calculateTotals(updatedRows);
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
const calculateQtyIn = (pcs, perPcs) => {
  const pcsNum = parseFloat(pcs) || 0;
  const perPcsNum = parseFloat(perPcs) || 0;
  const qty = pcsNum * perPcsNum;
  setQtyIn(qty.toString());

  // Also calculate amount based on current price
  const priceNum = parseFloat(price) || 0;
  const amt = qty * priceNum;
  setAmount(amt.toFixed(2));
};




const handleAddRow = () => {
  if (!selectedProductCode || !noOfPcs || !qtyPerPcs || !price || !amount) {
    Alert.alert("Missing Fields", "Please complete all required fields.");
    return;
  }

  const newRow = {
    pcode: selectedProductCode,
    noOfPcs,
    qtyPerPcs,
    qtyIn,
    price,
    amount,
  };

  const updatedRows = [...rows, newRow];
  setRows(updatedRows);

  // Clear input fields
  setSelectedProductCode('');
  setSelectedProductName('');
  setNoOfPcs('');
  setQtyPerPcs('');
  setQtyIn('');
  setPrice('');
  setAmount('');

  // Correctly recalculate totals with updated rows
  calculateTotals(updatedRows);
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
           fetchGrno();
       
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
    
const calculateTotals = (rows) => {
  const total = rows.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);
  setGrandTotal(total.toFixed(2));

  // Recalculate discount amount and net total if discount % exists
  if (discountPercent !== "") {
    const discountAmt = (total * parseFloat(discountPercent)) / 100;
    setDiscountAmount(discountAmt.toFixed(2));
    setNetTotal((total - discountAmt).toFixed(2));
  } else {
    setDiscountAmount("0");
    setNetTotal(total.toFixed(2));
  }
};

const handleDiscountChange = (value) => {
  setDiscountPercent(value);

  const total = parseFloat(grandTotal) || 0;
  const discount = (total * parseFloat(value || 0)) / 100;
  setDiscountAmount(discount.toFixed(2));
  setNetTotal((total - discount).toFixed(2));
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
    

 const fetchGrno = () => {
    axios.get("https://5461283ce09c.ngrok-free.app/myapp/fetchrinvc.php")
      .then((res) => {
        if (res.data.success) setOjvno(res.data.ojvno);
      })
      .catch((err) => console.error("Failed to fetch GRNO:", err));
  };

  useEffect(() => {
    axios.get("https://5461283ce09c.ngrok-free.app/myapp/fetchrinvc.php")
      .then((res) => {
        if (res.data.success) setOjvno(res.data.ojvno);
      }).catch(console.error);

    axios.get("https://5461283ce09c.ngrok-free.app/myapp/salesacct.php")
      .then((res) => {
        if (res.data.success) {
          setAccountNos(res.data.accountNos);
          setAccountNames(res.data.accountNames);
        }
      }).catch(console.error);

    axios.get("https://5461283ce09c.ngrok-free.app/myapp/fetchcust.php")
      .then((res) => {
        if (res.data.success) {
          setSupplierCodes(res.data.supplierCodes);
          setSupplierNames(res.data.supplierNames);
        }
      }).catch(console.error);
  }, []);

  const onChangeDate = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

const selectItem = (value, fromList, toListSetter, oppositeList, oppositeSetter, modalSetter) => {
  toListSetter(value);
  const index = fromList.indexOf(value);
  if (index !== -1) {
    oppositeSetter(oppositeList[index]);
  }
  modalSetter(false);
};


  const renderItem = (item, onPress) => (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.companyItem}>
      <Text style={styles.companyItemText}>{item}</Text>
    </TouchableOpacity>
  );
  

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Sale Return Invoice</Text>
        </View>

        {/* Gr No and Date */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Invc No:</Text>
            <TextInput style={styles.input} value={ojvno.toString()} editable={false} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{selectedDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onChangeDate} />
            )}
          </View>
        </View>

        {/* Debit Account */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Credit Account No:</Text>
            <TouchableOpacity onPress={() => setAccountNoModalVisible(true)} style={styles.input}>
              <Text>{accountNo || "Select Account No"}</Text>
            </TouchableOpacity>
            <Modal visible={accountNoModalVisible} transparent animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <FlatList data={accountNos} renderItem={({ item }) => renderItem(item, (val) => selectItem(val, accountNos, setAccountNo, accountNames, setAccountName, setAccountNoModalVisible))} keyExtractor={(item, i) => i.toString()} />
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAccountNoModalVisible(false)}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Credit Account Name:</Text>
            <TouchableOpacity onPress={() => setAccountNameModalVisible(true)} style={styles.input}>
              <Text>{accountName || "Select Account Name"}</Text>
            </TouchableOpacity>
            <Modal visible={accountNameModalVisible} transparent animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <FlatList data={accountNames} renderItem={({ item }) => renderItem(item, (val) => selectItem(val, accountNames, setAccountName, accountNos, setAccountNo, setAccountNameModalVisible))} keyExtractor={(item, i) => i.toString()} />
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAccountNameModalVisible(false)}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>

        {/* Supplier Code and Name */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Code:</Text>
            <TouchableOpacity onPress={() => setSupplierCodeModalVisible(true)} style={styles.input}>
              <Text>{supplierCode || "Select Supplier Code"}</Text>
            </TouchableOpacity>
            <Modal visible={supplierCodeModalVisible} transparent animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <FlatList data={supplierCodes} renderItem={({ item }) => renderItem(item, (val) => selectItem(val, supplierCodes, setSupplierCode, supplierNames, setSupplierName, setSupplierCodeModalVisible))} keyExtractor={(item, i) => i.toString()} />
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSupplierCodeModalVisible(false)}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Name:</Text>
            <TouchableOpacity onPress={() => setSupplierNameModalVisible(true)} style={styles.input}>
              <Text>{supplierName || "Select Supplier Name"}</Text>
            </TouchableOpacity>
            <Modal visible={supplierNameModalVisible} transparent animationType="fade">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <FlatList data={supplierNames} renderItem={({ item }) => renderItem(item, (val) => selectItem(val, supplierNames, setSupplierName, supplierCodes, setSupplierCode, setSupplierNameModalVisible))} keyExtractor={(item, i) => i.toString()} />
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSupplierNameModalVisible(false)}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
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
  {/* Qty In */}
  <View style={styles.quarterInputContainer}>
    <Text style={styles.label}>Qty out:</Text>
    <View style={[styles.input, { backgroundColor: "#eaeaea" }]}>
      <Text style={styles.inputText}>{qtyIn || "0"}</Text>
    </View>
  </View>

  {/* Price */}
  <View style={styles.quarterInputContainer}>
    <Text style={styles.label}>Price:</Text>
    <TouchableOpacity style={styles.input}>
      <TextInput
        keyboardType="numeric"
        placeholder="Enter Price"
        value={price}
        onChangeText={(text) => {
          setPrice(text);
          calculateAmount(qtyIn, text);
        }}
      />
    </TouchableOpacity>
  </View>

  {/* Amount */}
  <View style={styles.quarterInputContainer}>
    <Text style={styles.label}>Amount:</Text>
    <View style={[styles.input, { backgroundColor: "#eaeaea" }]}>
      <Text style={styles.inputText}>{amount || "0"}</Text>
    </View>
  </View>

  {/* Add Row Button */}
  <View style={styles.buttonContainer}>
   <TouchableOpacity style={styles.addRowButton} onPress={handleAddRow}>
  <Text style={styles.addRowButtonText}>+</Text>
</TouchableOpacity>

  </View>
</View>
<View style={styles.tableContainer}>
  {/* Always show table header */}
  <View style={styles.tableRow}>
    {tableColumns.map((col, index) => (
      <Text key={index} style={styles.tableHeader}>{col}</Text>
    ))}
  </View>

  {/* Only show rows if present */}
  {rows.length > 0 ? (
    rows.map((row, index) => (
      <TouchableOpacity key={index} style={styles.tableRow} onPress={() => handleRowClick(index)}>
        <Text style={styles.tableCell}>{row.pcode}</Text>
        <Text style={styles.tableCell}>{row.noOfPcs}</Text>
        <Text style={styles.tableCell}>{row.qtyPerPcs}</Text>
        <Text style={styles.tableCell}>{row.qtyIn}</Text>
        <Text style={styles.tableCell}>{row.price}</Text>
        <Text style={styles.tableCell}>{row.amount}</Text>
     </TouchableOpacity>
    ))
  ) : (
    <Text style={styles.emptyTableText}>No rows added yet</Text>
  )}
</View>

<View style={styles.totalContainer}>
  <View style={styles.rowContainer}>
    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>Grand Total:</Text>
      <View style={[styles.input, { backgroundColor: "#eaeaea" }]}>
        <Text style={styles.inputText}>{grandTotal}</Text>
      </View>
    </View>

    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>Discount %:</Text>
      <TouchableOpacity style={styles.input}>
        <TextInput
          keyboardType="numeric"
          placeholder="Enter Discount %"
          value={discountPercent}
          onChangeText={handleDiscountChange}
        />
      </TouchableOpacity>
    </View>
  </View>

  <View style={styles.rowContainer}>
    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>Discount Amount:</Text>
      <View style={[styles.input, { backgroundColor: "#eaeaea" }]}>
        <Text style={styles.inputText}>{discountAmount}</Text>
      </View>
    </View>

    <View style={styles.halfInputContainer}>
      <Text style={styles.label}>Net Total:</Text>
      <View style={[styles.input, { backgroundColor: "#eaeaea" }]}>
        <Text style={styles.inputText}>{netTotal}</Text>
      </View>
    </View>
  </View>
</View>
<View style={{ alignItems: 'center', marginVertical: 20 }}>
  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
    <Text style={styles.submitButtonText}>Submit</Text>
  </TouchableOpacity>
</View>

                  
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, padding: 0 },
  headingContainer: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  heading: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  rowContainer: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginBottom: 10 },
  inputContainer: { flex: 1, marginHorizontal: 5 },
  halfInputContainer: { flex: 1, marginHorizontal: 5 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputText: { fontSize: 16, color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: 400,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  modalCloseButton: {
    padding: 10,
    backgroundColor: "#6200ee",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalCloseText: { color: "white", fontSize: 16 },
  closeButton: {
    padding: 10,
    backgroundColor: "#6200ee",
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontSize: 16 },
  companyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  companyItemText: { fontSize: 16, color: "#333" },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  codeText: { fontSize: 16, fontWeight: "bold", color: "#444" },
  nameText: { fontSize: 16, color: "#555" },
  quarterInputContainer: {
  flex: 1,
  marginHorizontal: 4,
},
buttonContainer: {
  justifyContent: "flex-end",
  alignItems: "center",
  marginBottom: 5,
},
addRowButton: {
  backgroundColor: "#27ae60",
  paddingHorizontal: 12,
  paddingVertical: 5,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
},
addRowButtonText: {
  color: "white",
  fontSize: 20,
  fontWeight: "bold",
},
tableContainer: {
  marginTop: 20,
  borderTopWidth: 1,
  borderColor: "#ccc"
},
tableRow: {
  flexDirection: "row",
  borderBottomWidth: 1,
  borderColor: "#ccc",
  paddingVertical: 8,
  paddingHorizontal: 4,
},
tableHeader: {
  flex: 1,
  fontWeight: "bold",
  fontSize: 14,
  textAlign: "center",
},
tableCell: {
  flex: 1,
  fontSize: 14,
  textAlign: "center",
},
emptyTableText: {
  textAlign: 'center',
  color: '#999',
  paddingVertical: 10,
  fontStyle: 'italic',
},
submitButton: {
  backgroundColor: '#007bff',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 5,
},
submitButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});


export default Salereturninvc;
