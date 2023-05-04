import { StyleSheet, ImageBackground, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import bg from "../../assets/images/BG.png";
import Message from '../components/message';
import messages from "../../assets/data/messages.json";
import InputBox from '../components/InputBox';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const ChatScreen = () => {

    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 90} style={styles.bg}>
            <ImageBackground source={bg} style={styles.bg}>

                <FlatList
                    data={messages}
                    renderItem={({ item }) =>
                        <Message message={item} />}
                    style={styles.list}
                    inverted
                />
                <InputBox />

            </ImageBackground>
        </KeyboardAvoidingView>


    )
}

export default ChatScreen

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    }, list: {
        padding: 10,
    }
})