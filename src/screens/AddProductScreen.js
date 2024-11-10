import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const addProduct = async () => {
    if (!name || !price || !imageUri) {
      Alert.alert('Error', 'Product name, price, and image are required');
      return;
    }
    const addProduct = async () => {
      if (!name || !price || !imageUri) {
        Alert.alert('Error', 'Product name, price, and image are required');
        return;
      }
    
      const savedProducts = JSON.parse(await AsyncStorage.getItem('products')) || [];
      const isDuplicate = savedProducts.some((product) => product.name.toLowerCase() === name.toLowerCase());
    
      if (isDuplicate) {
        Alert.alert('Error', 'Product already exists');
        return;
      }
    
      const newProduct = { id: Date.now(), name, price, imageUri };
      savedProducts.push(newProduct);
      await AsyncStorage.setItem('products', JSON.stringify(savedProducts));
      navigation.navigate('HomeScreen');
    };
    

    const newProduct = { id: Date.now(), name, price, imageUri };
    const savedProducts = JSON.parse(await AsyncStorage.getItem('products')) || [];

    if (savedProducts.some(product => product.name === name)) {
      Alert.alert('Error', 'Product already exists');
      return;
    }

    savedProducts.push(newProduct);
    await AsyncStorage.setItem('products', JSON.stringify(savedProducts));
    navigation.navigate('Home');
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={26} color="#555" />
      </TouchableOpacity>

      <Text style={styles.title}>Add Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        <Text style={styles.imagePickerText}>Select Product Image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Button title="Add Product" onPress={addProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  backIcon: { position: 'absolute', top: 40, left: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
  imagePicker: {
    padding: 15,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: { color: '#555' },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default AddProductScreen;
