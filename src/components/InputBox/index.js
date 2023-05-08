import { StyleSheet, TextInput } from 'react-native'
import { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";

const InputBox = ({ chatroom }) => {

    const [text, setText] = useState('');

    const onSend = async () => {

        const authUser = await Auth.currentAuthenticatedUser();

        const newMessage = {
            chatroomID: chatroom.id, text, userID: authUser.attributes.sub
        }

        const newMessageData = await API.graphql(graphqlOperation(createMessage, { input: newMessage }));

        setText('');

        await API.graphql(graphqlOperation(updateChatRoom, { input: { _version: chatroom._version, chatRoomLastMessageId: newMessageData.data.createMessage.id, id: chatroom.id } }))



    };


    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <AntDesign name="plus" size={24} color="royalblue" />
            <TextInput value={text} onChangeText={setText} placeholder="type your message..." style={styles.input} />
            <MaterialIcons onPress={onSend} name="send" style={styles.send} size={16} color="white" />
        </SafeAreaView>
    )
}

export default InputBox

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        paddingTop: 6,
        paddingHorizontal: 10,
        alignItems: 'center',

    },

    input: {
        flex: 1,
        height: 35,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 50,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth,
        fontSize: 15,

    },
    send: {
        backgroundColor: 'royalblue',
        padding: 7,
        borderRadius: 15,
        overflow: 'hidden'
    }
})