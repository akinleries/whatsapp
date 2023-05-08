import { View, Text } from 'react-native'
import ChatScreen from '../screens/ChatScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ContactsScreen from '../screens/ContactsScreen';

const Stack = createNativeStackNavigator();
const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'whitesmoke'}}}>
                <Stack.Screen name='Home' component={MainTabNavigator} options={{ headerShown: false }}  />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Contact" component={ContactsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator