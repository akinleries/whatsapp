import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "../components/contactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createUserChatRoom, createChatRoom } from "../graphql/mutations";

const AddContactsToGroupScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const route = useRoute();

    const chatRoom = route.params.chatRoom;

    const navigation = useNavigation();

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            setUsers(result.data?.listUsers?.items?.filter(
                (item) =>
                    !chatRoom?.users?.items?.some(
                        (chatRoomUser) =>
                            !chatRoomUser._deleted && item.id === chatRoomUser.userId
                    )
            ));
        });
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Add To Group" disabled={selectedUserIds.length < 1} onPress={onAddToGroupPress} />
            ),
        });
    }, [selectedUserIds]);


    const onAddToGroupPress = async () => {

        await Promise.all(
            selectedUserIds.map((userId) =>
                API.graphql(
                    graphqlOperation(createUserChatRoom, {
                        input: { chatRoomId: chatRoom.id, userId },
                    })
                )
            )
        );


        setSelectedUserIds([]);
        navigation.goBack();
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

export default AddContactsToGroupScreen;