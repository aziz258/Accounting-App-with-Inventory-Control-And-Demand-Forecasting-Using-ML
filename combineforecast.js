import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

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

];

const ForecastGraphScreen = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForecasts = async () => {
    const result = [];
    for (const product of products) {
      try {
        const res = await fetch(
          `https://5461283ce09c.ngrok-free.app/myapp/forecast.php?pcode=${product.pcode}`
        );
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          result.push({
            pcode: product.pcode,
            pname: product.pname,
            data: json,
            forecast_qty: json[0]?.forecast_qty || 0, // next month's quantity
            month: json[0]?.month || '',
          });
        }
      } catch (err) {
        console.warn(`Error for ${product.pcode}: ${err.message}`);
      }
    }

    // Sort and take top 10 by forecast quantity for next month
    const top10 = result
      .sort((a, b) => b.forecast_qty - a.forecast_qty)
      .slice(0, 10);

    setForecastData(top10);
    setLoading(false);
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  const getRandomColor = () =>
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

  const renderCombinedChartHTML = () => {
    if (forecastData.length === 0) return '';

    const labels = ['']; // Single month label

    const datasets = forecastData.map((product) => {
      const color = getRandomColor();
      return {
        label: `${product.pname} (${product.pcode})`,
        data: [product.forecast_qty],
        backgroundColor: color + 'AA',
      };
    });

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
              type: 'bar',
              data: {
                labels: ${JSON.stringify(labels)},
                datasets: ${JSON.stringify(datasets)}
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      boxWidth: 10,
                      font: { size: 8 }
                    }
                  }
                },
                scales: {
                  y: { beginAtZero: true },
                  x: {
                    ticks: { maxRotation: 90, minRotation: 45 }
                  }
                }
              }
            });
          </script>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📊 High Demand Products - Next Month's Forecast</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <View style={styles.chartContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: renderCombinedChartHTML() }}
            style={styles.webview}
            javaScriptEnabled={true}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 10 },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 30,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  webview: {
    height: 600,
    width: screenWidth - 20,
    alignSelf: 'center',
  },
});

export default ForecastGraphScreen;
