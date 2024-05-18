import React, {useState, useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button, IconButton, useTheme} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MyTextInput from '../components/MyTextInput';

const Register = ({navigation}) => {
  const theme = useTheme();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hide, setHidePassword] = useState(true);
  const [disabled, setDisabled] = useState(true);

  const onPress = () => {
    console.log('Registering...');

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');

        firestore()
          .collection('Users')
          .add({
            fullname: fullname,
            email: email,
            role: 'customer',
          })
          .then(() => {
            console.log('User added!');

            navigation.goBack();
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
    if (fullname.length < 1) {
      setDisabled(true);
      return;
    }
    if (email.length < 1 || !email.includes('@') || !email.includes('.')) {
      setDisabled(true);
      return;
    }
    if (password.length < 6) {
      setDisabled(true);
      return;
    }
    if (confirmPassword !== password) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  };

  useMemo(() => {
    validate();
  }, [fullname, email, password, confirmPassword]);

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
        Register
      </Text>
      <MyTextInput
        label="Full Name"
        value={fullname}
        onChangeText={x => setFullname(x)}
        style={styles.cover}
      />
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
      <MyTextInput
        label="Confirm Password"
        style={styles.cover}
        value={confirmPassword}
        onChangeText={x => setConfirmPassword(x)}
        secureTextEntry={hide}
        right={
          <IconButton
            icon={hide ? 'eye' : 'eye-off'}
            style={{margin: 0}}
            onPress={() => setHidePassword(!hide)}
          />
        }
      />
      <Button
        style={{
          ...styles.cover,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        mode="contained"
        onPress={() => onPress()}
        disabled={disabled}>
        REGISTER
      </Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Do you have an account?</Text>
        <Button onPress={() => navigation.goBack()}>Sign in</Button>
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

export default Register;
