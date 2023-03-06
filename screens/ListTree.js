import { Alert, FlatList, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Badge, Button, Card, Chip, Dialog, IconButton, MD2Colors, MD3Colors, Modal, Paragraph, Portal, Provider, Switch, Text, TextInput, Title } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'
import CardItem from '../components/CardItem';
const ListTree = ({ route, navigation }) => {
  const [content, setContent] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const handleLoadingChange = async (loading) => {
    setIsLoading(loading);
  }
  const onToggleSwitch = async (item) => {
    console.log(item);
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/auto-mode`, {
      "plantId": item.plantId,
      "autoMode": !item.autoMode
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log(rs.data.message);
  }
  const getTreeInABalcony = async () => {
    console.log(route.params.balconyId);
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.get(`${REACT_APP_BASE_URL}/plant/find?balconyId=` + route.params.balconyId, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log("plants", rs.data);
    if (rs.data.plants != null) {
      setContent(rs.data.plants)
    }
    setIsLoading(false);
  }
  const renderContent = ({ item }) => (<CardItem navigation={navigation} item={item} isLoading={isLoading} onLoading={handleLoadingChange} onToggleSwitch={onToggleSwitch} />)
  if (isLoading) {
    getTreeInABalcony();
  }
  return (
    <View>
      <View style={styles.rowContainer}>
        <View style={styles.header}>
          <IconButton style={styles.textIcon}
            icon="keyboard-backspace"
            size={40}
            onPress={navigation.goBack}
          />
          <Text style={styles.textHeader} variant="headlineSmall">{route.params.name}</Text>
        </View>
        <View >
          {
            isLoading ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> :
              content?.length != 0 ?
                <FlatList
                  data={content}
                  keyExtractor={item => item._id}
                  renderItem={renderContent}
                  showsVerticalScrollIndicator={false} />
                : <Text>Chưa có dữ liệu cây</Text>
          }
        </View>
      </View>
    </View>
  )
}

export default ListTree

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
    flexDirection: 'row',
    display:'flex',
    alignItems:'center',
    marginBottom: 10,
    fontWeight: '700',
    fontSize: 30,
  },
  textHeader: {
    flex: 1
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