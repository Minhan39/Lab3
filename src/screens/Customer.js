import React, {useEffect, useState, useContext} from 'react';
import {FlatList, View, Text} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import firebase from '@react-native-firebase/firestore';
import {AuthContext} from '../context';

const Customer = () => {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    firebase()
      .collection('Users')
      .where('role', '==', 'customer')
      .onSnapshot(querySnapshot => {
        let data = [];

        querySnapshot.forEach(documentSnapshot => {
          data.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setCustomers(data);
      });
  }, []);

  return (
    <View>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.Content color="#fff" title="Customer" />
      </Appbar.Header>
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{
              paddingLeft: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderColor: '#ccc',
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 20, color: '#000'}}>
              {item.fullname}
            </Text>
            <Text style={{fontSize: 16, paddingTop: 4}}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Customer;
