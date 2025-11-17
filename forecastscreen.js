// ForecastScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';

const ForecastScreen = () => {
  /* ───────────────────────────
     1️⃣  Local state
  ─────────────────────────── */
const products = [
  { pcode: "PD00123", pname: "Payala garazani set" },
  { pcode: "CG00013", pname: "52/Sub Sup" },
  { pcode: "CG00001", pname: "40/49 Sada Sup" },
  { pcode: "CG00007", pname: "40/49 Sada Sta" },
  { pcode: "CG00057", pname: "30/49 SADA SUP" },
  { pcode: "CG00058", pname: "30/49 SADA STA" },
  { pcode: "CG00059", pname: "30/49 SADA UNCUT SUP" },
  { pcode: "CG00060", pname: "30/49 SADA UNCUT STA" },
  { pcode: "Ch00006", pname: "80/s Cotton Koh e Noor" },
  { pcode: "CG00061", pname: "M Bember Commercial" },
  { pcode: "PD00124", pname: "Panja game" },
  { pcode: "PD00125", pname: "Ruli bracket" },
  { pcode: "PD00126", pname: "plat churi bhari" },
  { pcode: "CG00055", pname: "SPL Sub Sta" },
  { pcode: "CG00054", pname: "SPL Sub Sup" },
  { pcode: "CG00052", pname: "Blue Ribbon Sup" },
  { pcode: "CG00053", pname: "Blue Ribbon Sta" },
  { pcode: "BG00004", pname: "30/56 SPL Sta" },
  { pcode: "BG00022", pname: "30/56 SPL Commercial" },
  { pcode: "BG00023", pname: "30/54 Krinkle Sup Tyar" },
  { pcode: "BG00013", pname: "30/54 Krinkle Sup" },
  { pcode: "BG00018", pname: "30/54 Krinkle Sta" },
  { pcode: "EDD0005", pname: "Button Red Tube 60W" },
  { pcode: "EDD0006", pname: "LED Round Light" },
  { pcode: "BG00001", pname: "30/56 Krnkl Sup" },
  { pcode: "BG00003", pname: "30/56 SPL Sup" },
  { pcode: "BG00012", pname: "60/49 Sada Sup" },
  { pcode: "BG00006", pname: "30/56 SPL UNCUT SUP" },
  { pcode: "BG00009", pname: "30/56 Krnkl uncut sup" },
  { pcode: "BG00007", pname: "30/56 SPL UNCUT STA" },
  { pcode: "BG00002", pname: "30/56 Krnkl Sta" },
  { pcode: "PD00056", pname: "Double Picker Baksa" },
  { pcode: "CG00021", pname: "D-23004 Sta" },
  { pcode: "TD00001", pname: "Twsiter Goil No 2.5" },
  { pcode: "CG00035", pname: "40/30/57 Krnkl Uncut Extra Sta" },
  { pcode: "CG00009", pname: "D-24018 Shaal Sta" },
  { pcode: "CG00010", pname: "D-24011 Shaal Sta" },
  { pcode: "CG00022", pname: "Lal Ribbon Sup" },
  { pcode: "PD00058", pname: "YELLOW Pata" },
  { pcode: "CG00036", pname: "40/54.5 Chmk Krnkal Sup" },
  { pcode: "CG00037", pname: "40/54.5 Chmk Krnkal Uncut Sup" },
  { pcode: "BG00014", pname: "30/53 Paty Way" },
  { pcode: "BG00015", pname: "30/56 Paty Way" },
  { pcode: "BG00016", pname: "30/56 Paty Way Uncut" },
  { pcode: "Console", pname: "0/53 Paty Way Uncut" },
  { pcode: "CG00004", pname: "D-24018 Shaal Sup" },
  { pcode: "CG00005", pname: "D-24011 Shaal Sup" },
  { pcode: "CG00011", pname: "40/30/57 Knkl Sup" },
  { pcode: "CG00012", pname: "40/30/57 Knkl Sta" },
  { pcode: "BG00005", pname: "30/56 Krnkl Excl" },
  { pcode: "Ch00003", pname: "40/2 Staple" },
  { pcode: "BG00008", pname: "30/56 SPL EXTRA" },
  { pcode: "BG00010", pname: "30/56 krnkl uncut sta" },
  { pcode: "BG00011", pname: "30/56 krnkl uncut extra" },
  { pcode: "CG00014", pname: "40/49 Sada Uncut Sup" },
  { pcode: "CG00016", pname: "40/49 Sada Uncut Extra" },
  { pcode: "CG00015", pname: "40/49 Sada Uncut Sta" },
  { pcode: "CG00020", pname: "D-23004 Sup" },
  { pcode: "CG00023", pname: "Lai Ribbon Sta" },
  { pcode: "CG00024", pname: "777 Commercial Sup" },
  { pcode: "CG00025", pname: "777 Commercial Sta" },
  { pcode: "CG00026", pname: "777 Commercial Uncut Sup" },
  { pcode: "CG00027", pname: "777 Commercial Uncut Sta" },
  { pcode: "CG00028", pname: "40/30/57 Knkl Uncut Sup" },
  { pcode: "CG00029", pname: "40/30/57 Knkl Uncut Sta" },
  { pcode: "C5000055", pname: "clawes.jon" },
  { pcode: "C500040", pname: "M Bernber Sup" },
  { pcode: "C5000414", pname: "M Bernber Sta" },
  { pcode: "C500042", pname: "M Bernber Uncut Sup" },
  { pcode: "C500043", pname: "M Bernber Uncut Sta" },
  { pcode: "C500044", pname: "M Bernber Uncut Extra Sup" },
  { pcode: "C500045", pname: "M Bernber Uncut Extra Sta" },
  { pcode: "C500046", pname: "D-23020 Sup" },
  { pcode: "C500047", pname: "D-23020 Sta" },
  { pcode: "C500002", pname: "40/40/57 Krnkl Sup" },
  { pcode: "C500006", pname: "40/40/57 Krnkl Sta" },
  { pcode: "C500017", pname: "40/40/57 Krnkl Uncut Sup" },
  { pcode: "C500018", pname: "40/40/57 Krnkl Uncut Sta" },
  { pcode: "C500030", pname: "40/30/57 Krnkl Uncut Extra Sup" },
  { pcode: "C500003", pname: "40/40/54 Liming Sup" },
  { pcode: "C500008", pname: "40/40/54 Liming Sta" },
  { pcode: "C500031", pname: "40/40/54 Liming Uncut Sup" },
  { pcode: "C500032", pname: "40/40/54 Liming Uncut Sta" },
  { pcode: "C500033", pname: "40/40/54 Liming Uncut Extra" },
  { pcode: "C500048", pname: "1111111/City Shamoz Sup" },
  { pcode: "P000116", pname: "Paritya" },
  { pcode: "P000117", pname: "Sapendal braketi" },
  { pcode: "PDD0121", pname: "2 3*4 Pull" },
  { pcode: "PDD0152", pname: "3 Inch Pull" },
  { pcode: "PDD0153", pname: "3 1*4 inch pull" },
  { pcode: "PDD0154", pname: "3 1*2 inch pull" },
  { pcode: "PDD0155", pname: "Tikka liver" },
  { pcode: "CG00049", pname: "111111/Qily Shamoz Sup Uncut" },
  { pcode: "CG00050", pname: "1111/Qily Shamoz Sup" },
  { pcode: "CG00051", pname: "1111/Qily Shamoz Sup Uncut" },
  { pcode: "Ch00001", pname: "40/24 L.G W.M A-Grade" },
  { pcode: "Ch00004", pname: "30/24 Chmk L_Gilo" },
  { pcode: "Ch00002", pname: "60/s Cotton ltehad" },
  { pcode: "Ch00007", pname: "52/s Sub Koll" },
  { pcode: "Ch00005", pname: "60/s Cotton Koh-e-Noor" },
  { pcode: "CG00056", pname: "52/Sub Sta" },
  { pcode: "CG00019", pname: "40/40/57 Krnkl Uncut Extra Sup" },
  { pcode: "CG00034", pname: "40/40/57 Krnkl Uncut Extra Sta" }
];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ───────────────────────────
     2️⃣  Fetch forecast
  ─────────────────────────── */
  const fetchForecast = async () => {
    if (!selectedProduct) {
      Alert.alert('Select a product first');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://5461283ce09c.ngrok-free.app/myapp/forecast.php?pcode=${selectedProduct.pcode}`,
      );
      const json = await res.json();
      if (Array.isArray(json)) setForecastData(json);
      else Alert.alert('Error', 'Invalid response from server');
    } catch (e) {
      Alert.alert('Network Error', 'Unable to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────────
     3️⃣  Renderers
  ─────────────────────────── */
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedProduct(item);
        setShowDropdown(false);
        setForecastData([]);        // clear old forecast
      }}
    >
      <Text style={styles.dropdownText}>
        {item.pname} ({item.pcode})
      </Text>
    </TouchableOpacity>
  );

  const renderForecastItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.month}>📅 {item.month}</Text>
      <Text style={styles.qty}>🔮 {item.forecast_qty.toLocaleString()} </Text>
    </View>
  );

  /* ───────────────────────────
     4️⃣  JSX
  ─────────────────────────── */
  return (
    <SafeAreaView style={styles.container}>
      {/* ── product selector ── */}
      <Text style={styles.heading}>📦 Select Product</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedProduct
            ? `${selectedProduct.pname} (${selectedProduct.pcode})`
            : 'Tap to choose…'}
        </Text>
      </TouchableOpacity>

      {/* ── dropdown modal ── */}
      <Modal visible={showDropdown} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.dropdown}>
            <FlatList
              data={products}
              keyExtractor={(it) => it.pcode}
              renderItem={renderProductItem}
            />
            <TouchableOpacity
              onPress={() => setShowDropdown(false)}
              style={styles.closeDropdown}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, color: '#0a84ff' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── fetch button ── */}
      <TouchableOpacity style={styles.button} onPress={fetchForecast}>
        <Text style={styles.buttonText}>📊 Show Forecast</Text>
      </TouchableOpacity>

      {/* ── loading ── */}
      {loading && (
        <ActivityIndicator size="large" color="#0a84ff" style={{ marginTop: 20 }} />
      )}

      {/* ── forecast list ── */}
      {forecastData.length > 0 && (
        <>
          <Text style={styles.heading}>
            📈 Forecast for: {selectedProduct?.pname}
          </Text>
          <FlatList
            data={forecastData}
            keyExtractor={(item, i) => `${item.month}_${i}`}
            renderItem={renderForecastItem}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default ForecastScreen;

/* ───────────────────────────
   5️⃣  Styles
─────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1e1e1e' },

  /* dropdown button */
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  dropdownButtonText: { fontSize: 16, color: '#333' },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  dropdown: { backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '60%' },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: { fontSize: 16, color: '#333' },
  closeDropdown: { padding: 12 },

  /* forecast card */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  month: { fontSize: 16, color: '#333' },
  qty: { fontSize: 18, fontWeight: '600', color: '#0a84ff', marginTop: 8 },

  list: { paddingBottom: 20 },

  /* button */
  button: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
