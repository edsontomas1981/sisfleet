import React from 'react';
import { View, SafeAreaView, StyleSheet, TextInput, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';

// Importe a imagem
const logo = require('../assets/images/logo.png');

export default function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={logo} style={styles.logo} />

        <TextInput
          style={styles.input}
          placeholder="Placa"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
        />

        <Button
          icon="login"
          mode="contained"
          onPress={() => navigation.navigate('Home')} // Correto: Nome da tela no StackNavigator
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Entrar
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 9999,
    backgroundColor: '#384C58', // Cor de fundo do botão
    width: '100%',
  },
  buttonLabel: {
    fontSize: 18,
    color: '#ffffff', // Cor do texto do botão
  },
  input: {
    height: 40,
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 9999,
    borderColor: '#D9D9D9',
    width: '100%',
    color: '#B3B3B3',
  },
  innerContainer: {
    width: '100%', // Garantindo que o View interno ocupe 100% da largura da tela
    paddingHorizontal: 16, // Adicionando um padding para evitar que o conteúdo encoste nas bordas
    alignItems: 'center', // Centraliza o conteúdo horizontalmente

  },
});
