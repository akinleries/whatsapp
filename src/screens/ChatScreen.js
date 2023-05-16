import { StyleSheet, ImageBackground, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import bg from "../../assets/images/BG.png";
import Message from '../components/message';
//import messages from "../../assets/data/messages.json";
import InputBox from '../components/InputBox';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { graphqlOperation, API, Auth } from 'aws-amplify';
import { getChatRoom, listMessagesByChatRoom } from './../graphql/queries';
import { ActivityIndicator } from 'react-native';
import { onCreateMessage, onUpdateChatRoom } from "../graphql/subscriptions";
import { Feather } from '@expo/vector-icons';


const ChatScreen = () => {

    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);


    const route = useRoute();
    const navigation = useNavigation();

    const chatroomID = route.params.id;


    useEffect(() => {

        API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then((result) => setChatRoom(result.data?.getChatRoom));

        const subscription = API.graphql(graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatroomID } } })).subscribe({
            next: ({ value }) => {
                setChatRoom((chatRoom) => ({ ...(chatRoom || {}), ...value.data.onUpdateChatRoom }))
            },
            error: (err) => console.warn(err)
        });

        return () => subscription.unsubscribe();
    }, [chatroomID]);

    useEffect(() => {
        API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID, sortDirection: "DESC" })).then((result) => {
            setMessages(result.data?.listMessagesByChatRoom?.items)
        });


        const subscription = API.graphql(graphqlOperation(onCreateMessage, { filter: { chatroomID: { eq: chatroomID } } })).subscribe({
            next: ({ value }) => {
                setMessages((message) => [...message, value.data.onCreateMessage])
            },
            error: (err) => console.warn(err)
        });

        return () => subscription.unsubscribe();
    }, [chatroomID]);




    useEffect(() => {
        navigation.setOptions({
            title: route.params.name, headerRight: () => (
                <Feather onPress={() => navigation.navigate("Group Info", { id: chatroomID })} name="more-vertical" size={24} color="gray" />
            )
        });
    }, [route.params.name]);

    if (!chatRoom) {
        return <ActivityIndicator />
    }

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

                <InputBox chatroom={chatRoom} />

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