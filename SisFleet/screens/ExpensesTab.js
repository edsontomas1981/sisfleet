import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function ExpensesTab() {
  const [fornecedor, setFornecedor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [dataList, setDataList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editFornecedor, setEditFornecedor] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editValor, setEditValor] = useState('');
  const [editData, setEditData] = useState('');
  const [comprovanteUri, setComprovanteUri] = useState(null);
  const [isComprovanteModalVisible, setIsComprovanteModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const generateRandomAlphanumeric = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }

    return result;
  };

  const handleIncluir = async () => {
    if (!fornecedor || !categoria || !valor || !data) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    const expense = {
      id: generateRandomAlphanumeric(10),
      fornecedor,
      categoria,
      valor,
      data,
      comprovanteUri,
    };

    try {
      const storedData = await AsyncStorage.getItem('expense_data');
      const existingData = storedData ? JSON.parse(storedData) : [];

      const duplicate = existingData.some(item => item.comprovanteUri === comprovanteUri);
      if (duplicate) {
        Alert.alert('Erro', 'Este comprovante já foi anexado anteriormente.');
        return;
      }

      const newDataList = [...existingData, expense];
      await AsyncStorage.setItem('expense_data', JSON.stringify(newDataList));
      setDataList(newDataList);

      setFornecedor('');
      setCategoria('');
      setValor('');
      setData('');
      setComprovanteUri(null);
    } catch (error) {
      console.log('Erro ao armazenar os dados:', error);
    }
  };


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date to yyyy-mm-dd
      setData(formattedDate);
    }
  };
  
  const handleCloseComprovanteModal = () => {
    setIsComprovanteModalVisible(false);
    setComprovanteUri(null);
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a câmera.');
      return;
    }
  
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!pickerResult.canceled) {
      setComprovanteUri(pickerResult.assets[0].uri);
    }
  };

  const handleComprovante = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a galeria.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setComprovanteUri(pickerResult.assets[0].uri);
    }
  };

  const handleMoreOptions = (item) => {
    Alert.alert(
      'Opções',
      'Escolha uma ação',
      [
        {
          text: 'Ver Comprovante',
          onPress: () => {
            if (item.comprovanteUri) {
              setComprovanteUri(item.comprovanteUri);
              setIsComprovanteModalVisible(true);
            } else {
              Alert.alert('Aviso', 'Nenhum comprovante foi anexado.');
            }
          },
        },
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

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditFornecedor(item.fornecedor);
    setEditCategoria(item.categoria);
    setEditValor(item.valor);
    setEditData(item.data);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const storedData = await AsyncStorage.getItem('expense_data');
      const existingData = storedData ? JSON.parse(storedData) : [];
      const updatedDataList = existingData.map(item =>
        item.id === selectedItem.id
          ? { ...item, fornecedor: editFornecedor, categoria: editCategoria, valor: editValor, data: editData }
          : item
      );
      await AsyncStorage.setItem('expense_data', JSON.stringify(updatedDataList));
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
              const storedData = await AsyncStorage.getItem('expense_data');
              const existingData = storedData ? JSON.parse(storedData) : [];
              const updatedDataList = existingData.filter(data => data.id !== item.id);
              await AsyncStorage.setItem('expense_data', JSON.stringify(updatedDataList));
              setDataList(updatedDataList);
            } catch (error) {
              console.log('Erro ao excluir os dados:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.fornecedor}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.categoria}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.valor}</Text>
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
        const storedData = await AsyncStorage.getItem('expense_data');
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
          <Text style={styles.label}>Fornecedor</Text>
          <TextInput
            style={styles.input}
            value={fornecedor}
            onChangeText={setFornecedor}
            placeholder="Nome do fornecedor"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Categoria da despesa"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            placeholder="Valor da despesa"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{data || 'Selecione uma data'}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode='date'
            display='default'
            onChange={handleDateChange}
          />
        )}

      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonIncluir} onPress={handleIncluir}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.buttonText}>Incluir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCamera} onPress={handleCamera}>
          <MaterialIcons name="photo-camera" size={24} color="white" />
          <Text style={styles.buttonText}>Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonGaleria} onPress={handleComprovante}>
          <MaterialIcons name="photo-library" size={24} color="white" />
          <Text style={styles.buttonText}>Galeria</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Nenhum dado disponível</Text>}
      />
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Fornecedor</Text>
          <TextInput
            style={styles.input}
            value={editFornecedor}
            onChangeText={setEditFornecedor}
          />
          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            value={editCategoria}
            onChangeText={setEditCategoria}
          />
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={editValor}
            onChangeText={setEditValor}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            value={editData}
            onChangeText={setEditData}
            placeholder="dd/mm/aaaa"
          />
          <Button title="Salvar" onPress={handleSaveEdit} />
          <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
      <Modal visible={isComprovanteModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Image source={{ uri: comprovanteUri }} style={{ width: '100%', height: '80%' }} />
          <Button title="Fechar" onPress={handleCloseComprovanteModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  inputContainerElementosMeio: {
    flex: 1,
    marginLeft: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttonIncluir: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonCamera: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonGaleria: {
    flex: 1,
    backgroundColor: '#FFC107',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  moreIconCell: {
    alignItems: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});
