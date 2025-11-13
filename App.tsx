import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Menu from './menu';

type MenuItem = {
  id: string;
  dishName: string;
  description: string;
  course: string;
  price: string;
};

type RootStackParamList = {
  Home: undefined;
  Menu: { menuItems: MenuItem[]; onUpdateMenu: (items: MenuItem[]) => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  const addDish = () => {
    if (!dishName.trim()) return;
    const newItem: MenuItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course: course.trim() || 'Main',
      price: price.trim() || '0.00',
    };
    setMenuItems((s) => [newItem, ...s]);
    setDishName(''); setDescription(''); setCourse(''); setPrice('');
  };

  const deleteDish = (id: string) => {
    setMenuItems((items) => items.filter(item => item.id !== id));
  };

  const updateMenuItems = (updatedItems: MenuItem[]) => {
    setMenuItems(updatedItems);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('./assets/logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Christoffel's Restaurant</Text>
      </View>

      <Text style={styles.sectionTitle}>Add New Dish</Text>

      <TextInput style={styles.input} placeholder="Dish name" value={dishName} onChangeText={setDishName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Course (e.g. Starter/Main/Dessert)" value={course} onChangeText={setCourse} />
      <TextInput style={styles.input} placeholder="Price (e.g. 49.99)" value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Pressable style={styles.addButton} onPress={addDish}>
        <Text style={styles.addText}>Add Dish</Text>
      </Pressable>

      <Pressable
        style={styles.viewButton}
        onPress={() => navigation.navigate('Menu', { 
          menuItems, 
          onUpdateMenu: updateMenuItems 
        })}
      >
        <Text style={styles.viewText}>View Menu ({menuItems.length})</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Current Dishes</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.listTitle}>{item.dishName} — R{item.price}</Text>
              <Pressable 
                style={styles.deleteButton}
                onPress={() => deleteDish(item.id)}
              >
                <Text style={styles.deleteText}>×</Text>
              </Pressable>
            </View>
            <Text style={styles.listSub}>{item.course} · {item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No dishes added yet.</Text>}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Manage Dishes' }} />
        <Stack.Screen name="Menu" component={Menu} options={{ title: 'Menu' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { width: 40, height: 40, marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 8 },
  addButton: { backgroundColor: '#074734', padding: 12, borderRadius: 8, marginBottom: 8 },
  addText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  viewButton: { backgroundColor: '#1166d6', padding: 12, borderRadius: 8, marginBottom: 12 },
  viewText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  listItem: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listTitle: { fontWeight: '700', flex: 1 },
  listSub: { color: '#555' },
  empty: { textAlign: 'center', color: '#777', marginTop: 20 },
  deleteButton: { backgroundColor: '#ff4444', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});