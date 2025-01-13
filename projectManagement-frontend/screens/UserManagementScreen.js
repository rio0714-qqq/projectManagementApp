import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import API_BASE_URL from '../config/config';
import { UserItemContainer } from '../components/UserListItems';

/**
 * UserManagementScreen.js
 * ユーザー管理画面
 */

export function UserManagementScreen({ route, navigation }) {
    const { token } = route.params || {};
    console.log("token", token);

    // State管理
    const [userInfo, setUserInfo] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    // ユーザー作成モーダル入力情報
    const [createValues, setCreateValues] = useState({
        name: '',
        role: '',
        email: '',
        password: ''
    });

    // roleステータスオプション
    const [statusOptions, setStatusOptions] = useState([
        { label: 'user', value: 'user' },
        { label: 'admin', value: 'admin' },
    ]);

    // ユーザ情報取得(全体)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                //【API通信】GET ユーザー情報取得
                const response = await axios.get(`${API_BASE_URL}/api/v1/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserInfo(response.data.data);
                console.log("ユーザー情報全権取得データ", response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, [token]);

    const handleChange = (field, value) => {
        setCreateValues(prev => ({
            ...prev,
            [field]: value
        }));
    };


    // 保存ボタンを押した処理
    const handleSave = async () => {
        try {
            //【API通信】POST ユーザー情報登録
            await axios.post(`${API_BASE_URL}/api/v1/users`, {
                name: createValues.name,
                role: createValues.role,
                email: createValues.email,
                password: createValues.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // ユーザーリストのリフレッシュ
            //【API通信】GET ユーザー情報取得
            const response = await axios.get(`${API_BASE_URL}/api/v1/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            setUserInfo(response.data.data);

            // モーダルを閉じる
            setCreateModalVisible(false);

        } catch (error) {
            console.error(error);
        }
    };

    // // データがない場合はnullを返す
    if (!userInfo) return null;

    const logout = () => {
        navigation.navigate('StartScreen');
    };

    const onUserCreatePress = () => {
        setCreateModalVisible(true);
    };

    const onCancel = () => {
        setCreateModalVisible(false);
    };

    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30,
            marginBottom: 15,
            height: 40,
            backgroundColor: '#ece8f6'
        },
        inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: 'purple',
            borderRadius: 8,
            color: 'black',
            paddingRight: 30,
            marginBottom: 15,
            backgroundColor: '#ece8f6',
            
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.contentsContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>ユーザー管理画面</Text>
                </View>
                <View style={styles.listItemContainer}>
                    <UserItemContainer token={token} items={userInfo} />
                </View>
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity onPress={onUserCreatePress}
                        style={styles.bottomButton}>
                        <Text style={styles.buttonText}>ユーザー登録</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout}
                        style={styles.bottomButton}>
                        <Text style={styles.buttonText}>ログアウト</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent={true}
                    visible={createModalVisible}
                    onRequestClose={() => setCreateModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                <View  style={styles.modalTitle}>
                                    <Text style={styles.modalTitleText}>ユーザー作成</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    value={createValues.name}
                                    onChangeText={(text) => handleChange('name', text)}
                                    placeholder="ユーザー名"
                                />
                                <RNPickerSelect
                                    items={statusOptions}
                                    style={pickerSelectStyles}
                                    dropDownStyle={styles.dropdownStyle}
                                    value={createValues.role}
                                    onValueChange={(value) => {
                                        handleChange('role', value);
                                    }}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={createValues.email}
                                    onChangeText={(text) => handleChange('email', text)}
                                    placeholder="メールアドレス"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={createValues.password}
                                    onChangeText={(text) => handleChange('password', text)}
                                    placeholder="パスワード"
                                />
                                <TouchableOpacity onPress={handleSave} style={styles.button}>
                                    <Text style={styles.buttonText}>保存</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onCancel} style={styles.button}>
                                    <Text style={styles.buttonText}>キャンセル</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faedf4',
        alignItems: 'center',
    },
    contentsContainer: {
        width: '80%',
        height: '90%'
    },
    titleContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        marginBottom: 12
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#8783a6'
    },
    buttonText: {
        backgroundColor: '#8783a6',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ece8f6',
        paddingBottom: 2
    },
    listItemContainer: {
        height: '85%'
    },
    bottomButton: {
        borderColor: '#8783a6',
        backgroundColor: '#8783a6',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flex: 2,
        margin: 5,
        paddingTop: 4
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        alignItems: 'center',
    },
    modalTitleText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#8783a6',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#ece8f6',
        color: '#8783a6',
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        padding: 10,
        backgroundColor: '#8783a6',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdownStyle: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
});
