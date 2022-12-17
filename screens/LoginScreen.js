import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { REACT_APP_BASE_URL } from '@env'
import axios from 'axios'
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)

  const onLoginPressed = (navigation) => {
    setLoading(true)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setLoading(false)
      return
    } 
    else {
      const body = {
        email: email.value,
        password: password.value
      }
      axios.post(`${REACT_APP_BASE_URL}/account/sign-in`, body )
      .then((res) => {
        console.log(res);
        navigation.navigate('Dashboard')
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err.response.data.message.includes("Sai")) {
          setPassword({...password, error: err.response.data.message })
        } else {
          setEmail({...email, error: err.response.data.message })
        }
        setLoading(false)
      });
    }
  }

  return (
    <Background>
      <ActivityIndicator size='large' animating={loading} color={MD2Colors.red800} style={loading ? styles.loading : styles.hide} />
      <BackButton goBack={navigation.goBack} />

      <Logo />
      <Header>Đăng nhập</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={() => onLoginPressed(navigation)}>
        Đăng nhập
      </Button>
      <View style={styles.row}>
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Đăng kí</Text>
        </TouchableOpacity>
      </View>
      
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  loading: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  hide: {
    display: 'none'
  }
})
