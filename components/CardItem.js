import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Card, Dialog, IconButton, Portal, Switch, Title } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import EditTree from './EditTree';
const CardItem = ({ item, navigation, isLoading, onLoading }) => {
  const [selected, setSelected] = useState(item.autoMode);
  const [waterPlant, setWaterPlant] = useState(false);
  const [data, setData] = useState([]);
  const [visibleEdit, setVisibleEdit] = useState(false)
  const showDialogEdit = () => setVisibleEdit(true);
  const hideDialogEdit = () => setVisibleEdit(false);
  const [visibleDelete, setVisibleDelete] = useState(false)
  const showDialogDelete = () => setVisibleDelete(true);
  const hideDialogDelete = () => setVisibleDelete(false);
  const [loading, setLoading] = useState(false);
  const handleChangeState = () => {
      onLoading(!isLoading)
  }
  const init = async () => {
    let d = []
    for (var i = 1; i <= 100; i++) {
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
  const toggleSwitch = () => {
    setSelected(!selected);
  };
  const autoWater = async (item) => {
    const token = await AsyncStorage.getItem("token");
    if (selected) {
      let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/auto-mode`, {
        "plantId": item.plantId,
        "autoMode": 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(rs.data.message);
    } else {
      let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/auto-mode`, {
        "plantId": item.plantId,
        "autoMode": 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(rs.data.message);
    }
  }
  const toggleWaterPlant = async (item) => {
    setWaterPlant(!waterPlant)
    const token = await AsyncStorage.getItem("token");
    if (waterPlant) {
      let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/control`, {
        "plantId": item.plantId,
        "requestCode": 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(rs.data.message);
    } else {
      let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/control`, {
        "plantId": item.plantId,
        "requestCode": 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(rs.data.message);
    }

  }
  const editBreakPoint = async (item, breakpoint) => {
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.post(`${REACT_APP_BASE_URL}/plant/breakpoint`, {
      "plantId": item.plantId,
      "soilMoistureBreakpoint": breakpoint
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log(rs.data);
    if (rs.data.result) {
      Alert.alert("Cập nhập thành công")
    }
  }
  const deleteTree = async(item)=>{
    console.log(item);
    hideDialogDelete()
    const token = await AsyncStorage.getItem("token");
    let rs = await axios.delete(`${REACT_APP_BASE_URL}/plant/delete?_id=`+item._id,{
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log(rs);
    if (rs.data.result) {
      Alert.alert("Xoá thành công")
      handleChangeState()
      setLoading(false)
    }
  }
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image }} />
      <EditTree
        treeId={item.plantId}
        name={item.name}
        image={item.image}
        title="Sửa thông tin cây"
        onLoading={onLoading}
        isLoading={isLoading}
        visible={visibleEdit}
        onDismiss={hideDialogEdit}
      />
      <Portal>
        <Dialog visible={visibleDelete} onDismiss={hideDialogDelete}>
          <Dialog.Content>
            <Text variant="bodyMedium">Bạn có chắc chắn muốn xoá cây?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialogDelete}>Cancel</Button>
            <Button onPress={()=>deleteTree(item)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Card.Content>
        <Title>{item.name}</Title>
        <View style={{ flexDirection: 'row', marginLeft: -20 }}>
          <View style={{ flexDirection: 'row', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', flexDirection: 'row', width: '50%', alignItems: 'center' }}>
              <IconButton icon="water-outline" size={30}>
              </IconButton>
              <Text style={styles.temperature}>Độ ẩm đất: {item.soilMoisture} %</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '50%', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <IconButton icon="pencil" size={30} onPress={() => showDialogEdit()}>
              </IconButton>
              <IconButton icon="delete" size={30} onPress={() => showDialogDelete()}>
              </IconButton>
            </View>
          </View>
        </View>
        <View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <View style={{ width: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10 }}>Tưới tự động</Text>
            <Switch value={selected} onValueChange={() => {
              toggleSwitch()
              autoWater(item)
            }} />
          </View>
          {
            selected == false ? <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 10 }}>Tưới cây</Text>
              <Switch value={waterPlant} onValueChange={() => {
                toggleWaterPlant(item);
              }} />
            </View> : <View style={{
              width: '15%'
            }}>
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
                  editBreakPoint(item, i.value);
                }}
                renderItem={item => _renderItem(item)}
                textError="Error"
              />
            </View>
          }
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
    marginLeft: -10,
    fontSize: 20
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