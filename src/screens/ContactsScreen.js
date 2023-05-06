import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import chats from "../../assets/data/chats.json";
import ContactListItem from '../components/contactListItem';
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries';


const ContactsScreen = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((user) => {
            setUsers(user.data?.listUsers?.items);
        })
    }, []);

    return (
        <FlatList
            data={users}
            renderItem={({ item }) =>
                <ContactListItem user={item}
                />
            }
        />
    );
}

export default ContactsScreen;  