import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, Dialog, Divider, IconButton, Menu, Paragraph, Portal, Title } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'
import EditBalcony from './EditBalcony';

const Balcony = ({ item,onLoading,isLoading,navigation}) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const showDialog = () => setVisibleDialog(true);
    const hideDialog = () => setVisibleDialog(false);
    const [visibleEdit,setVisibleEdit] = useState(false)
    const showDialogEdit = () => setVisibleEdit(true);
    const hideDialogEdit = () => setVisibleEdit(false);
    const handleChangeState = () => {
        onLoading(!isLoading)
    }
    const deleteBalcony = async(id) => {
        hideDialog();
        console.log("balconyId",id);
        const token = await AsyncStorage.getItem("token");
        let rs = await axios.delete(`${REACT_APP_BASE_URL}/balcony/delete?balconyId=`+id,{
            headers: { Authorization: `Bearer ${token}` }
        })
        if(rs.data.result){
            Alert.alert("Xoá thành công");
            handleChangeState()
        }else{
            Alert.alert("Xoá thất bại");
        }
    }
    return (
        <Card style={styles.card} onPress={()=>navigation.navigate('ListTree',{balconyId:item.balconyId,name:item.name})}>
            <Card.Cover source={{ uri: item.image }} />
            <Card.Content>
                <Title>{item.name}</Title>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', display: 'flex',
                    alignItems: 'center'
                }}>
                    <View style={{ flexDirection: 'row', marginLeft: -20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <IconButton icon="oil-temperature" iconColor='red' size={20}>
                            </IconButton>
                            <Text style={styles.temperature}>{item.humidity} ℃ </Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '50%' }}>
                            <IconButton iconColor='blue' icon="water-outline" size={20}>
                            </IconButton>
                            <Text style={styles.temperature}>{item.humidity} %</Text>
                        </View>
                    </View>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<IconButton icon="dots-vertical" size={20} onPress={openMenu}></IconButton>}>
                        <Menu.Item onPress={() => {
                            showDialogEdit();
                            closeMenu();
                        }} title="Edit" />
                        <Menu.Item onPress={() => {
                            showDialog();
                            closeMenu();
                        }} title="Delete" />
                    </Menu>
                    <Portal>
                        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
                            <Dialog.Title>Bạn có chắc chắn muốn xoá ban công này?</Dialog.Title>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Huỷ</Button>
                                <Button onPress={() => {
                                    deleteBalcony(item.balconyId)
                                }}>Đồng ý</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
                <EditBalcony 
                balconyId={item.balconyId} 
                name={item.name} 
                image={item.image} 
                title="Sửa thông tin ban công" 
                onLoading={onLoading}
                isLoading={isLoading}
                visible={visibleEdit} onDismiss={hideDialogEdit}/>
            </Card.Content>
            <Card.Actions>
            </Card.Actions>
        </Card>
    )
}

export default Balcony

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