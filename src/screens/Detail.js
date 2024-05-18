import React, {useEffect, useState, useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Appbar, Button, Dialog, Portal, useTheme} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context';
import MyTextInput from '../components/MyTextInput';

const Detail = ({navigation, route}) => {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const [note, setNote] = useState('');
  const [item, setItem] = useState({});
  const [visible, setVisible] = useState(false);

  const booking = () => {
    const now = new Date();

    firestore()
      .collection('Booking')
      .add({
        service: item.id,
        nameService: item.name,
        user: context.user.id,
        nameUser: context.user.fullname,
        note: note,
        status: 'pending',
        create: `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`,
      })
      .then(() => {
        console.log('Booking added!');

        navigation.navigate('BottomTab', {screen: 'Appointment'});
      });
  };

  const onPress = () => {
    setVisible(false);

    firestore()
      .collection('Services')
      .doc(item.id)
      .delete()
      .then(() => {
        console.log('Service deleted!');

        navigation.goBack();
      });
  };

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route.params.item);
      console.log(route.params.item);
    }
  }, [route?.params?.item]);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content color="#fff" title="Service Detail" />
        {context.user.role === 'admin' && (
          <Appbar.Action
            color="#fff"
            icon="dots-vertical"
            onPress={() => setVisible(true)}
          />
        )}
      </Appbar.Header>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Warning</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure move to this service? this operation can't be
              returned
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => onPress()}>DELETE</Button>
            <Button onPress={() => setVisible(false)}>CANCEL</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Text style={styles.text}>
        <Text style={{fontWeight: 'bold'}}>Service name:</Text> {item.name}
      </Text>
      <Text style={styles.text}>
        <Text style={{fontWeight: 'bold'}}>Price:</Text> {item.price}
      </Text>
      <Text style={styles.text}>
        <Text style={{fontWeight: 'bold'}}>Creator:</Text> {item.creator}
      </Text>
      {context.user.role === 'admin' && (
        <Text style={styles.text}>
          <Text style={{fontWeight: 'bold'}}>Time:</Text> {item.time}
        </Text>
      )}
      {context.user.role === 'admin' && (
        <Text style={styles.text}>
          <Text style={{fontWeight: 'bold'}}>Final Update:</Text> {item.update}
        </Text>
      )}
      {context.user.role === 'admin' && (
        <Button
          mode="text"
          style={{alignItems: 'flex-start', marginLeft: 4}}
          onPress={() => navigation.navigate('Update', {item: item})}>
          Update this item
        </Button>
      )}
      {context.user.role === 'customer' && (
        <MyTextInput
          label="Note"
          style={styles.textbox}
          value={note}
          onChangeText={x => setNote(x)}
        />
      )}
      {context.user.role === 'customer' && (
        <Button
          mode="contained"
          style={{
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 16,
          }}
          onPress={() => booking()}>
          BOOKING
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    color: '#000',
  },
  textbox: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
});

export default Detail;
