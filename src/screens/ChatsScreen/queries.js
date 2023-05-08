export const listChatRooms = /* GraphQL */ `
    query GetUser ($id : ID!) {
  getUser(id: $id) {
    id
    ChatRooms {
      items {
        chatRoom {
          id
          updatedAt
          users {
            items {
              user {
                id
                image
                name
              }
            }
          }
          LastMessage {
            id
            createdAt
            text
          }
        }
      }
    }
  }
}

`;