import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';
import { getCommonChatRoomWithUser } from "../../services/chatRoomService";


dayjs.extend(relativeTime);


const ContactListItem = ({ user }) => {

    const navigation = useNavigation();

    const handlePress = async () => {
        console.warn("pressed")

        const existingChatRoom = await getCommonChatRoomWithUser(user.id);

        if (existingChatRoom) {
            navigation.navigate('Chat', { id: existingChatRoom.id });

            return;
        }

        const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: {} }));

        console.log(newChatRoomData);

        if (!newChatRoomData.data?.createChatRoom) {
            console.log("Error creating the chat room")
        }

        const newChatRoom = newChatRoomData.data?.createChatRoom;

        await API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomID: newChatRoom.id, userID: user.id } }));

        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomID: newChatRoom.id, userID: authUser.attributes.sub } }));

        navigation.navigate('Chat', { id: newChatRoom.id })
    }

    return (
        <Pressable
            onPress={handlePress}
            // onPress={() => navigation.navigate("chat", { id: chat.id, name: user.name })} 
            style={styles.container}>
            <Image
                source={{
                    uri: user.image,
                }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>{user.name}</Text>
                <Text numberOfLines={2} style={styles.subtitle}>{user.status}</Text>
            </View>
        </Pressable>
    )
}

export default ContactListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: 10, marginVertical: 5, height: 70, alignItems: 'center'
    },
    image: {
        width: 50, height: 50, borderRadius: 30, marginRight: 10,
    },
    name: {

        fontWeight: "bold",
    },

    content: {
        flex: 1,
    },
    subtitle: {
        color: "gray"
    }

})