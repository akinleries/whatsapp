import { useState, useEffect } from 'react';
import { Text, FlatList, Pressable, } from 'react-native';
//import chats from "../../assets/data/chats.json";
import ContactListItem from '../components/contactListItem';
import { listUsers } from '../graphql/queries';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from '../graphql/mutations';
import { getCommonChatRoomWithUser } from "../services/chatRoomService";



const ContactsScreen = () => {

    const navigation = useNavigation();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((user) => {
            setUsers(user?.data?.listUsers?.items);
        })
    }, []);


    const createChatRoomWithUser = async (user) => {

        const existingChatRoom = await getCommonChatRoomWithUser(user.id);

        if (existingChatRoom) {
            navigation.navigate("Chat", { id: existingChatRoom.chatRoom.id });
            return;
        }

        const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: {} }));

        if (!newChatRoomData.data?.createChatRoom) {
            console.log("Error creating the chat room")
        }

        const newChatRoom = newChatRoomData.data?.createChatRoom;
       

        await API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomId: newChatRoom.id, userId: user.id } }));
      

        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub } }));

        navigation.navigate('Chat', { id: newChatRoom.id });
    }

    return (
        <FlatList
            data={users}
            renderItem={({ item }) =>
                <ContactListItem
                    user={item}
                    onPress={() => createChatRoomWithUser(item)}
                />

            }
            ListHeaderComponent={() => (
                <Pressable
                    onPress={() => navigation.navigate('New Group')}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 15,
                        paddingHorizontal: 20,
                    }}
                >
                    <MaterialIcons
                        name="group"
                        size={24}
                        color="royalblue"
                        style={{
                            marginRight: 20,
                            backgroundColor: "gainsboro",
                            padding: 7,
                            borderRadius: 20,
                            overflow: "hidden",
                        }}
                    />
                    <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
                </Pressable>
            )}
        />
    );
}

export default ContactsScreen;  