import * as React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/config';

/**
 * ResetPasswordScreen.js
 * パスワード再設定画面
 */

export function ResetPasswordScreen({ route, navigation }) {
    const { token } = route.params || {};

    // State管理
    const [password, setPassword] = useState('');

    const handleResetPassword = async () => {
        try {
            // 【API通信】POST パスワード再設定
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/resetpassword/${token}`, {
                password
            },
                {
                    // Json形式に変換
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            console.log(response.data);

            // パスワード再設定画面に遷移
            navigation.navigate('StartScreen');

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentsContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>パスワード再設定画面</Text>
                </View>
                <View style={styles.mail}>
                    <Text style={styles.text}>パスワード:</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        placeholder="password"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleResetPassword}
                        style={styles.bottomButton}>
                        <Text style={styles.button}>設定</Text>
                    </TouchableOpacity>
                </View>
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