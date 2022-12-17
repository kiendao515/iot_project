import { FlatList, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Badge, Button, Card, Chip, IconButton, MD2Colors, MD3Colors, Paragraph, Text, Title } from 'react-native-paper'


const Dashboard = () => {
  const [data, setData] = useState([]);
  const [content,setContent]= useState([])
  const [isLoading, setIsLoading] = useState(true);
  const renderItem = ({ item }) =>
  (<Chip mode='outlined' style={styles.chip} onPress={() => console.log('Pressed' + item.id)}>
    {item.category}
  </Chip>)
  const renderContent = ({ item }) => (
    <Card style={styles.card}>
    <Card.Cover source={{ uri: item.image }} />
    <Card.Content>
      <Title>{item.title}</Title>
      <View style={{ flexDirection: 'row' ,marginLeft:-20}}>
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="thermometer" size={20}>
          </IconButton>
          <Text style={styles.temperature}>{item.temperature}</Text>
        </View>
        <View style={{flexDirection:'row',width:'50%'}}>
          <IconButton icon="water-outline" size={20}>
          </IconButton>
          <Text style={styles.temperature}>{item.humidity}</Text>
        </View>
      </View>
    </Card.Content>
  </Card>
  )
  const fetchData = () => {
    setIsLoading(false);
    // fetch data
    const data = [
      {
        id: 1,
        category: "ban công 1",
        numberOfTree: 10
      },
      {
        id: 2,
        category: "ban công 2",
        numberOfTree: 11
      },
      {
        id: 3,
        category: "ban công 3",
        numberOfTree: 11
      },
      {
        id: 4,
        category: "ban công 4",
        numberOfTree: 11
      },
      {
        id: 5,
        category: "ban công 5",
        numberOfTree: 11
      }
    ]
    const content = [
      {
        id: 1,
        image: 'https://picsum.photos/700',
        title: 'cây số 1',
        temperature:20,
        humidity:20
      },
      {
        id: 2,
        image: 'https://picsum.photos/800',
        title: 'cây số 2',
        temperature:10,
        humidity:10
      }
    ]
    setData(data);
    setContent(content);
  }
  if (isLoading) {
    fetchData();
  }
  return (
    <View>
      <View style={styles.rowContainer}>
        <View style={styles.header}>
          <Text style={styles.textHeader} variant="headlineSmall">Home</Text>
          <IconButton style={styles.textIcon}
            icon="plus-circle-outline"
            size={20}
            onPress={() => console.log('Pressed')}
          />
        </View>
        {isLoading ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <FlatList
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          horizontal={true} />}
        <View style={styles.content}>
          <FlatList
          data={content}
          renderItem={renderContent}
          showsVerticalScrollIndicator={false}/>
        </View>
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
    marginTop: 20
  },
  card: {
    padding: 0,
    marginBottom: 20
  },
  temperature: {
    top: 15,
    marginLeft:-10
  }
})