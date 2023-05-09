import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { onUpdateChatRoom } from '../../graphql/subscriptions';

dayjs.extend(relativeTime);


const ChatListItem = ({ chat }) => {

    const [user, setUser] = useState(null);
    const [chatRoom, setChatRoom] = useState(chat);


    const navigation = useNavigation();

    useEffect(() => {

        const fetchUser = async () => {
            const authUser = await Auth.currentAuthenticatedUser();

            const userItem = chatRoom?.users?.items.find((item) => item.user.id !== authUser.attributes.sub);

            setUser(userItem.user);
        }

        fetchUser();
    }, []);


    useEffect(() => {

        const subscription = API.graphql(graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chat.id } } })).subscribe({
            next: ({ value }) => {
                setChatRoom((chatRoom) => ({ ...(chatRoom || {}), ...value.data.onUpdateChatRoom }))
            },
            error: (err) => console.warn(err)
        });

        return () => subscription.unsubscribe();
    }, [chat.id])



    return (
        <Pressable onPress={() => navigation.navigate("Chat", { id: chatRoom.id, name: user?.name })} style={styles.container}>
            <Image
                source={{
                    uri: user?.image,
                }}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>{user?.name}</Text>
                    {chatRoom?.LastMessage && (
                        <Text style={styles.subtitle}>{dayjs(chatRoom?.LastMessage?.createdAt).fromNow(true)}</Text>
                    )}
                </View>
                <Text numberOfLines={2} style={styles.subtitle}>{chatRoom?.LastMessage?.text}</Text>
            </View>
        </Pressable>
    )
}

export default ChatListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: 10, marginVertical: 5, height: 70,
    },
    image: {
        width: 50, height: 50, borderRadius: 30, marginRight: 10,
    },
    content: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "lighgray",
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    name: {
        flex: 1,
        fontWeight: "bold",
    },
    subtitle: {
        color: "gray"
    }
})