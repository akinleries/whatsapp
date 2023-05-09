import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';


dayjs.extend(relativeTime);


const ContactListItem = ({ user, onPress = () => { }, selectable = false, isSelected = false }) => {

    //const navigation = useNavigation();



    return (
        <Pressable
            onPress={onPress}
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

            {selectable && (
                isSelected ? (
                    <AntDesign name="checkcircle" size={24} color="royalblue" />
                ) : (
                    <FontAwesome name="circle-thin" size={24} color="lightgray" />
                )

            )}
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
        marginRight: 10,
    },
    subtitle: {
        color: "gray"
    }

})