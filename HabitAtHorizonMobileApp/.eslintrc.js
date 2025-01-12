module.exports = {
  root: true,
  parser: '@babel/eslint-parser', 
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['module:metro-react-native-babel-preset'],
    },
  },
  extends: '@react-native-community',
};
