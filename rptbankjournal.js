import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompany } from "./CompanyContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const BankJournal = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const { companyCode } = useCompany(); 

    // Function to format date as DD/MM/YYYY
    const formatDate = (date) => format(date, 'dd/MM/yyyy');

    // Handle From Date Selection
    const onFromDateChange = (event, selectedDate) => {
        setShowFromPicker(false);
        if (selectedDate) setFromDate(selectedDate);
    };

    // Handle To Date Selection
    const onToDateChange = (event, selectedDate) => {
        setShowToPicker(false);
        if (selectedDate) setToDate(selectedDate);
    };

    const openReport = () => {
        if (!companyCode || !fromDate || !toDate) {
            console.error('Company code or date range is missing!');
            return;
        }

        const pdfUrl = `https://5461283ce09c.ngrok-free.app/myapp/rptbankju.php?com_code=${companyCode}&from_date=${formatDate(fromDate)}&to_date=${formatDate(toDate)}`;
        Linking.openURL(pdfUrl).catch((err) => console.error('Error opening PDF:', err));
    };

    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient colors={['#6200ee', '#3700b3']} style={styles.gradient}>
                <Text style={styles.heading}>Bank Journal Report</Text>
            </LinearGradient>

            {/* Date Selection Form */}
            <View style={styles.dateSelectionContainer}>
                <Text style={styles.label}>From Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromPicker(true)}>
                    <Text style={styles.dateText}>{fromDate ? formatDate(fromDate) : 'Select Date'}</Text>
                </TouchableOpacity>
                {showFromPicker && (
                    <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onFromDateChange}
                    />
                )}

                <Text style={styles.label}>To Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowToPicker(true)}>
                    <Text style={styles.dateText}>{toDate ? formatDate(toDate) : 'Select Date'}</Text>
                </TouchableOpacity>
                {showToPicker && (
                    <DateTimePicker
                        value={toDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onToDateChange}
                    />
                )}

                {/* Show Button */}
                <TouchableOpacity style={styles.showButton} onPress={openReport}>
                    <Text style={styles.showButtonText}>Show</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', paddingTop: 20 },
    gradient: { paddingVertical: 20, paddingHorizontal: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15, marginBottom: 20, backgroundColor: '#34495E' },
    heading: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    dateSelectionContainer: { marginHorizontal: 20, marginBottom: 20 },
    dateInput: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10, fontSize: 16 },
    dateText: { fontSize: 16, color: '#333' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    showButton: { backgroundColor: '#34495E', padding: 10, marginTop: 15, borderRadius: 5, alignItems: 'center' },
    showButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default BankJournal;
