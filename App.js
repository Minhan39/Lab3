import * as React from 'react';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import Root from './src/navigations/Root';
import {AuthProvider} from './src/context';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#eb4d68',
    secondary: 'yellow',
    surfaceVariant: '#E8E8E8',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </PaperProvider>
  );
}
