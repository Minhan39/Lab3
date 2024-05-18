import React, {useContext, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Button, useTheme} from 'react-native-paper';
import MyTextInput from '../components/MyTextInput';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context';

const Add = ({navigation}) => {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const [service, setService] = useState('');
  const [price, setPrice] = useState('');
  const [disabled, setDisabled] = useState(true);

  const onPress = () => {
    const now = new Date();

    firestore()
      .collection('Services')
      .add({
        name: service,
        price: price,
        creator: context.user.fullname,
        time: `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`,
        update: `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`,
      })
      .then(() => {
        console.log('Service added!');

        navigation.goBack();
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
        ADD
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

export default Add;
