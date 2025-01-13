import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * StartScreen.js
 * 初期画面
 */

export function StartScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.text}>ログイン</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={() => navigation.navigate('NewAccountScreen')}>
          <Text style={styles.text}>新規登録</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.text}>パスワードを忘れた方</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faedf4'
  },
  buttonContainer: {

  },
  button: {
    textAlign: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#8783a6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  text: {
    color: '#ece8f6',
    fontSize: 20,
    fontWeight: 'bold'
  }
});