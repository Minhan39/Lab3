import React, {useContext} from 'react';
import {View} from 'react-native';
import {Appbar, Button, useTheme} from 'react-native-paper';
import {AuthContext} from '../context';

const Setting = ({navigation}) => {
  const context = useContext(AuthContext);
  const theme = useTheme();

  const logout = () => {
    context.logout();

    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.Content color="#fff" title="Setting" />
      </Appbar.Header>
      <View style={{paddingLeft: 32, paddingTop: 16}}>
        <Button
          style={{alignItems: 'flex-start'}}
          onPress={() => navigation.navigate('Profile')}>
          Profile
        </Button>
        <Button style={{alignItems: 'flex-start'}}>Change Password</Button>
        <Button style={{alignItems: 'flex-start'}} onPress={() => logout()}>
          Logout
        </Button>
      </View>
    </View>
  );
};

export default Setting;
