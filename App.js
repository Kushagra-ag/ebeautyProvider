import 'react-native-gesture-handler';
import React from 'react';
import AppNavigator from './src/routes/index.js';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

export default function App() {
  return (
  	<ActionSheetProvider>
    	<AppNavigator />
    </ActionSheetProvider>
  );
}