import { StyleSheet, TextInput, View, Image } from 'react-native'
import { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";
import * as ImagePicker from "expo-image-picker"
import { v4 as uuidv4 } from "uuid";

const InputBox = ({ chatroom }) => {

    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const onSend = async () => {

        const authUser = await Auth.currentAuthenticatedUser();

        const newMessage = {
            chatroomID: chatroom.id, text, userID: authUser.attributes.sub
        }
        if (image) {
            newMessage.images = [await uploadFile(image)];
            setImage(null);
        }

        const newMessageData = await API.graphql(graphqlOperation(createMessage, { input: newMessage }));

        setText('');

        await API.graphql(graphqlOperation(updateChatRoom, { input: { _version: chatroom._version, chatRoomLastMessageId: newMessageData.data.createMessage.id, id: chatroom.id } }))



    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
        }
    }


    const uploadFile = async (fileUri) => {
        try {
            const respone = await fetch(fileUri);
            const blob = await respone.blob();
            const key = `${uuidv4()}.png`;


            await Storage.put(key, blob, {
                contentType: "image/png",
            });

            return key;
        } catch (error) {
            console.log("error uploading file: ", error)
        }
    }





    return (
        <>
            {image && (
                <View>
                    <Image source={{ uri: image }} style={styles.selectedImage} resizeMode="contain" />
                    <MaterialIcons
                        name="highlight-remove"
                        onPress={() => setImage(null)}
                        size={20}
                        color="gray"
                        style={styles.removeSelectedImage}
                    />
                </View>
            )}
            <SafeAreaView edges={['bottom']} style={styles.container}>
                <AntDesign onPress={pickImage} name="plus" size={24} color="royalblue" />
                <TextInput value={text} onChangeText={setText} placeholder="type your message..." style={styles.input} />
                <MaterialIcons onPress={onSend} name="send" style={styles.send} size={16} color="white" />
            </SafeAreaView>
        </>
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
    },

    attachmentsContainer: {
        alignItems: "flex-end",
    },
    selectedImage: {
        height: 100,
        width: 200,
        margin: 5,
        left: 200
    },
    removeSelectedImage: {
        position: 'absolute',
        right: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',

    }

})