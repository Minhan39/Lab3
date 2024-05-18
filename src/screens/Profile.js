import React, {useContext, useMemo, useState} from 'react';
import {Alert, StyleSheet, View, Text} from 'react-native';
import {Avatar, Appbar, useTheme, Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {AuthContext} from '../context';
import firestore from '@react-native-firebase/firestore';

const Profile = ({navigation}) => {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState('');
  const [save, setSave] = useState(false);

  const removeImage = () => {
    setSelectedImage('');

    if (context.user.image === true) {
      storage()
        .ref(`images/${context.user.id}`)
        .delete()
        .then(() => {
          console.log('Image deleted in Storage');
        });
      firestore()
        .collection('Users')
        .doc(context.user.id)
        .update({
          image: false,
        })
        .then(() => {
          console.log('User updated!');
        });

      context.updateImage(false);
      setSave(false);
    }

    console.log('Remove image');
  };

  const onPress = () => {
    storage()
      .ref(`images/${context.user.id}`)
      .putFile(selectedImage)
      .catch(error => {
        console.log('Error: ', error);
      });

    firestore()
      .collection('Users')
      .doc(context.user.id)
      .update({
        image: true,
      })
      .then(() => {
        console.log('User updated!');
      });

    setSave(false);
    context.updateImage(true);

    Alert.alert('Success', 'Your avatar has been updated!');

    console.log('Save image');
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        setSave(true);
        console.log('Image URI: ', imageUri);
      }
    });
  };

  const getAvatar = async () => {
    return await storage().ref(`images/${context.user.id}`).getDownloadURL();
  };

  useMemo(() => {
    getAvatar()
      .then(url => {
        setSelectedImage(url !== null ? url : '');
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  }, []);

  return (
    <View>
      <Appbar.Header style={{backgroundColor: theme.colors.primary}}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content color="#fff" title="Profile" />
      </Appbar.Header>
      {selectedImage != '' && (
        <Avatar.Image
          style={{alignSelf: 'center', marginTop: 32}}
          size={160}
          source={
            selectedImage == ''
              ? require('../images/logolab3.png')
              : {uri: selectedImage}
          }
        />
      )}
      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16}}>
        <Button
          mode="contained"
          style={styles.cover}
          onPress={() => openImagePicker()}>
          Pick Avatar
        </Button>
        {context.user.image === true && (
          <Button
            mode="contained"
            style={styles.cover}
            onPress={() => removeImage()}>
            Remove
          </Button>
        )}
        {save === true && (
          <Button
            mode="contained"
            style={styles.cover}
            onPress={() => onPress()}>
            Save
          </Button>
        )}
      </View>
      <Text style={{...styles.text, marginTop: 16}}>
        {context.user.fullname}
      </Text>
      <Text style={styles.text}>{context.user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cover: {
    marginHorizontal: 2,
  },
  text: {
    alignSelf: 'center',
    marginVertical: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
