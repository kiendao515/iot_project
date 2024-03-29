import React, { useState } from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import useAutoLogin from '../hooks/useAutoLogin'


export default function StartScreen({ navigation }) {
  const { loading } = useAutoLogin(
    (account) => {
      console.log(account);
      navigation.navigate('Dashboard')
    },
    () => {
      console.log("Can not auto login! invalid token");
      // Perform login error actions
    },
  );
  return (
    <Background>
      <Logo />
      <Header>IOT PROJECT</Header>
      <Paragraph>
        Ứng dụng tưới cây tự động
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Đăng nhập
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Đăng kí
      </Button>
    </Background>
  )
}
