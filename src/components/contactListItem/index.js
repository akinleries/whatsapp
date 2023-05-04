import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';

dayjs.extend(relativeTime);


const ContactListItem = ({ user }) => {

    const navigation = useNavigation();

    return (
        <Pressable onPress={() => navigation.navigate("chat", { id: chat.id, name: user.name })} style={styles.container}>
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

},
subtitle: {
    color: "gray"
}

})