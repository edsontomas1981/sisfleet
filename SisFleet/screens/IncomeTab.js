import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

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
  const [comprovanteUri, setComprovanteUri] = useState(null);
  const [isComprovanteModalVisible, setIsComprovanteModalVisible] = useState(false);

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
    if (!cliente || !destino || !frete || !adiantamento || !peso) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    const data = {
      id: generateRandomAlphanumeric(10),
      cliente,
      destino,
      frete,
      adiantamento,
      peso,
      comprovanteUri, // Armazena o URI do comprovante
    };

    try {
      const storedData = await AsyncStorage.getItem('transport_data');
      const existingData = storedData ? JSON.parse(storedData) : [];

      // Verifica se o comprovante já existe
      const duplicate = existingData.some(item => item.comprovanteUri === comprovanteUri);
      console.log(comprovanteUri)
      if (duplicate) {
        Alert.alert('Erro', 'Este comprovante já foi anexado anteriormente.');
        return;
      }

      const newDataList = [...existingData, data];
      await AsyncStorage.setItem('transport_data', JSON.stringify(newDataList));
      setDataList(newDataList);

      // Limpa os campos após a inclusão
      setCliente('');
      setDestino('');
      setFrete('');
      setAdiantamento('');
      setPeso('');
      setComprovanteUri(null); // Limpa o URI do comprovante
      comprovanteUri = null
    } catch (error) {
      console.log('Erro ao armazenar os dados:', error);
    }
  };

  const handleCloseComprovanteModal = () => {
    setIsComprovanteModalVisible(false);
    setComprovanteUri(null); // Limpa o URI do comprovante após fechar o modal
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
              setComprovanteUri(item.comprovanteUri); // Define o URI do comprovante selecionado
              setIsComprovanteModalVisible(true); // Abre o modal para exibir o comprovante
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
              const updatedDataList = existingData.filter(data => data.id !== item.id);
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
            placeholder="Adiantamento"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder="Peso da carga"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.row}>

          <TouchableOpacity style={styles.incluirButton} onPress={handleIncluir}>
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.incluirButtonText}>Incluir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.comprovanteButton} onPress={handleComprovante}>
            <MaterialIcons name="photo" size={20} color="#fff" />
            <Text style={styles.comprovanteButtonText}>Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton} onPress={handleCamera}>
            <MaterialIcons name="camera-alt" size={20} color="#fff" />
            <Text style={styles.cameraButtonText}>Câmera</Text>
          </TouchableOpacity>

        </View>
      </View>

      {comprovanteUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Pré-visualização do Comprovante:</Text>
          <Image source={{ uri: comprovanteUri }} style={styles.comprovantePreviewLarge} />
          <Button title="Remover Pré-visualização" onPress={() => setComprovanteUri(null)} />
        </View>
      )}

      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Informações</Text>
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
          <Button title="Salvar" onPress={handleSaveEdit} />
          <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>

      <Modal
        visible={isComprovanteModalVisible}
        animationType="slide"
        onRequestClose={handleCloseComprovanteModal}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: comprovanteUri }} style={styles.comprovantePreviewLarge} />
          <Button title="Fechar" onPress={handleCloseComprovanteModal} />
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
    fontSize:15,
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
    marginRight: 10,

  },
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0022ff',
    padding: 10,
    borderRadius: 5,
  },
  cameraButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
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
  comprovantePreviewLarge: {
    width: '100%',
    height: '70%',
    marginBottom: 20,
  },
  previewContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comprovantePreviewLarge: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});
