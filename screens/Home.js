import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Chip, MD2Colors } from 'react-native-paper'

const Home = () => {
    const [data, setData] = useState([]);
    const renderItem = ({ item }) => 
    (<Chip style={styles.chip} onPress={() => console.log('Pressed' + item.id)}>{item.category}</Chip>)
    const fetchData=()=>{
        // fetch data
        const data=[
            {
                id:1,
                category:"ban công 1",
                numberOfTree:10
            },
            {
                id:2,
                category:"ban công 2",
                numberOfTree:11
            }
        ]
        setData(data);
    }
  return (
    <View>
      <View style={styles.rowContainer}>
        {isLoading ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <FlatList
          data={data}
          renderItem={renderItem}
          horizontal={true} />}
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    rowContainer: {
        top: 50,
        padding: 10,
        width: "90%"
      },
      chip: {
        marginRight:10
      }
})