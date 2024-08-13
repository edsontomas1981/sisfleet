import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const avatar = require('../assets/images/avatar.jpg');

const screenWidth = Dimensions.get('window').width;

const dataPieChart = [
  {
    name: 'Frete',
    population: 999000.00,
    color: 'blue',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Despesas',
    population: 280000.00,
    color: 'red',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
];

const formattedDataPieChart = dataPieChart.map(item => ({
  ...item,
  population: item.population, // Mantenha o valor numérico para o gráfico
}))

const dataLineChart = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Receitas
      strokeWidth: 2,
    },
    {
      data: [-10, -20, -30, -40, -50, -60],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Despesas
      strokeWidth: 2,
    },
  ],
};

export default function HomeScreen() {
  return (
    <ScrollView>
    <View style={styles.container}>
      {/* Card com Informações do Caminhão */}
      <View style={styles.truckInfoCard}>
        <Image source={avatar} style={styles.truckImage} />
        <View style={styles.truckInfo}>
          <Text style={styles.truckPlate}>AAA-1A11</Text>
          <Text style={styles.truckModel}>VOLVO FH-12</Text>
        </View>
      </View>

      {/* Card com Informações da Viagem */}
      <View style={styles.tripCard}>
        <Text style={styles.tripText}>VIAGEM Nº13541</Text>
        <Text style={styles.tripDestination}>São Paulo X Niteroi</Text>
        <PieChart
        data={formattedDataPieChart}
        width={320}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2,
          barPercentage: 0.5,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
      </View>

      {/* Card com Gráfico de Receitas X Despesas */}
      <View style={styles.expenseCard}>
        <Text style={styles.expenseText}>AAA-1A11</Text>
        <Text style={styles.expenseSubtext}>Receitas X Despesas</Text>
        <LineChart
          data={dataLineChart}
          width={screenWidth - 80}
          height={180}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    </View>
    </ScrollView>

  );
}

const chartConfig = {
  backgroundGradientFrom: '#FFF',
  backgroundGradientTo: '#FFF',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop:20,
    padding: 20,
  },
  truckInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#384C58',
    padding: 5,
    borderRadius: 9999,
    marginBottom: 20,
  },
  truckImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  truckInfo: {
    marginLeft: 10,
  },
  truckPlate: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  truckModel: {
    color: '#FFF',
  },
  tripCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  tripText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tripDestination: {
    color: '#999',
    marginBottom: 20,
  },
  expenseCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  expenseText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  expenseSubtext: {
    color: '#999',
    marginBottom: 20,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E3B55',
    paddingVertical: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
  navItem: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
