import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompany } from "./CompanyContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const Stockposition = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { companyCode } = useCompany();

    // Function to format date as DD/MM/YYYY
    const formatDate = (date) => format(date, 'dd/MM/yyyy');

    // Handle Date Selection
    const onDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) setSelectedDate(selected);
    };

    const openReport = () => {
        if (!companyCode || !selectedDate) {
            console.error('Company code or date is missing!');
            return;
        }

        const pdfUrl = `https://5461283ce09c.ngrok-free.app/myapp/rptstockp.php?com_code=${companyCode}&date=${formatDate(selectedDate)}`;
        Linking.openURL(pdfUrl).catch((err) => console.error('Error opening PDF:', err));
    };

    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient colors={['#6200ee', '#3700b3']} style={styles.gradient}>
                <Text style={styles.heading}>Stock Position</Text>
            </LinearGradient>

            {/* Date Selection */}
            <View style={styles.dateSelectionContainer}>
                <Text style={styles.label}>Select Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>{selectedDate ? formatDate(selectedDate) : 'Select Date'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
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

export default Stockposition;