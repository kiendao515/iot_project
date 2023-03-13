import { Alert, FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Badge, Button, Card, Chip, Dialog, IconButton, MD2Colors, MD3Colors, Modal, Paragraph, Portal, Provider, Switch, Text, TextInput, Title } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'
import CardItem from '../components/CardItem';
import { Dropdown } from 'react-native-element-dropdown';
const ListTree = ({ route, navigation }) => {
  const [content, setContent] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [visibleAdd, setVisibleAdd] = useState(false)
  const showDialogAdd = () => setVisibleAdd(true);
  const hideDialogAdd = () => setVisibleAdd(false);
  const [text,setText]= useState(null);
  const [plantOrder,setPlantOrder] = useState(null);
  const [data, setData] = useState([]);
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
  const init = async () => {
    let d = []
    for (var i = 0; i <= 15; i++) {
      d.push({
        label: i,
        value: i
      })
    }
    setData(d);
  }
  useEffect(() => {
    init()
  }, [])
  const [dropdown, setDropdown] = useState(null);
  const _renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  const addNewTree=async(name,plantOrder)=>{
    setText(null)
    hideDialogAdd();
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/create`, {
      "name": name,
      "plantOrder": plantOrder,
      "balconyId":route.params.balconyId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log(rs.data);
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
        <Button icon="plus-outline" mode="contained" style={{width:'50%',marginBottom:10}} onPress={() => showDialogAdd()}>
          Thêm cây
        </Button>
        <View style={{width: '100%'}}>
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
        <Portal>
          <Dialog visible={visibleAdd} onDismiss={hideDialogAdd}>
            <Dialog.Title>Thêm mới cây</Dialog.Title>
            <Dialog.Content>
              <TextInput
                placeholder='Tên cây'
                style={{ backgroundColor: 'transparent' }}
                numberOfLines={4}
                maxLength={40}
                value={text}
                onChangeText={text => setText(text)}
              />
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.shadow}
                data={data}
                labelField="label"
                valueField="value"
                label="Dropdown"
                placeholder="1"
                value={dropdown}
                onChange={i => {
                  setDropdown(i.value);
                  console.log('selected', i);
                }}
                renderItem={item => _renderItem(item)}
                textError="Error"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialogAdd}>Cancel</Button>
              <Button onPress={()=>{addNewTree(text,dropdown)}}>Add</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  )
}

export default ListTree

const styles = StyleSheet.create({
  rowContainer: {
    top: 50,
    padding: 10
  },
  chip: {
    marginRight: 10
  },
  header: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 0,
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
  },
  dropdown: {
    backgroundColor: 'transparent',
    paddingLeft: 10
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
})