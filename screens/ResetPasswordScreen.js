import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import Toast from 'react-native-toast-message'
import axios from 'axios'
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { StyleSheet} from 'react-native'
import { REACT_APP_BASE_URL } from '@env'


export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)

  const sendResetPasswordEmail = () => {
    setLoading(true)
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    } else {
      const body = {
        email: email.value
      }
      axios.post(`${REACT_APP_BASE_URL}/account/request-reset-password`, body )
      .then((res) => {
        console.log(res);
        if (res.data.result == 'failed') {
          Toast.show({
            type: 'error',
            text1: 'Thất bại',
            text2: 'Hãy kiểm tra lại email!',
            visibilityTime: 4000
          })
        } else {
          Toast.show({
            type: 'success',
            text1: 'Thành công',
            text2: 'Mật khẩu mới đã được gửi vào email!',
            visibilityTime: 4000
          })
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      });
    }
  }

  return (
    <Background>
      <ActivityIndicator size='large' animating={loading} color={MD2Colors.red800} style={loading ? styles.loading : styles.hide} />
      <Toast ref={(ref) => {Toast.setRef(ref)}}/>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Quên mật khẩu</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Bạn sẽ nhận được đường dẫn khôi phục mật khẩu"
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Khôi phục mật khẩu
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
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
