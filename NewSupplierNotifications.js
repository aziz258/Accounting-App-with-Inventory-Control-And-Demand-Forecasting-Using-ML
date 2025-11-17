import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewSupplierNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://5461283ce09c.ngrok-free.app/myapp/suppliernotifi.php')
      .then(res => res.json())
      .then(data => {
        // Sort unread first
        const sorted = [...data].sort((a, b) => {
          if (a.is_read === b.is_read) return 0;
          return a.is_read === '0' ? -1 : 1;
        });
        setNotifications(sorted);
        markAsRead();
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = () => {
    fetch('https://5461283ce09c.ngrok-free.app/myapp/marksupplier.php');
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.is_read === '0' && styles.newCard,
      ]}
    >
      <Ionicons
        name={item.type === 'supplier' ? 'person-add-outline' : 'people-outline'}
        size={24}
        color="#2c3e50"
        style={styles.icon}
      />
      <Text style={styles.message}>
        <Text style={styles.bold}>{item.type === 'supplier' ? 'Supplier' : 'Customer'} </Text>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.bold}> – {item.name} </Text>
        has been registered.
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.heading}>New Supplier & Customer Notifications</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false} // FlatList is inside ScrollView, so disable its internal scroll
          />
        )}
      </View>
    </ScrollView>
  );
};

export default NewSupplierNotifications;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  newCard: {
    backgroundColor: '#fef9e7',
    borderColor: '#f1c40f',
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    fontSize: 16,
    color: '#34495e',
    flex: 1,
    flexWrap: 'wrap',
  },
  bold: {
    fontWeight: 'bold',
  },
  code: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
});
