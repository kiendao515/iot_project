import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, IconButton, Switch, Title } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'

const CardItem = ({item,onToggleSwitch}) => {
  const [selected, setSelected] = useState(item.autoMode);
  const toggleSwitch = () => {
    setSelected(!selected);
  };
  const waterManual = async (item) => {
    console.log(item);
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/control`, {
      "plantId": item.plantId,
      "requestCode": 0
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log(rs.data.message);
    Alert.alert("Water the plant successfully!")
  }
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
      <Card.Content>
        <Title>{item.name}</Title>
        <View style={{ flexDirection: 'row', marginLeft: -20 }}>
          <View style={{ flexDirection: 'row' }}>
          </View>
          <View style={{ flexDirection: 'row', width: '50%' }}>
            <IconButton icon="water-outline" size={20}>
            </IconButton>
            <Text style={styles.temperature}>{item.plantHumidity} %</Text>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <View style={{ width: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10 }}>Tưới tự động</Text>
            <Switch value={selected} onValueChange={() => {
              toggleSwitch()
              onToggleSwitch(item)
            }} />
          </View>
          <Button disabled={selected} icon="watering-can" mode="contained" onPress={() => waterManual(item)}>
            Tưới cây
          </Button>
        </View>
      </Card.Content>
      <Card.Actions>
      </Card.Actions>
    </Card>
  )
}

export default CardItem

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
    marginTop: 20
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