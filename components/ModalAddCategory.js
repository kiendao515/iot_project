import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Dialog, Portal } from 'react-native-paper'
import Button from './Button';
const ModalAddCategory = ({ show, toggleShow,addCategory }) => {
    const [category, setCategory] = useState("");
    const hideDialog = () => setVisible(false);
    return (
        <Portal>
            <Dialog visible={show} onDismiss={toggleShow}>
                <Dialog.Title style={styles.title}>Create new category</Dialog.Title>
                <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                            <TextInput
                                label="Input your category"
                                value={category}
                                multiline
                                numberOfLines={10}
                                mode="outlined"
                                placeholder='Input here'
                                onChangeText={text => setCategory(text)}>
                            </TextInput>
                        </ScrollView>
                    </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={toggleShow}>Cancel</Button>
                    <Button onPress={()=>addCategory(category)}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default ModalAddCategory

const styles = StyleSheet.create({})