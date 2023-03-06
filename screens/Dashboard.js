import { Alert, FlatList, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Badge, Button, Card, Chip, Dialog, IconButton, MD2Colors, MD3Colors, Modal, Paragraph, Portal, Provider, Switch, Text, TextInput, Title } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'
import CardItem from '../components/CardItem';
import Balcony from '../components/Balcony';
const Dashboard = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [text, setText] = useState("");
  const [balconyId, setBalconyId] = useState("");
  const [balconyData, setBalconyData] = useState(null);
  const handleLoadingChange = async (loading) => {
    setIsLoading(loading);
  }
  const renderItem = ({ item }) =>
    (<Balcony navigation={navigation} item={item} isLoading={isLoading} onLoading={handleLoadingChange} />)
  const fetchData = async () => {
    // fetch data balcony
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.get(`${REACT_APP_BASE_URL}/balcony/find`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log("balcony", rs.data.balconies);
    if (rs.data.result == "success") {
      setData(rs.data.balconies)
      setIsLoading(false);
    } else {
      setIsLoading(false);
      Alert.alert("Fetch data fail")
    }
  }
  const addNewBalcony = async () => {
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.post(`${REACT_APP_BASE_URL}/balcony/create`, {
      name: text,
      balconyId: balconyId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log(rs.data);
    if (rs.data.balcony) {
      Alert.alert("Thêm mới thành công");
      hideDialog();
      setIsLoading(true);
    } else {
      Alert.alert("Thêm mới không thành công");
      hideDialog();
    }
  }
  if (isLoading) {
    fetchData();
  }
  return (
    <View>
      <View style={styles.rowContainer}>
        <View style={styles.header}>
          <Text style={styles.textHeader} variant="headlineSmall">Danh sách ban công</Text>
          <IconButton style={styles.textIcon}
            icon="plus-circle-outline"
            size={20}
            onPress={() => showDialog()}
          />
        </View>
        {isLoading==true ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <FlatList
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          horizontal={false} />
        }
        <View style={balconyData ? { opacity: 1 } : { opacity: 0 }}>
          <View style={{ flexDirection: 'row', marginLeft: -15 }}>
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="oil-temperature" size={20}>
              </IconButton>
              <Text style={styles.temperature}>{balconyData?.temperature}℃</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '50%' }}>
              <IconButton icon="water-outline" size={20}>
              </IconButton>
              <Text style={styles.temperature}>{balconyData?.humidity}%</Text>
            </View>
          </View>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Thêm mới ban công</Dialog.Title>
            <Dialog.Content>
              <TextInput
                placeholder='Tên ban công'
                style={{ backgroundColor: 'transparent' }}
                numberOfLines={4}
                maxLength={40}
                value={text}
                onChangeText={text => setText(text)}
              />
              <TextInput
                placeholder='Mã sản phẩm'
                style={{ backgroundColor: 'transparent' }}
                numberOfLines={4}
                maxLength={40}
                value={balconyId}
                onChangeText={text => setBalconyId(text)}
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
    width: "100%"
  },
  chip: {
    marginRight: 10
  },
  header: {
    flexDirection: 'row'
  },
  textHeader: {
    flex: 1
  },
  textIcon: {
    marginTop: -1
  },
  content: {
    marginTop: 0
  },
  card: {
    padding: 0,
    marginBottom: 20
  },
  temperature: {
    top: 15,
    marginLeft: -10
  }
})