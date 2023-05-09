import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "../../src/components/contactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { useNavigation } from "@react-navigation/native";
import { createUserChatRoom, createChatRoom } from "../graphql/mutations";

const ContactsScreen = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            setUsers(result.data?.listUsers?.items);
        });
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Create" disabled={!name || selectedUserIds.length < 1} onPress={onCreateGroupPress} />
            ),
        });
    }, [name, selectedUserIds]);


    const onCreateGroupPress = async () => {

        const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: {} }));

        if (!newChatRoomData.data?.createChatRoom) {
            console.log("Error creating the chat room")
        }

        const newChatRoom = newChatRoomData.data?.createChatRoom;


        await Promise.all(
            selectedUserIds.map((userId) =>
                API.graphql(
                    graphqlOperation(createUserChatRoom, {
                        input: { chatRoomId: newChatRoom.id, userId },
                    })
                )
            )
        );




        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(graphqlOperation(createUserChatRoom, { input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub } }));

        setSelectedUserIds([]);
        setName("");
        navigation.navigate('Chat', { id: newChatRoom.id });
    };

    const onContactPress = (id) => {
        setSelectedUserIds((userIds) => {
            if (userIds.includes(id)) {
                return [...userIds].filter((userId) => userId !== id)
            } else {
                return [...userIds, id];
            }
        })
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Group name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <ContactListItem user={item}
                        selectable
                        isSelected={selectedUserIds.includes(item.id)}
                        onPress={() => onContactPress(item.id)}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "white" },
    input: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "lightgray",
        padding: 10,
        margin: 10,
    },
});

export default ContactsScreen;