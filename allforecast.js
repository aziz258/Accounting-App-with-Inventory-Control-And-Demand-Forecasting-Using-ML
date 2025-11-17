import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

// Only include the products you need
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
  
];


const ForecastGraphScreen = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllForecasts = async () => {
    const results = [];

    for (const product of products) {
      try {
        const res = await fetch(
          `https://5461283ce09c.ngrok-free.app/myapp/forecast.php?pcode=${product.pcode}`
        );
        const json = await res.json();

        if (Array.isArray(json)) {
          results.push({
            pcode: product.pcode,
            pname: product.pname,
            data: json,
          });
        } else {
          console.warn(`Invalid forecast for ${product.pcode}`);
        }
      } catch (err) {
        console.warn(`Error for ${product.pcode}: ${err.message}`);
      }
    }

    setForecasts(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllForecasts();
  }, []);

  const renderChartHTML = (data) => {
    const labels = data.data.map((d) => d.month);
    const values = data.data.map((d) => d.forecast_qty);
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <canvas id="chart"></canvas>
          <script>
            new Chart(document.getElementById('chart').getContext('2d'), {
              type: 'line',
              data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                  label: '${data.pname} (${data.pcode})',
                  data: ${JSON.stringify(values)},
                  borderColor: 'blue',
                  backgroundColor: 'rgba(0,0,255,0.1)',
                  fill: true,
                  tension: 0.3
                }]
              },
              options: {
                responsive: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
              }
            });
          </script>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📊 Forecasts for Selected Products</Text>
      {loading && <ActivityIndicator size="large" color="#007aff" />}
      {!loading &&
        forecasts.map((item, index) => (
          <View key={index} style={styles.chartContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: renderChartHTML(item) }}
              style={styles.webview}
              javaScriptEnabled={true}
            />
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 10 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  chartContainer: {
    marginBottom: 30,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  webview: { height: 300, width: screenWidth - 20, alignSelf: 'center' },
});

export default ForecastGraphScreen;
