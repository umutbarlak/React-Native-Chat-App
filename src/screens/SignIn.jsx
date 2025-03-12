import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase/config';
import {useNavigation} from '@react-navigation/native';

const SignIn = () => {
  const navigation = useNavigation();

  const [formData, setformData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onChange = (key, value) => {
    setformData(prev => ({...prev, [key]: value}));
  };

  const singIn = async () => {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      navigation.navigate('Main');
    } catch (error) {
      alert(error.message);
      setIsError(error);
    }
    setIsLoading(false);
  };

  return (
    <View
      style={{
        padding: 16,
        gap: 15,
      }}>
      <TextInput
        required
        value={formData.email}
        onChangeText={text => onChange('email', text)}
        label={'Email'}
        keyboardType="email-address"
      />
      <TextInput
        secureTextEntry
        required
        value={formData.password}
        onChangeText={text => onChange('password', text)}
        label={'Password'}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button onPress={() => navigation.navigate('SignUp')} compact={true}>
          Sign Up
        </Button>
        <Button loading={isLoading} onPress={singIn} mode="contained">
          Sign In
        </Button>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
