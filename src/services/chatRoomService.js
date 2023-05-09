import { graphqlOperation, API, Auth } from 'aws-amplify';


export const listChatRooms = /* GraphQL */ `
query GetUser ($id : ID!) {
  getUser(id: $id) {
    id
    ChatRooms {
      items {
        chatRoom {
          id
          users {
            items {
              user {
                id
              }
            }
          }
        }
      }
    }
  }
}

`;


export const getCommonChatRoomWithUser = async (userID) => {

  const authUser = await Auth.currentAuthenticatedUser();

  const response = await API.graphql(graphqlOperation(listChatRooms, { id: authUser.attributes.sub }));

  const chatRooms = response?.data?.getUser?.items || [];

  const chatRoom = chatRooms.find((chatRoomItem) => {
    return (
      chatRoomItem.chatRoom.users.items.length === 2 &&
      chatRoomItem.chatRoom.users.items.some((userItem) => userItem.user.id === userID)
    )
  });

  return chatRoom;
};



