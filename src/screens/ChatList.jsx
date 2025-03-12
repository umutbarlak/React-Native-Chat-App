import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  List,
  Avatar,
  Divider,
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
} from 'react-native-paper';
import {addDoc, collection, onSnapshot, query, where} from 'firebase/firestore';
import {db} from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlusIcon from '../assets/icons/PlusIcon';

const ChatList = ({navigation}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [chats, setChats] = useState([]);

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const createChat = async () => {
    if (!userEmail || !email.trim() || !isValidEmail(email)) {
      setError('Lütfen bir email giriniz!');
      return;
    }
    setIsLoading(true);

    try {
      const response = await addDoc(collection(db, 'chats'), {
        users: [userEmail, email],
      });
      setIsDialogVisible(false);

      console.log();
      navigation.navigate('Chat', {chatId: response.id});
    } catch (error) {
      setError(error.message);
      console.error('Error adding document: ', error);
    }
    setError('');
    setEmail('');
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setUserEmail(JSON.parse(storedUser).email); // JSON parse gerekebilir!
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('users', 'array-contains', userEmail));

    // Firestore'daki değişiklikleri anlık olarak dinle
    const unsubscribe = onSnapshot(q, snapshot => {
      setChats(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });

    // Bileşen unmount olursa dinleyiciyi kaldır
    return () => unsubscribe();
  }, [userEmail]);

  console.log(chats);

  return (
    <View style={styles.container}>
      {chats?.map(item => (
        <View key={item.id}>
          <List.Item
            onPress={() => navigation.navigate('Chat', {chatId: item.id})}
            title={item?.users[1]}
            description={
              item?.messages
                ? item?.messages[item?.messages.length - 1].text
                : ''
            }
            left={props => (
              <Avatar.Text label={item.users[1].split('')[0]} size={50} />
            )}
          />
          <Divider leftInset />
        </View>
      ))}

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => {
            setIsDialogVisible(false);
            setError('');
          }}>
          {error && (
            <Dialog.Content>
              <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
            </Dialog.Content>
          )}
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              onChangeText={text => setEmail(text)}
              mode="flat"
              label="Email"
              value={email}
              keyboardType="email-address"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase
              onPress={() => {
                setIsDialogVisible(false);
                setError('');
              }}>
              Cancel
            </Button>
            <Button loading={isLoading} uppercase onPress={createChat}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        onPress={() => setIsDialogVisible(true)}
        style={styles.fab}
        color="white"
        icon={() => <PlusIcon color="white" width={24} height={24} />}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 10},
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 30,
    backgroundColor: '#4F959D',
  },
});
