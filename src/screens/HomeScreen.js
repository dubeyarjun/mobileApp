import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadProducts = async () => {
        const savedProducts = JSON.parse(await AsyncStorage.getItem('products')) || [];
        setProducts(savedProducts);
      };
      loadProducts();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('LoginScreen');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 2);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const deleteProduct = async (id) => {
    // Remove product from product list
    const newProducts = products.filter(product => product.id !== id);
    setProducts(newProducts);
    await AsyncStorage.setItem('products', JSON.stringify(newProducts));

    // Remove associated order from orders list
    const savedOrders = JSON.parse(await AsyncStorage.getItem('orders')) || [];
    const updatedOrders = savedOrders.filter(order => order.productId !== id);
    await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const addOrder = async (product) => {
    const newOrder = {
      id: Date.now().toString(), // Unique ID based on timestamp
      productId: product.id, // Save the product ID to link the order to the product
      productName: product.name,
      price: product.price,
      date: new Date().toLocaleDateString(),
    };
  
    try {
      const savedOrders = JSON.parse(await AsyncStorage.getItem('orders')) || [];
      const updatedOrders = [...savedOrders, newOrder];
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
  
      // Navigate to OrderScreen after saving the order
      navigation.navigate('OrdersScreen');
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#555" style={styles.icon} />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={{ marginVertical: 30 }}>
          <Text style={{ fontSize: 30, color: '#555', fontWeight: '800' }}>Hi-Fi Shop & Service</Text>
          <Text style={{ fontSize: 24, color: '#555', fontWeight: '200', marginTop: 5 }}>
            This shop offers both Products and services.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 20 }}>Total Products {filteredProducts.length}</Text>
          <TouchableOpacity onPress={toggleShowAll}>
            <Text style={{ fontSize: 16, color: 'blue' }}>{showAll ? 'Show Less' : 'Show All'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={displayedProducts}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No Product Found</Text>}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={{ uri: item.imageUri }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteProduct(item.id)} style={styles.iconSpacing}>
                <Icon name="delete" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addOrder(item)}>
                <Icon name="shopping-cart" size={20} color="green" />
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={{ color: 'red', textAlign: 'center' }}>LogOut</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.plusIconContainer}
          onPress={() => navigation.navigate('AddProductScreen')}
        >
          <Icon name="add" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    marginLeft: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  iconSpacing: {
    marginRight: 10, // Adds 5px spacing between delete and orders icon
  },
  logoutButton: {
    height: 30,
    width: 80,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    left: '40%',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 70,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
