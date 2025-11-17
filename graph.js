import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCompany } from "./CompanyContext";
import { useFocusEffect } from '@react-navigation/native';

const ChartWebView = ({ labels, data }) => {
  const chartHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <canvas id="myChart" style="width:100%;height:300px;"></canvas>
    <script>
      const ctx = document.getElementById('myChart').getContext('2d');
      const labels = ${JSON.stringify(labels)};
      const data = ${JSON.stringify(data)};
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Balance',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    </script>
  </body>
  </html>
  `;

  return (
    <View style={{ flex: 1, height: 300 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: chartHtml }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const ChartScreen = () => {
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const { companyCode } = useCompany(); // Ensure companyCode is provided by CompanyContext

  useFocusEffect(
  useCallback(() => {
    const fetchData = async () => {
      setLoading(true);

      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = today.getFullYear();
      const formattedDate = `${day}/${month}/${year}`; // DD/MM/YYYY

      try {
        const url = `https://5461283ce09c.ngrok-free.app/myapp/graph.php?com_code=${companyCode}&date=${formattedDate}`;
        const response = await fetch(url);
        const json = await response.json();

        if (json.error) {
          console.error('API Error:', json.error);
          setLabels([]);
          setData([]);
        } else {
          setLabels(json.map(item => item.pname));
          setData(json.map(item => parseFloat(item.balance)));
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyCode])
);


  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  return <ChartWebView labels={labels} data={data} />;
};

export default ChartScreen;
