import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useMyContextController, login } from '../provider';

function Login({ navigation }) {
  const [isShow, setIsShow] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    console.log("useEffect triggered");
    if (userLogin !== null) {
      navigation.navigate("Home");
    }
  }, [userLogin]);

  const handleLoginPress = () => {
    login(dispatch, email, password);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/userlogin.jpg')} />

      <View style={styles.contentContainer}>
        <Text style={styles.txt}>Login</Text>
        <TextInput
          style={styles.txtInput}
          label='Email'
          value={email}
          onChangeText={(email) => setEmail(email)}
          left={<TextInput.Icon icon='email' />}
        />
        <TextInput
          style={styles.txtInput}
          label='Password'
          value={password}
          secureTextEntry={isShow}
          onChangeText={(password) => setPassword(password)}
          left={<TextInput.Icon icon='key' />}
          right={<TextInput.Icon icon='eye' onPress={() => setIsShow(!isShow)} />}
        />

        <Button mode='contained' style={styles.btn} onPress={handleLoginPress}>
          Login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '80%', // Adjust the width as needed
  },
  txt: {
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 50,
    color: '#00ffff',
  },
  txtInput: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  btn: {
    borderRadius: 10,
    backgroundColor: '#00bfff',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  img: {
    width: 200,
    height: 150,
    alignSelf: 'center',
  },
});

export default Login;
