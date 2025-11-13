import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MenuItem = {
  id: string;
  dishName: string;
  description: string;
  course: string;
  price: string;
};

type MenuProps = {
  route?: { 
    params?: { 
      menuItems?: MenuItem[];
      onUpdateMenu?: (items: MenuItem[]) => void;
    } 
  };
  navigation?: {
    goBack?: () => void;
    navigate?: (screen: string, params?: Record<string, any>) => void;
    popToTop?: () => void;
  };
};

export default function Menu({ route, navigation }: MenuProps) {
  const menuItems = route?.params?.menuItems ?? [];
  const onUpdateMenu = route?.params?.onUpdateMenu;
  
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'course'>('name');
  const [filterBy, setFilterBy] = useState<string>('All');
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState({ dishName: '', description: '', course: '', price: '' });

  
  const courses = ['All', ...new Set(menuItems.map(item => item.course))];

 
  const filteredAndSortedItems = menuItems
    .filter(item => filterBy === 'All' || item.course === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.dishName.localeCompare(b.dishName);
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'course':
          return a.course.localeCompare(b.course);
        default:
          return 0;
      }
    });

  const deleteItem = (id: string) => {
    if (onUpdateMenu) {
      const updatedItems = menuItems.filter(item => item.id !== id);
      onUpdateMenu(updatedItems);
    }
  };

  const startEditing = (item: MenuItem) => {
    setEditingItem(item);
    setEditForm({
      dishName: item.dishName,
      description: item.description,
      course: item.course,
      price: item.price
    });
    setManageModalVisible(true);
  };

  const saveEdit = () => {
    if (editingItem && onUpdateMenu) {
      const updatedItems = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...editForm }
          : item
      );
      onUpdateMenu(updatedItems);
      setManageModalVisible(false);
      setEditingItem(null);
    }
  };

  const cancelEdit = () => {
    setManageModalVisible(false);
    setEditingItem(null);
    setEditForm({ dishName: '', description: '', course: '', price: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Image 
          source={require('./assets/logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Christoffel's Menu </Text>
      </View>

      
      <View style={styles.controls}>
        <Pressable 
          style={styles.controlButton}
          onPress={() => setManageModalVisible(true)}
        >
          <Text style={styles.controlText}>Manage Menu</Text>
        </Pressable>
        
        <Pressable 
          style={styles.controlButton}
          onPress={() => navigation?.goBack?.()}
        >
          <Text style={styles.controlText}>Back to Add</Text>
        </Pressable>
      </View>

      
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <View style={styles.filterRow}>
          {(['name', 'price', 'course'] as const).map((option) => (
            <Pressable
              key={option}
              style={[styles.filterButton, sortBy === option && styles.activeFilter]}
              onPress={() => setSortBy(option)}
            >
              <Text style={[styles.filterText, sortBy === option && styles.activeFilterText]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.filterLabel}>Filter by course:</Text>
        <View style={styles.filterRow}>
          {courses.map((course) => (
            <Pressable
              key={course}
              style={[styles.filterButton, filterBy === course && styles.activeFilter]}
              onPress={() => setFilterBy(course)}
            >
              <Text style={[styles.filterText, filterBy === course && styles.activeFilterText]}>
                {course}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      
      {filteredAndSortedItems.length === 0 ? (
        <Text style={styles.empty}>No dishes found.</Text>
      ) : (
        <FlatList
          data={filteredAndSortedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.dishName}>{item.dishName}</Text>
                <Pressable 
                  style={styles.deleteButton}
                  onPress={() => deleteItem(item.id)}
                >
                  <Text style={styles.deleteText}>×</Text>
                </Pressable>
              </View>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>R{item.price}</Text>
              <Pressable 
                style={styles.editButton}
                onPress={() => startEditing(item)}
              >
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
          )}
        />
      )}

      
      <Modal
        visible={manageModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Dish' : 'Manage Menu'}
            </Text>

            {editingItem ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Dish Name"
                  value={editForm.dishName}
                  onChangeText={(text) => setEditForm({...editForm, dishName: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={editForm.description}
                  onChangeText={(text) => setEditForm({...editForm, description: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Course"
                  value={editForm.course}
                  onChangeText={(text) => setEditForm({...editForm, course: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={editForm.price}
                  onChangeText={(text) => setEditForm({...editForm, price: text})}
                  keyboardType="numeric"
                />
                
                <View style={styles.modalButtons}>
                  <Pressable style={styles.saveButton} onPress={saveEdit}>
                    <Text style={styles.saveText}>Save</Text>
                  </Pressable>
                  <Pressable style={styles.cancelButton} onPress={cancelEdit}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.stats}>
                  Total Dishes: {menuItems.length}
                </Text>
                <Text style={styles.stats}>
                  Courses: {courses.length - 1}
                </Text>
                
                <View style={styles.modalButtons}>
                  <Pressable style={styles.closeButton} onPress={cancelEdit}>
                    <Text style={styles.closeText}>Close</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { width: 40, height: 40, marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  controlButton: { backgroundColor: '#666', padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 4 },
  controlText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  filterSection: { marginBottom: 16 },
  filterLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  filterButton: { 
    backgroundColor: '#f0f0f0', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    marginRight: 8, 
    marginBottom: 8 
  },
  activeFilter: { backgroundColor: '#074734' },
  filterText: { color: '#333', fontSize: 12 },
  activeFilterText: { color: '#fff' },
  card: { 
    backgroundColor: '#f9f9f9', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#074734'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  dishName: { fontSize: 18, fontWeight: '700', flex: 1 },
  course: { 
    color: '#074734', 
    fontWeight: '600', 
    fontSize: 12, 
    textTransform: 'uppercase',
    marginBottom: 4 
  },
  description: { color: '#666', marginBottom: 8, fontStyle: 'italic' },
  price: { fontSize: 16, fontWeight: '700', color: '#074734' },
  empty: { textAlign: 'center', color: '#777', marginTop: 40, fontSize: 16 },
  deleteButton: { 
    backgroundColor: '#ff4444', 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  deleteText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  editButton: { 
    backgroundColor: '#1166d6', 
    padding: 8, 
    borderRadius: 6, 
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  editText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    width: '90%', 
    maxWidth: 400 
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12,
    fontSize: 16
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  saveButton: { backgroundColor: '#074734', padding: 12, borderRadius: 8, flex: 1, marginRight: 8 },
  saveText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  cancelButton: { backgroundColor: '#666', padding: 12, borderRadius: 8, flex: 1, marginLeft: 8 },
  cancelText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  closeButton: { backgroundColor: '#074734', padding: 12, borderRadius: 8, flex: 1 },
  closeText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  stats: { fontSize: 16, marginBottom: 8, textAlign: 'center' },
});
