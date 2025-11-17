import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompany } from "./CompanyContext";

const Payment = () => {
    const [invoiceNo, setInvoiceNo] = useState('');
    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState('');

    const { companyCode } = useCompany(); // Access companyCode globally

    const openReport = () => {
        if (!companyCode || !invoiceNo) {
            console.error('Company code or invoice number is missing!');
            return;
        }

        const pdfUrl = `https://5461283ce09c.ngrok-free.app/myapp/rptpayment.php?com_code=${companyCode}&invcno=${invoiceNo}`;
        Linking.openURL(pdfUrl).catch((err) => console.error('Error opening PDF:', err));
    };

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('https://5461283ce09c.ngrok-free.app/myapp/getpayment.php');
                const data = await response.json();
                console.log("Fetched Data:", data); // Debugging: Check API response

                if (!Array.isArray(data)) {
                    setError('Invalid data format received');
                    return;
                }

                setInvoices(data);
            } catch (error) {
                setError('Error fetching invoices');
                console.error(error);
            }
        };

        fetchInvoices();
    }, []);

    const renderInvoiceItem = ({ item }) => {
        if (!item || !item.pvno) return null; // Skip if data is incorrect

        return (
            <TouchableOpacity 
                onPress={() => { setInvoiceNo(item.pvno); setIsInvoiceModalVisible(false); }} 
                style={styles.invoiceItem}
            >
                <Text style={styles.invoiceItemText}>{item.pvno}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient colors={['#6200ee', '#3700b3']} style={styles.gradient}>
                <Text style={styles.heading}>Payment Voucher</Text>
            </LinearGradient>

            {/* Invoice Selection Form (Moved to Top) */}
            <View style={styles.invoiceSelectionContainer}>
                <Text style={styles.label}>Voucher No</Text>
                <TouchableOpacity onPress={() => setIsInvoiceModalVisible(true)} style={styles.invoiceInput}>
                    <Text style={styles.invoiceInputText}>{invoiceNo || 'Select Invoice No'}</Text>
                </TouchableOpacity>

                {/* Show Button */}
                <TouchableOpacity style={styles.showButton} onPress={openReport}>
                    <Text style={styles.showButtonText}>Show</Text>
                </TouchableOpacity>
            </View>

            {/* Invoice Selection Modal */}
            <Modal
                visible={isInvoiceModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsInvoiceModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        <FlatList
                            data={invoices}
                            renderItem={renderInvoiceItem}
                            keyExtractor={(item, index) => item?.invc?.toString() || index.toString()}
                        />
                    </View>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsInvoiceModalVisible(false)}>
                        <Text style={styles.modalCloseText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', paddingTop: 20 },
    gradient: { paddingVertical: 20, paddingHorizontal: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15, marginBottom: 20, backgroundColor: '#34495E' },
    heading: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    invoiceSelectionContainer: { marginHorizontal: 20, marginBottom: 20 },
    invoiceInput: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10, justifyContent: 'center' },
    invoiceInputText: { fontSize: 16, color: '#333' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    showButton: { backgroundColor: '#34495E', padding: 10, marginTop: 15, borderRadius: 5, alignItems: 'center' },
    showButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
    error: { color: 'red', fontSize: 14, marginBottom: 15, textAlign: 'center' },
    modalCloseButton: { padding: 10, backgroundColor: '#34495E', marginTop: 10, borderRadius: 5, alignItems: 'center' },
    modalCloseText: { color: 'white', fontSize: 16 },
    invoiceItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    invoiceItemText: { fontSize: 16, color: '#333' },
});

export default Payment;
