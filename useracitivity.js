import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const UserActivityReport = ({ route }) => {
  const { uname, from, to } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://5461283ce09c.ngrok-free.app/myapp/useractitvity.php?uname=${uname}&from=${from}&to=${to}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching activity:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity Log of {uname}</Text>
      <Text style={styles.subheader}>From {from} to {to}</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.module}>📘 {item.module}</Text>
            <Text style={styles.description}>📝 {item.description}</Text>
            <Text style={styles.date}>📅 {item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No entries found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  subheader: { fontSize: 14, color: 'gray', marginBottom: 15 },
  card: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9'
  },
  module: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  description: { fontSize: 14, marginBottom: 4 },
  date: { fontSize: 12, color: 'gray' }
});

export default UserActivityReport;
