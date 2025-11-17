import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { useCompany } from "./CompanyContext";

const Reports = ({ navigation }) => {
  const { companyCode } = useCompany(); // Access companyCode globally

  const openReport = () => {
    if (!companyCode) {
      console.error('Company code is missing!');
      return;
    }

    const pdfUrl = `https://5461283ce09c.ngrok-free.app/myapp/rptchart.php?com_code=${companyCode}`;
    Linking.openURL(pdfUrl).catch((err) => console.error('Error opening PDF:', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Reports</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.button} onPress={openReport} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Chart Of Accounts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('saleinvoice')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Sale's Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('purchaseinvoice')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Purchase Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('cashbook')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Cash Book</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Trial')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Trial Balance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('salejournal')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Sale Journal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('purchasejournal')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Purchase Journal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('openingjournal')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Opening Journal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ledger')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Ledger Statement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('custledger')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Customer Ledger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('supplierledger')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Supplier Ledger</Text>
        
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HeadWise')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Head Wise Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('receipt')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Receipt Voucher</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('payment')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Payment Voucher</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('journal')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Journal</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('bankjournal')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Bank Journal</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('stock')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Stock Position</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('deptstock')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Dept Stock Position</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('productsale')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Product Wise Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('productpurchase')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Product Wise Purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Product Ledger')} activeOpacity={0.7}>
          <Icon name="file-document" size={28} color="white" />
          <Text style={styles.buttonText}>Product Ledger</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <Ionicons name="notifications-outline" size={28} color="white" />
        <TouchableOpacity onPress={() => navigation.navigate("LogOut")}>
          <Ionicons name="settings-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    width: '100%',
    backgroundColor: '#34495E',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  heading: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 2,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Extra padding to prevent overlap with footer
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    paddingVertical: 18,
    borderRadius: 15,
    marginVertical: 15,
    justifyContent: 'center',
    shadowColor: '#34495e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 15,
    letterSpacing: 1.2,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#34495E',
    paddingVertical: 12,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default Reports;
