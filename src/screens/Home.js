import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import {Appbar, IconButton, useTheme} from 'react-native-paper';
import {AuthContext} from '../context';
import firestore from '@react-native-firebase/firestore';

const Home = ({navigation}) => {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const [services, setServices] = useState([]);

  useEffect(() => {
    firestore()
      .collection('Services')
      .onSnapshot(querySnapshot => {
        let data = [];

        querySnapshot.forEach(documentSnapshot => {
          data.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setServices(data);
      });
  }, []);

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.Content color="#fff" title={context.user.fullname} />
        <Appbar.Action
          color="#fff"
          icon="account"
          onPress={() => navigation.navigate('Profile')}
        />
      </Appbar.Header>
      <Image
        style={{
          alignSelf: 'center',
          marginTop: 32,
        }}
        source={require('../images/logolab3.png')}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          marginTop: 16,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
          Danh sách dịch vụ
        </Text>
        {context.user.role === 'admin' && (
          <IconButton
            icon="gamepad-round"
            iconColor="#fff"
            size={20}
            style={{backgroundColor: theme.colors.primary}}
            onPress={() => navigation.navigate('Add')}
          />
        )}
        {context.user.role === 'customer' && (
          <IconButton
            icon="folder-search"
            iconColor="#fff"
            size={20}
            style={{backgroundColor: theme.colors.primary}}
            onPress={() => navigation.navigate('Search')}
          />
        )}
      </View>
      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 16,
              marginVertical: 8,
              padding: 8,
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 8,
              height: 48,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('Detail', {item: item})}>
            <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
            <Text>{item.price}đ</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Home;
