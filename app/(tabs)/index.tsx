import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';


export default function HomeScreen() {

  const [name, setName] = useState('John');
  const [list, setList] = useState([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Jim' },
    { id: 4, name: 'Jill' },
    { id: 5, name: 'Jack' },
    { id: 6, name: 'Jill' },
    { id: 7, name: 'Jack' },
    { id: 8, name: 'Jill' },
    { id: 9, name: 'Jack' },
    { id: 10, name: 'Jill' },
  ]);

  const handleChangeName = () => {
    setName('Jane');
  }

  const handleConsoleLog = (id: number) => {
    console.log(list.find((item) => item.id === id)?.name);
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={list} 
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleConsoleLog(item.id)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
  },
  header: {
    backgroundColor: 'red',
    padding: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'pink',
    padding: 20,
    marginTop: 10,
    width: '48%',
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
