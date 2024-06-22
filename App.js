import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './src/Component/Navigation/MainStack';

const App = () => {
  return (

    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  )
}

export default App