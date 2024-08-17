import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, Button, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function FuelTab() {
  const [nomePosto, setNomePosto] = useState('');
  const [quantidadeLitros, setQuantidadeLitros] = useState('');
  const [tipoCombustivel, setTipoCombustivel] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [dataList, setDataList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editNomePosto, setEditNomePosto] = useState('');
  const [editQuantidadeLitros, setEditQuantidadeLitros] = useState('');
  const [editTipoCombustivel, setEditTipoCombustivel] = useState('');
  const [editValor, setEditValor] = useState('');
  const [editData, setEditData] = useState('');
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
    if (!nomePosto || !quantidadeLitros || !tipoCombustivel || !valor || !data) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    const fuel = {
      id: generateRandomAlphanumeric(10),
      nomePosto,
      quantidadeLitros,
      tipoCombustivel,
      valor,
      data,
      comprovanteUri,
    };

    try {
      const storedData = await AsyncStorage.getItem('fuel_data');
      const existingData = storedData ? JSON.parse(storedData) : [];

      const duplicate = existingData.some(item => item.comprovanteUri === comprovanteUri);
      if (duplicate) {
        Alert.alert('Erro', 'Este comprovante já foi anexado anteriormente.');
        return;
      }

      const newDataList = [...existingData, fuel];
      await AsyncStorage.setItem('fuel_data', JSON.stringify(newDataList));
      setDataList(newDataList);

      setNomePosto('');
      setQuantidadeLitros('');
      setTipoCombustivel('');
      setValor('');
      setData('');
      setComprovanteUri(null);
    } catch (error) {
      console.log('Erro ao armazenar os dados:', error);
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
    setEditNomePosto(item.nomePosto);
    setEditQuantidadeLitros(item.quantidadeLitros);
    setEditTipoCombustivel(item.tipoCombustivel);
    setEditValor(item.valor);
    setEditData(item.data);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const storedData = await AsyncStorage.getItem('fuel_data');
      const existingData = storedData ? JSON.parse(storedData) : [];
      const updatedDataList = existingData.map(item =>
        item.id === selectedItem.id
          ? { ...item, nomePosto: editNomePosto, quantidadeLitros: editQuantidadeLitros, tipoCombustivel: editTipoCombustivel, valor: editValor, data: editData }
          : item
      );
      await AsyncStorage.setItem('fuel_data', JSON.stringify(updatedDataList));
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
              const storedData = await AsyncStorage.getItem('fuel_data');
              const existingData = storedData ? JSON.parse(storedData) : [];
              const updatedDataList = existingData.filter(data => data.id !== item.id);
              await AsyncStorage.setItem('fuel_data', JSON.stringify(updatedDataList));
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
        <Text style={styles.tableCell} numberOfLines={1}>{item.nomePosto}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.quantidadeLitros} L</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.tipoCombustivel}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.valor}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCell} numberOfLines={1}>{item.data}</Text>
      </View>
      <View style={styles.moreIconCell}>
        <TouchableOpacity onPress={() => handleMoreOptions(item)}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('fuel_data');
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
          <Text style={styles.label}>Nome do Posto</Text>
          <TextInput
            style={styles.input}
            value={nomePosto}
            onChangeText={setNomePosto}
            placeholder="Nome do posto"
          />
        </View>
        <View style={styles.inputContainerElementosMeio}>
          <Text style={styles.label}>Quantidade de Litros</Text>
          <TextInput
            style={styles.input}
            value={quantidadeLitros}
            onChangeText={setQuantidadeLitros}
            placeholder="Quantidade de litro"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de Combustível</Text>
          <TextInput
            style={styles.input}
            value={tipoCombustivel}
            onChangeText={setTipoCombustivel}
            placeholder="Tipo de combustível"
          />
        </View>
        <View style={styles.inputContainerElementosMeio}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            placeholder="Valor"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            value={data}
            onChangeText={setData}
            placeholder="Data"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCamera}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.buttonText}>Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleComprovante}>
          <MaterialIcons name="image" size={24} color="white" />
          <Text style={styles.buttonText}>Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleIncluir}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.buttonText}>Incluir</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Abastecimento</Text>
            <TextInput
              style={styles.input}
              value={editNomePosto}
              onChangeText={setEditNomePosto}
              placeholder="Nome do posto"
            />
            <TextInput
              style={styles.input}
              value={editQuantidadeLitros}
              onChangeText={setEditQuantidadeLitros}
              placeholder="Quantidade de litro"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editTipoCombustivel}
              onChangeText={setEditTipoCombustivel}
              placeholder="Tipo de combustível"
            />
            <TextInput
              style={styles.input}
              value={editValor}
              onChangeText={setEditValor}
              placeholder="Valor"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editData}
              onChangeText={setEditData}
              placeholder="Data"
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Salvar" onPress={handleSaveEdit} />
              <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isComprovanteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseComprovanteModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {comprovanteUri && (
              <Image
                source={{ uri: comprovanteUri }}
                style={styles.comprovanteImage}
              />
            )}
            <Button title="Fechar" onPress={handleCloseComprovanteModal} />
          </View>
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
    marginBottom: 8,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  inputContainerElementosMeio: {
    flex: 1,
    marginLeft: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    padding: 5,
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  comprovanteImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
});
