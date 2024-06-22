import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../Screen/Profile';
import List from '../Screen/List';

const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="List" component={List} />
    </Stack.Navigator>
  );
}
export default MainStackNavigator;