import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../config'

export default function ActivateAccountScreen({ navigation }) {
  const sendResetPasswordEmail =async () => {
    let rs= await sendEmailVerification(auth.currentUser);
    console.log(auth.currentUser.emailVerified);
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Your account isn't activated</Header>
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send activation link
      </Button>
    </Background>
  )
}
