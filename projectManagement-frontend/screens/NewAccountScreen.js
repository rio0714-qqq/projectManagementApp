import * as React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/config';

/**
 * NewAccountScreen.js
 * 新規登録画面
 */

export function NewAccountScreen({ navigation }) {
    // State管理
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 【API通信】POST 新規登録
    const handleRegister = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
                name,
                email,
                password,
                role: 'user',
            },
                {
                    // Json形式に変換
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            console.log(response.data);

            //登録成功で一度初期画面に戻る
            navigation.navigate('StartScreen');

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.contentsContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>新規登録画面</Text>
                </View>
                <View>
                    <Text style={styles.text}>ユーザー名:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="none"
                        placeholder="user name"
                    />
                </View>
                <View>
                    <Text style={styles.text}>メールアドレス:</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="email address"
                    />
                </View>
                <View>
                    <Text style={styles.text}>パスワード:</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholder="password"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>新規登録</Text>
                </TouchableOpacity>
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
        marginBottom: 10
      },
      title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#8783a6'
      },
      text: {
        fontWeight: 'bold',
        color: '#8783a6',
        fontSize: 15,
        marginBottom: 5
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
        marginTop: 22,
        borderColor: '#8783a6',
        backgroundColor: '#8783a6',
        padding: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
      },
      buttonText: {
        fontWeight: 'bold',
        color: '#ece8f6',
        fontSize: 20,
      }
});