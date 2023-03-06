import { StyleSheet, Text, View, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Button, Dialog, MD2Colors, Portal, TextInput } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from '@env'
import axios from 'axios';
const EditBalcony = ({ name, image, visible, onDismiss, title, balconyId, onLoading, isLoading }) => {
    const [text, setText] = useState(name);
    const [i, setI] = useState(image);
    const [base, setBase] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChangeState = () => {
        onLoading(!isLoading)
    }
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });
        console.log(result);
        if (!result.canceled) {
            setI(result?.uri);
            setBase(result.base64);
        }
    };
    const edit = async () => {
        if (base != null) {
            onDismiss();
            setLoading(true);
            let base64Img = `data:image/jpg;base64,${base}`
            let apiUrl = 'https://api.cloudinary.com/v1_1/dwjvhoiin/image/upload';
            let data = {
                "file": base64Img,
                "upload_preset": "ms9qnepl",
            }
            fetch(apiUrl, {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(async r => {
                let data = await r.json()
                console.log(data)
                if (data.secure_url != null) {
                    const token = await AsyncStorage.getItem("token");
                    let rs = await axios.put(`${REACT_APP_BASE_URL}/balcony/update`, {
                        name: text,
                        balconyId: balconyId,
                        image: data.secure_url
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    console.log(rs.data);
                    handleChangeState()
                    setLoading(false)
                } else {
                    Alert.alert("Upload ảnh ko thành công")
                }
            }).catch(err => console.log(err))
        } else {
            onDismiss();
            const token = await AsyncStorage.getItem("token");
            let rs = await axios.put(`${REACT_APP_BASE_URL}/balcony/update`, {
                name: text,
                balconyId: balconyId,
                image: image
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log(rs.data);
            handleChangeState()
            setLoading(false)
        }
    }
    return (
        <View style={{ flex: 1 }}>
            {loading == true ? <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ top: -190 }} /> : null}
            <Portal>
                <Dialog visible={visible} onDismiss={onDismiss}>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            placeholder='Sửa tên'
                            style={{ backgroundColor: 'transparent' }}
                            numberOfLines={4}
                            maxLength={40}
                            value={text}
                            onChangeText={text => setText(text)}
                        />
                        <Image source={{ uri: i }} style={{ width: 200, height: 200, alignItems: 'center', marginTop: 10 }} />
                        <View>
                            <Button onPress={() => pickImage()} >Chọn ảnh</Button>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onDismiss}>Cancel</Button>
                        <Button onPress={() => { edit() }}>Edit</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

export default EditBalcony

const styles = StyleSheet.create({})