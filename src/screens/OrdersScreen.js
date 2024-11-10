import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import icon library

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const savedOrders = JSON.parse(await AsyncStorage.getItem('orders')) || [];
      setOrders(savedOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const updatedOrders = orders.filter(order => order.id !== id);
      setOrders(updatedOrders);
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));  // Save updated orders to AsyncStorage
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Text style={styles.header}>Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders available</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View style={styles.orderDetails}>
                <Text style={styles.orderId}>Order ID: {item.id}</Text>
                <Text>Product Name: {item.productName}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Date: {item.date}</Text>
              </View>

              <TouchableOpacity onPress={() => deleteOrder(item.id)} style={styles.deleteButton}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noOrders: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deleteButton: {
    padding: 10,
  },
});

export default OrdersScreen;
