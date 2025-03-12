import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {auth, db} from '../firebase/config';
import {onAuthStateChanged} from 'firebase/auth';
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {SafeAreaView} from 'react-native';

const Chat = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [uid, setUID] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (user) {
        setUID(user.uid);
        setName(user.displayName);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!route.params.chatId) return;

    const chatRef = doc(db, 'chats', route.params.chatId);
    const unsubscribe = onSnapshot(chatRef, snapshot => {
      if (snapshot.exists()) {
        const chatData = snapshot.data();
        setMessages(
          chatData.messages
            ? chatData.messages
                .map(msg => ({
                  ...msg,
                  createdAt: msg.createdAt.toDate(),
                }))
                .sort((a, b) => b.createdAt - a.createdAt)
            : [],
        );
      }
    });

    return () => unsubscribe();
  }, [route.params.chatId]);

  const onSend = useCallback(
    async (newMessages = []) => {
      if (!route.params.chatId) return;

      const message = newMessages[0];

      const chatRef = doc(db, 'chats', route.params.chatId);

      await setDoc(
        chatRef,
        {
          messages: arrayUnion({
            _id: message._id,
            text: message.text,
            createdAt: new Date(),
            user: message.user,
          }),
        },
        {merge: true},
      );

      // await updateDoc(chatRef, {
      //   messages: arrayUnion({
      //     _id: message._id,
      //     text: message.text,
      //     createdAt: new Date(),
      //     user: message.user,
      //   }),
      // });
    },
    [route.params.chatId],
  );

  console.log(messages);

  return (
    <SafeAreaView style={{flex: 1}}>
      <GiftedChat
        textInputStyle={{
          margin: 0,
        }}
        messages={messages}
        onSend={message => onSend(message)}
        user={{
          _id: uid,
          name: name,
        }}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

export default Chat;
