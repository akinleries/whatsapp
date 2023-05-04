import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';

dayjs.extend(relativeTime);


const ChatListItem = ({ chat }) => {

    const navigation = useNavigation();

    return (
        <Pressable onPress={() => navigation.navigate("chat", { id: chat.id, name: chat.user.name })} style={styles.container}>
            <Image
                source={{
                    uri: chat.user.image,
                }}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>{chat.user.name}</Text>
                    <Text style={styles.subtitle}>{dayjs(chat.lastMessage.createdAt).fromNow(true)}</Text>
                </View>
                <Text numberOfLines={2} style={styles.subtitle}>{chat.lastMessage.text}</Text>
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