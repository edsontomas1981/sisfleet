import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { formatCurrency } from '../assets/utils/formatCurrency';



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
      </View>
      <View style={styles.row}>

      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Frete</Text>
          <TextInput
            style={styles.input}
            value={frete}
            onChangeText={(text) => setFrete(formatCurrency(text))}
            placeholder="Valor do frete"
            keyboardType="numeric"
            maxLength={10} // Limita o tamanho do campo para comportar o formato monetário
          />
        </View>
        <View style={styles.inputContainerElementosMeio}>
          <Text style={styles.label} numberOfLines={1} >Adiantamento</Text>
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
            placeholder="Peso da carga"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonIncluir} onPress={handleIncluir}>
          <View style={styles.iconButton}>
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.buttonText}>Incluir</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCamera} onPress={handleCamera}>
          <View style={styles.iconButton}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.buttonText}>Câmera</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonGaleria} onPress={handleComprovante}>
          <View style={styles.iconButton}>
            <MaterialIcons name="photo-library" size={24} color="white" />
            <Text style={styles.buttonText}>Galeria</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, styles.headerText]}>Cliente</Text>
        <Text style={[styles.tableHeaderCell, styles.headerText]}>Destino</Text>
        <Text style={[styles.tableHeaderCell, styles.headerText]}>Frete</Text>
        <Text style={[styles.tableHeaderCell, styles.headerText]}>Opções</Text>
      </View>

      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Item</Text>

          <Text style={styles.modalLabel}>Cliente</Text>
          <TextInput
            style={styles.modalInput}
            value={editCliente}
            onChangeText={setEditCliente}
          />

          <Text style={styles.modalLabel}>Destino</Text>
          <TextInput
            style={styles.modalInput}
            value={editDestino}
            onChangeText={setEditDestino}
          />

          <Text style={styles.modalLabel}>Frete</Text>
          <TextInput
            style={styles.modalInput}
            value={editFrete}
            onChangeText={setEditFrete}
            keyboardType="numeric"
          />

          <Text style={styles.modalLabel} numberOfLines={1}>Adiantamento</Text>
          <TextInput
            style={styles.modalInput}
            value={editAdiantamento}
            onChangeText={setEditAdiantamento}
            keyboardType="numeric"
          />

          <Text style={styles.modalLabel}>Peso</Text>
          <TextInput
            style={styles.modalInput}
            value={editPeso}
            onChangeText={setEditPeso}
            keyboardType="numeric"
          />

          <Button title="Salvar" onPress={handleSaveEdit} />
          <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>

      <Modal visible={isComprovanteModalVisible} animationType="slide" onRequestClose={handleCloseComprovanteModal}>
        <View style={styles.modalContainer}>
          {comprovanteUri && (
            <Image
              source={{ uri: comprovanteUri }}
              style={styles.modalImage}
              resizeMode="contain" // Ajusta a imagem para caber no modal sem ser cortada
            />
          )}
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
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
  },
  inputContainerElementosMeio: {
    flex: 1,
    marginRight:5,
    marginLeft:5,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonIncluir: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },

  buttonCamera: {
    backgroundColor: '#565050',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonGaleria: {
    backgroundColor: '#54bc34',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  moreIconCell: {
    flex: 0.5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
});
