import React, {useEffect, useState, useContext} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {Appbar, Text, useTheme} from 'react-native-paper';
import firebase from '@react-native-firebase/firestore';
import {AuthContext} from '../context';

const Appointment = () => {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const [appointments, setAppointments] = useState([]);

  const onPress = props => {
    firebase()
      .collection('Booking')
      .doc(props.id)
      .update({
        status: props.status === 'pending' ? 'access' : 'pending',
      })
      .then(() => {
        console.log('Appointment updated!');
      });
  };

  useEffect(() => {
    firebase()
      .collection('Booking')
      .onSnapshot(querySnapshot => {
        let data = [];

        querySnapshot.forEach(documentSnapshot => {
          data.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        if (context.user.role === 'customer') {
          data = data.filter(x => x.user === context.user.id);
        }

        setAppointments(data);
      });
  }, []);

  return (
    <View>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.Content color="#fff" title="Appointment" />
      </Appbar.Header>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={{
              margin: 16,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 8,
            }}
            onPress={() => onPress({id: item.id, status: item.status})}>
            <Text style={styles.text}>Customer: {item.nameUser}</Text>
            <Text style={styles.text}>Service: {item.nameService}</Text>
            <Text style={styles.text}>Note: {item.note}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
            <Text style={styles.text}>Create: {item.create}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    color: '#000',
  },
});

export default Appointment;
