import React, {useEffect, useState} from 'react';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatList from './src/screens/ChatList';
import Chat from './src/screens/Chat';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import Settings from './src/screens/Settings';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider, Text} from 'react-native-paper';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './src/firebase/config';
import ChatIcon from './src/assets/icons/Chat';
import SettingsIcon from './src/assets/icons/Settings';
import {LogBox} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreAllLogs();
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'ChatList') {
            return <ChatIcon size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <SettingsIcon size={size} color={color} />;
          }
        },
      })}>
      <Tab.Screen name="ChatList" component={ChatList} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      }
    };

    checkAuthState();

    const unsubscribe = onAuthStateChanged(auth, async authUser => {
      if (authUser) {
        await AsyncStorage.setItem('user', JSON.stringify(authUser));
        setUser(authUser);
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Provider>
        <Stack.Navigator
          screenOptions={{
            headerBackTitle: 'Back',
          }}>
          {user ? (
            <>
              <Stack.Screen
                options={{headerShown: false}}
                name="Main"
                component={TabNavigator}
              />
              <Stack.Screen name="Chat" component={Chat} />
            </>
          ) : (
            <>
              <Stack.Screen
                options={{presentation: 'fullScreenModal'}}
                name="SignIn"
                component={SignIn}
              />
              <Stack.Screen
                options={{presentation: 'fullScreenModal'}}
                name="SignUp"
                component={SignUp}
              />
            </>
          )}
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
