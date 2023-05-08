import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigator from './src/navigation';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify'
import awsconfig from './src/aws-exports'
import { withAuthenticator } from "aws-amplify-react-native";
import { useEffect } from "react";
import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';


Amplify.configure({ ...awsconfig, Analytics: { disabled: true } })


function App() {

  const syncUsers = async () => {
    
    const authUser = await Auth.currentAuthenticatedUser({ bypassCache: true });

    const userData = await API.graphql(graphqlOperation(getUser, { id: authUser.attributes.sub }));

    if (userData.data.getUser) {
      console.log("User alreaady exist");
      return;

    }

    const newUser = {
      id: authUser.attributes.sub,
      name: authUser.attributes.phone_number,
      status: "Hey ! there i'm using whatsapp",
    }

    await API.graphql(graphqlOperation(createUser, { input: newUser }));
  };


  useEffect(() => {
    syncUsers();
  }, [])


  return (
    <View style={styles.container}>

      <Navigator />


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',

  },
});

export default withAuthenticator(App);
