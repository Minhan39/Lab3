import React, {useState, useMemo, useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button, IconButton, useTheme} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MyTextInput from '../components/MyTextInput';
import {AuthContext} from '../context';

const Login = ({navigation}) => {
  const theme = useTheme();
  const context = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hide, setHidePassword] = useState(true);
  const [disabled, setDisabled] = useState(true);

  const onPress = () => {
    console.log('Login...');

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account signed in!');

        firestore()
          .collection('Users')
          .where('email', '==', email)
          .get()
          .then(querySnapshot => {
            console.log('Total users: ', querySnapshot.size);

            querySnapshot.forEach(documentSnapshot => {
              console.log(
                'User ID: ',
                documentSnapshot.id,
                documentSnapshot.data(),
              );

              context.login({
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
              });

              navigation.navigate('BottomTab');
              return;
            });
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const validate = () => {
    if (email.length < 1 || !email.includes('@') || !email.includes('.')) {
      setDisabled(true);
      return;
    }
    if (password.length < 6) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  };

  useMemo(() => {
    validate();
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 64,
          fontWeight: 'bold',
          alignSelf: 'center',
          marginBottom: 16,
        }}>
        Login
      </Text>
      <MyTextInput
        label="Email"
        value={email}
        onChangeText={x => setEmail(x)}
        style={styles.cover}
      />
      <MyTextInput
        label="Password"
        style={styles.cover}
        value={password}
        onChangeText={x => setPassword(x)}
        secureTextEntry={hide}
        right={
          <IconButton
            icon={hide ? 'eye' : 'eye-off'}
            style={{margin: 0}}
            onPress={() => setHidePassword(!hide)}
          />
        }
      />
      <Button style={{alignItems: 'flex-end', marginRight: 16, padding: 0}}>
        Forgot password?
      </Button>
      <Button
        style={{
          ...styles.cover,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        mode="contained"
        onPress={() => onPress()}
        disabled={disabled}>
        LOGIN
      </Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Do you want join with our service?</Text>
        <Button onPress={() => navigation.navigate('Register')}>Sign up</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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

export default Login;
