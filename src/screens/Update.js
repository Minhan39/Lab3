import React, {useContext, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Button, useTheme} from 'react-native-paper';
import MyTextInput from '../components/MyTextInput';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context';

const Update = ({navigation, route}) => {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const [service, setService] = useState('');
  const [price, setPrice] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [item, setItem] = useState({});

  const onPress = () => {
    const now = new Date();

    firestore()
      .collection('Services')
      .doc(item.id)
      .update({
        name: service,
        price: price,
        update: `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`,
      })
      .then(() => {
        console.log('Service updated!');

        navigation.navigate('Home');
      });
  };

  const validate = () => {
    if (service.length < 1 || price.length < 1) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  useMemo(() => {
    validate();
  }, [service, price]);

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route.params.item);
      setService(route.params.item.name);
      setPrice(route.params.item.price);
      console.log(route.params.item);
    }
  }, [route?.params?.item]);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content color="#fff" title="Service" />
      </Appbar.Header>
      <MyTextInput
        style={{...styles.cover, marginTop: 16}}
        label="Service*"
        value={service}
        onChangeText={x => setService(x)}
      />
      <MyTextInput
        style={styles.cover}
        label="Price*"
        value={price}
        onChangeText={x => setPrice(x)}
        keyboardType="numeric"
      />
      <Button
        style={styles.cover}
        mode="contained"
        disabled={disabled}
        onPress={() => onPress()}>
        UPDATE
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cover: {
    marginHorizontal: 16,
    marginVertical: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Update;
