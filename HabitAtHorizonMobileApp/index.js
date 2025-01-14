import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext'; 
import { name as appName } from './app.json';

const Main = () => (
  <PaperProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => Main);
