import { StyleSheet, TextInput } from 'react-native'
import { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const InputBox = () => {

    const [newMessage, setNewMessage] = useState('');

    const onSend = () => {
        console.warn("Sending");

        setNewMessage('');

    };


    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <AntDesign name="plus" size={24} color="royalblue" />
            <TextInput value={newMessage} onChangeText={setNewMessage} placeholder="type your message..." style={styles.input} />
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