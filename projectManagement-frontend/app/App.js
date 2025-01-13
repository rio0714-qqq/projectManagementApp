import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StartScreen } from '../screens/StartScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { NewAccountScreen } from '../screens/NewAccountScreen';
import { CaseManagementScreen } from '../screens/CaseManagementScreen';
import { UserCaseManagementScreen } from '../screens/UserCaseManagementScreen';
import { UserManagementScreen } from '../screens/UserManagementScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';

import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"StartScreen"}>
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            title: 'LoginScreen',
            headerStyle: {
              backgroundColor: '#8783a6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="NewAccountScreen"
          component={NewAccountScreen} 
          options={{
            title: 'NewAccountScreen',
            headerStyle: {
              backgroundColor: '#8783a6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen 
          name="CaseManagementScreen"
          component={CaseManagementScreen}
          options={{
            title: 'ProjectManagementScreen',
            headerStyle: {
              backgroundColor: '#8783a6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen 
          name="UserCaseManagementScreen"
          component={UserCaseManagementScreen}
          options={{
            title: 'UserProjectManagementScreen',
            headerStyle: {
              backgroundColor: '#8783a6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen 
          name="UserManagementScreen" 
          component={UserManagementScreen} 
          options={{
            title: 'UserManagementScreen',
            headerStyle: {
              backgroundColor: '#8783a6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen 
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{
            title: 'ForgotPasswordScreen',
            headerStyle: {
              backgroundColor: '#8783a6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen 
          name="ResetPasswordScreen" 
          component={ResetPasswordScreen}
          options={{
            title: 'ResetPasswordScreen',
            headerStyle: {
              backgroundColor: '#8783a6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;