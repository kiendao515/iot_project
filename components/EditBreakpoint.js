import { REACT_APP_BASE_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import {
  ActivityIndicator,
  Button,
  Dialog,
  MD2Colors,
  Portal,
  TextInput,
} from 'react-native-paper'
const EditBreakpoint = ({
  name,
  visible,
  onDismiss,
  title,
  onLoading,
  isLoading,
  breakpoint,
  treeId,
}) => {
  const [text, setText] = useState(name)
  const [loading, setLoading] = useState(false)
  const handleChangeState = () => {
    onLoading(!isLoading)
  }

  const editBreakPoint = async (item, breakpoint) => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    let rs = await axios.post(
      `${REACT_APP_BASE_URL}/plant/breakpoint`,
      {
        plantId: treeId,
        soilMoistureBreakpoint: text,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    console.log(rs.data)
    handleChangeState()
    if (rs.data.result) {
      Alert.alert('Cập nhập thành công')
      onDismiss()
    }
  }
  return (
    <View style={{ flex: 1 }}>
      {loading == true ? (
        <ActivityIndicator
          style={{ top: -110 }}
          animating={true}
          color={MD2Colors.red800}
        />
      ) : null}
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder={`${breakpoint}%`}
              style={{ backgroundColor: 'transparent' }}
              numberOfLines={4}
              maxLength={40}
              value={breakpoint}
              onChangeText={(text) => setText(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button
              onPress={() => {
                editBreakPoint()
              }}
            >
              Edit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default EditBreakpoint

const styles = StyleSheet.create({})
