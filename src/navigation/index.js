import { View, Text } from 'react-native'
import ChatScreen from '../screens/ChatScreen';
import ChatsScreen from '../screens/ChatsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ContactsScreen from '../screens/ContactsScreen';

const Stack = createNativeStackNavigator();
const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'whitesmoke'}}}>
                <Stack.Screen name='home' component={MainTabNavigator} options={{ headerShown: false }}  />
                <Stack.Screen name="chat" component={ChatScreen} />
                <Stack.Screen name="contact" component={ContactsScreen} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator