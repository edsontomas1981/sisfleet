import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { nanoid } from 'nanoid';

export default function IncomeTab() {
  const [cliente, setCliente] = useState('');
  const [destino, setDestino] = useState('');
  const [frete, setFrete] = useState('');
  const [adiantamento, setAdiantamento] = useState('');
  const [peso, setPeso] = useState('');
  const [dataList, setDataList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editCliente, setEditCliente] = useState('');
  const [editDestino, setEditDestino] = useState('');
  const [editFrete, setEditFrete] = useState('');
  const [editAdiantamento, setEditAdiantamento] = useState('');
  const [editPeso, setEditPeso] = useState('');

  /**
   * Gera uma string alfanumérica aleatória.
   *
   * @param {number} length - O comprimento da string gerada.
   * @returns {string} - A string alfanumérica aleatória.
   */
  const generateRandomAlphanumeric = (length) => {
    // Conjunto de caracteres alfanuméricos permitidos
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    // Gera a string aleatória
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }

    return result;
  };

  const handleIncluir = async () => {
    // Verifica se todos os campos estão preenchidos
    if (!cliente || !destino || !frete || !adiantamento || !peso) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return; // Retorna para interromper a execução se os campos não estiverem preenchidos
    }

    const data = {
      id:generateRandomAlphanumeric(10), // Gera um ID único
      cliente,
      destino,
      frete,
      adiantamento,
      peso,
    };

    console.log(data)

    try {
      const storedData = await AsyncStorage.getItem('transport_data');
      const existingData = storedData ? JSON.parse(storedData) : [];
      console.log('Dados existentes:', existingData); // Log para verificar os dados existentes
      const newDataList = [...existingData, data];
      console.log('Novo registro:', data); // Log para verificar o novo registro
      await AsyncStorage.setItem('transport_data', JSON.stringify(newDataList));
      setDataList(newDataList);
      setCliente('');
      setDestino('');
      setFrete('');
      setAdiantamento('');
      setPeso('');
    } catch (error) {
      console.log('Erro ao armazenar os dados:', error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditCliente(item.cliente);
    setEditDestino(item.destino);
    setEditFrete(item.frete);
    setEditAdiantamento(item.adiantamento);
    setEditPeso(item.peso);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const storedData = await AsyncStorage.getItem('transport_data');
      const existingData = storedData ? JSON.parse(storedData) : [];
      const updatedDataList = existingData.map(item =>
        item.id === selectedItem.id
          ? { ...item, cliente: editCliente, destino: editDestino, frete: editFrete, adiantamento: editAdiantamento, peso: editPeso }
          : item
      );
      await AsyncStorage.setItem('transport_data', JSON.stringify(updatedDataList));
      setDataList(updatedDataList);
      setIsModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      console.log('Erro ao atualizar os dados:', error);
    }
  };

  const handleDelete = async (item) => {
    Alert.alert(
      'Excluir Item',
      'Tem certeza de que deseja excluir este item?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const storedData = await AsyncStorage.getItem('transport_data');
              const existingData = storedData ? JSON.parse(storedData) : [];
              const updatedDataList = existingData.filter(data => data.id !== item.id); // Filtra por ID
              await AsyncStorage.setItem('transport_data', JSON.stringify(updatedDataList));
              setDataList(updatedDataList);
            } catch (error) {
              console.log('Erro ao excluir os dados:', error);
            }
          },
        },
      ]
    );
  };

  const handleMoreOptions = (item) => {
    Alert.alert(
      'Opções',
      'Escolha uma ação',
      [
        {
          text: 'Editar',
          onPress: () => handleEdit(item),
        },
        {
          text: 'Excluir',
          onPress: () => handleDelete(item),
          style: 'destructive',
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.cliente}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.destino}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.frete}</Text>
      </View>
      <View style={[styles.tableCell, styles.moreIconCell]}>
        <TouchableOpacity onPress={() => handleMoreOptions(item)}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('transport_data');
        const existingData = storedData ? JSON.parse(storedData) : [];
        setDataList(existingData);
      } catch (error) {
        console.log('Erro ao carregar os dados:', error);
      }
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cliente</Text>
          <TextInput
            style={styles.input}
            value={cliente}
            onChangeText={setCliente}
            placeholder="Nome do cliente"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Destino</Text>
          <TextInput
            style={styles.input}
            value={destino}
            onChangeText={setDestino}
            placeholder="Destino"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Frete</Text>
          <TextInput
            style={styles.input}
            value={frete}
            onChangeText={setFrete}
            placeholder="Valor do frete"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adiantamento</Text>
          <TextInput
            style={styles.input}
            value={adiantamento}
            onChangeText={setAdiantamento}
            placeholder="Valor do adiantamento"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder="Peso"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.incluirButton} onPress={handleIncluir}>
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.incluirButtonText}>Incluir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.comprovanteButton}>
          <MaterialIcons name="image" size={20} color="white" />
          <Text style={styles.comprovanteButtonText}>Comprovante</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText} numberOfLines={1}>Cliente</Text>
          <Text style={styles.tableHeaderText} numberOfLines={1}>Destino</Text>
          <Text style={styles.tableHeaderText} numberOfLines={1}>Frete</Text>
          <Text style={styles.tableHeaderText} numberOfLines={1}>Ações</Text>
        </View>
        <FlatList
          data={dataList}
          renderItem={renderItem}
          keyExtractor={item => item.id} // Adiciona keyExtractor
        />
      </View>

      <Modal
        transparent
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Item</Text>
            <TextInput
              style={styles.modalInput}
              value={editCliente}
              onChangeText={setEditCliente}
              placeholder="Cliente"
            />
            <TextInput
              style={styles.modalInput}
              value={editDestino}
              onChangeText={setEditDestino}
              placeholder="Destino"
            />
            <TextInput
              style={styles.modalInput}
              value={editFrete}
              onChangeText={setEditFrete}
              placeholder="Frete"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={editAdiantamento}
              onChangeText={setEditAdiantamento}
              placeholder="Adiantamento"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={editPeso}
              onChangeText={setEditPeso}
              placeholder="Peso"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <Button title="Salvar" onPress={handleSaveEdit} />
              <Button title="Cancelar" onPress={() => setIsModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
  },
  incluirButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  incluirButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  comprovanteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  comprovanteButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
  },
  moreIconCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
