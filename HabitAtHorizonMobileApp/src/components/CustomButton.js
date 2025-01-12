// src/components/CustomButton.js
import React from 'react';
import { Button } from 'react-native-paper';

const CustomButton = ({ onPress, title, color, style }) => (
  <Button
    mode="contained"
    onPress={onPress}
    style={[{ backgroundColor: color, marginBottom: 10 }, style]}
    labelStyle={{ color: 'white' }}>
    {title}
  </Button>
);

export default CustomButton;
