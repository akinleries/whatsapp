import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';

dayjs.extend(relativeTime);


const ChatListItem = ({ chat }) => {

    const [user, setUser] = useState(null);


    const navigation = useNavigation();

    useEffect(() => {

        const fetchUser = async () => {
            const authUser = await Auth.currentAuthenticatedUser();

            const userItem = chat?.users?.items.find((item) => item.user.id !== authUser.attributes.sub);

            setUser(userItem.user);
        }

        fetchUser();
    }, [])



    return (
        <Pressable onPress={() => navigation.navigate("Chat", { id: chat.id, name: user?.name })} style={styles.container}>
            <Image
                source={{
                    uri: user?.image,
                }}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>{user?.name}</Text>
                    <Text style={styles.subtitle}>{dayjs(chat?.lastMessage?.createdAt).fromNow(true)}</Text>
                </View>
                <Text numberOfLines={2} style={styles.subtitle}>{chat?.lastMessage?.text}</Text>
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