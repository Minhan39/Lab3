import React from 'react';
import {View, TextInput, Text} from 'react-native';

const MyTextInput = props => {
  return (
    <View
      style={{
        ...props.style,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 16,
      }}>
      <View
        style={{
          flexDirection: 'column',
          width: '80%',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            position: 'absolute',
            top: -12,
            left: 0,
            backgroundColor: '#fff',
          }}>
          {props.label}
        </Text>
        <TextInput
          placeholder={`Enter your ${props.label}`}
          secureTextEntry={props.secureTextEntry}
          value={props.value}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
        />
      </View>
      {props.right}
    </View>
  );
};

export default MyTextInput;
