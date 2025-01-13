import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/config';

/**
 * ForgotPasswordScreen.js
 * パスワード再設定認証画面
 */

export function ForgotPasswordScreen({ navigation }) {
  // State管理
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);

    try {
      // 【API通信】POST パスワード忘れ
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/forgotpassword`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);

      if (response.data && response.data.resetUrl) {

        const resetUrl = response.data.resetUrl;
        const token = resetUrl.split('/').pop();
        console.log(token);

        navigation.navigate('ResetPasswordScreen', { token });
      } else {
        Alert.alert('エラー', 'パスワード再設定用のURLが取得できませんでした。');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('エラー', 'パスワード再設定リクエスト中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false); // 通信終了時にローディングを停止
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>パスワード再設定認証画面</Text>
        </View>
        <View style={styles.mail}>
          <Text style={styles.text}>メールアドレス:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="email address"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleForgotPassword}
            style={styles.bottomButton}>
            <Text style={styles.button}>次へ</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#8783a6" style={styles.loadingIndicator} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faedf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentsContainer: {
    width: '80%',
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8783a6'
  },
  mail: {

  },
  text: {
    fontWeight: 'bold',
    color: '#8783a6',
    fontSize: 15,
    marginBottom: 3
  },
  input: {
    borderColor: '#8783a6',
    borderWidth: 3,
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#ece8f6',
    color: '#8783a6',
    borderRadius: 3
  },
  button: {
    backgroundColor: '#8783a6',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ece8f6',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  bottomButton: {
    width: '100%',
    padding: 7,
    backgroundColor: '#8783a6',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 16,
  },
});

