import { View, Text, FlatList } from 'react-native';
import chats from "../../../assets/data/chats.json";
import ChatListItem from '../../components/chatListItem';
import { graphqlOperation, API, Auth } from 'aws-amplify';
import { listChatRooms } from './queries';
import { useEffect, useState } from 'react';


const ChatsScreen = () => {

  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () => {

    const authUser = await Auth.currentAuthenticatedUser();

    const response = await API.graphql(graphqlOperation(listChatRooms, { id: authUser.attributes.sub }))

    setChatRooms(response.data.getUser.ChatRooms.items);
  }


  useEffect(() => {
    fetchChatRooms();
  }, [])

  return (
    <FlatList
      data={chatRooms}
      renderItem={({ item }) =>
        <ChatListItem chat={item.chatRoom}
        />
      }
    />
  );
}

export default ChatsScreen;  