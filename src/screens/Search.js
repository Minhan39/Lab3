import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, Pressable} from 'react-native';
import MyTextInput from '../components/MyTextInput';
import {Appbar, useTheme} from 'react-native-paper';
import firebase from '@react-native-firebase/firestore';

const Search = ({navigation}) => {
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [servicesFilter, setServicesFilter] = useState([]);
  const [search, setSearch] = useState('');

  const onChangeSearch = text => {
    setSearch(text);

    if (text === '') {
      setServicesFilter(services);
    }

    const textData = text.trim().toUpperCase();
    const newData = services.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;

      return itemData.indexOf(textData) > -1;
    });

    setServicesFilter(newData);
  };

  useEffect(() => {
    firebase()
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
        setServicesFilter(data);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content color="#fff" title="Search" />
      </Appbar.Header>
      <MyTextInput
        label="Search"
        style={styles.textbox}
        value={search}
        onChangeText={x => onChangeSearch(x)}
      />
      <FlatList
        data={servicesFilter}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textbox: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
});

export default Search;
