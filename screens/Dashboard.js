import { Alert, FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Badge,
  Button,
  Card,
  Chip,
  Dialog,
  IconButton,
  MD2Colors,
  MD3Colors,
  Modal,
  Paragraph,
  Portal,
  Provider,
  Switch,
  Text,
  TextInput,
  Title,
} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { REACT_APP_BASE_URL } from '@env'
import CardItem from '../components/CardItem'
const Dashboard = () => {
  const [data, setData] = useState([])
  const [content, setContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)
  const [text, setText] = useState('')
  const [selectedBalconyId, setSelectedBalconyId] = useState(null)
  const [isSwitch, setIsSwitchOn] = useState(null)
  const [balconyData, setBalconyData] = useState(null)
  const onToggleSwitch = async (item) => {
    console.log(item)
    const token = await AsyncStorage.getItem('token')
    let rs = await axios.post(
      `${REACT_APP_BASE_URL}/plant/auto-mode`,
      {
        plantId: item.plantId,
        autoMode: !item.autoMode,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    console.log(rs.data.message)
  }
  const renderItem = ({ item }) => (
    <Chip
      mode="outlined"
      style={
        item._id === selectedBalconyId
          ? [styles.chip, { backgroundColor: '#9ea5b0' }]
          : [styles.chip]
      }
      onPress={() => {
        console.log('Pressed ' + item._id)
        getTreeInABalcony(item._id)
      }}
    >
      {item.name}
    </Chip>
  )
  const renderContent = ({ item }) => (
    <CardItem item={item} onToggleSwitch={onToggleSwitch} />
  )
  const fetchData = async () => {
    setIsLoading(false)
    // fetch data balcony
    const token = await AsyncStorage.getItem('token')
    let rs = await axios.get(`${REACT_APP_BASE_URL}/balcony/find`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (rs.data.result == 'success') {
      setData(rs.data.balconies)
    } else {
      Alert.alert('Fetch data fail')
    }

    // fetch all tree
    let trees = await axios.get(`${REACT_APP_BASE_URL}/plant/find`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (trees.data.result == 'success') {
      setContent(trees.data.plants)
    }
  }
  const addNewBalcony = async () => {
    const token = await AsyncStorage.getItem('token')
    let rs = await axios.post(
      `${REACT_APP_BASE_URL}/balcony/create`,
      {
        name: text,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    console.log(rs.data)
    if (rs.data.balcony) {
      Alert.alert('Thêm mới thành công')
      hideDialog()
      setIsLoading(true)
    } else {
      Alert.alert('Thêm mới không thành công')
      hideDialog()
    }
  }
  const getTreeInABalcony = async (id) => {
    setLoading(true)
    setSelectedBalconyId(id)
    const token = await AsyncStorage.getItem('token')
    let rs = await axios.get(
      `${REACT_APP_BASE_URL}/balcony/detail?balconyId=` + id,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    console.log(rs.data)
    setBalconyData(rs.data.balcony)
    setContent(rs.data.balcony.plants)
    setLoading(false)
  }
  if (isLoading) {
    fetchData()
  }

  useEffect(() => {
    // console.log("123" + data[0]._id);
    // getTreeInABalcony(data[0]?._id)
  }, [data])
  return (
    <View>
      <View style={styles.rowContainer}>
        <View style={styles.header}>
          <Text style={styles.textHeader} variant="headlineSmall">
            Home
          </Text>
          <IconButton
            style={styles.textIcon}
            icon="plus-circle-outline"
            size={20}
            onPress={() => showDialog()}
          />
        </View>
        {isLoading ? (
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            horizontal={true}
          />
        )}
        <View style={balconyData ? { opacity: 1 } : { opacity: 0 }}>
          <View style={{ flexDirection: 'row', marginLeft: -15 }}>
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="oil-temperature" size={20}></IconButton>
              <Text style={styles.temperature}>
                {parseInt(balconyData?.temperature)}℃
              </Text>
            </View>
            <View style={{ flexDirection: 'row', width: '50%' }}>
              <IconButton icon="water-outline" size={20}></IconButton>
              <Text style={styles.temperature}>{parseInt(balconyData?.humidity)}%</Text>
            </View>
          </View>
        </View>
        <View style={balconyData ? { marginTop: 0 } : { marginTop: -30 }}>
          {loading ? (
            <ActivityIndicator animating={true} color={MD2Colors.red800} />
          ) : content.length != 0 ? (
            <FlatList
              data={content}
              keyExtractor={(item) => item._id}
              renderItem={renderContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text>Chưa có dữ liệu cây</Text>
          )}
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Thêm mới ban công</Dialog.Title>
            <Dialog.Content>
              <TextInput
                numberOfLines={4}
                maxLength={40}
                value={text}
                onChangeText={(text) => setText(text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={addNewBalcony}>Add</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  rowContainer: {
    top: 50,
    padding: 10,
    width: '100%',
  },
  chip: {
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
  },
  textHeader: {
    flex: 1,
  },
  textIcon: {
    marginTop: -1,
  },
  content: {
    marginTop: 0,
  },
  card: {
    padding: 0,
    marginBottom: 20,
  },
  temperature: {
    top: 15,
    marginLeft: -10,
  },
})
