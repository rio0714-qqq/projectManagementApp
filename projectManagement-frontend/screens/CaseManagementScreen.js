import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import API_BASE_URL from '../config/config';
import { ItemContainer } from '../components/ListItems';

/**
 * CaseManagementScreen.js
 * 案件管理画面
 */

export function CaseManagementScreen({ route, navigation }) {
    const { loginResData } = route.params || {};
    console.log("loginResData", loginResData);

    // State管理
    const [userInfo, setUserInfo] = useState(null);
    const [projectsInfo, setProjectsInfo] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    // 案件作成モーダル入力情報 登録前
    const [createValues, setCreateValues] = useState({
        name: '',
        customer: '',
        skills: '',
        description: '',
        status: '',
        assignees: '', // メンバー名のカンマ区切り文字列
    });


    // ステータスオプション
    const [statusOptions, setStatusOptions] = useState([
        { label: '新規', value: '新規' },
        { label: '提案中', value: '提案中' },
        { label: '発注待ち', value: '発注待ち' },
        { label: '受注済', value: '受注済' },
        { label: '失注', value: '失注' },
        { label: '継続', value: '継続' },
        { label: '確認中', value: '確認中' },
    ]);


    // ユーザー情報取得(個人)
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 【API通信】GET ユーザー情報取得
                const response = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginResData.token}`
                    }
                });
                setUserInfo(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserInfo();
    }, [loginResData.token]);


    // ユーザ情報取得(全体)
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // 【API通信】GET ユーザー情報取得
                const response = await axios.get(`${API_BASE_URL}/api/v1/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginResData.token}`
                    }
                });
                setUsers(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, [loginResData.token]);

    // 案件情報取得
    useEffect(() => {
        const fetchProjectsInfo = async () => {
            try {
                // 【API通信】GET 案件情報取得
                const response = await axios.get(`${API_BASE_URL}/api/v1/projects`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginResData.token}`
                    }
                });
                setProjectsInfo(response.data.data);
                console.log("案件全件取得データ", response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProjectsInfo();
    }, [loginResData.token]);


    const handleChange = (field, value) => {
        setCreateValues(prev => ({
            ...prev,
            [field]: value
        }));
    };


    // 保存ボタンを押した処理
    const handleSave = async () => {
        const assigneesArray = createValues.assignees.split(',').map(name => {
            const user = users.find(user => user.name === name.trim());
            return user ? user._id : null;
        }).filter(id => id !== null);

        try {
            // 【API通信】POST 案件情報登録
            await axios.post(`${API_BASE_URL}/api/v1/projects`, {
                name: createValues.name,
                customer: createValues.customer,
                skills: createValues.skills,
                description: createValues.description,
                status: createValues.status,
                assignees: assigneesArray
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginResData.token}`
                }
            });

            // プロジェクトリストのリフレッシュ
            // 【API通信】GET 案件情報取得
            const response = await axios.get(`${API_BASE_URL}/api/v1/projects`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginResData.token}`
                }
            });

            setProjectsInfo(response.data.data);

            // モーダルを閉じる
            setCreateModalVisible(false);

        } catch (error) {
            console.error(error);
        }
    };

    // データがない場合はnullを返す
    if (!userInfo || !projectsInfo) return null;

    const logout = () => {
        navigation.navigate('StartScreen');
    };

    const onProjectCreatePress = () => {
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
                    <Text style={styles.title}>案件管理画面</Text>
                </View>
                <View style={styles.auth}>
                    <Text style={styles.text}>ユーザ名: {userInfo.name}</Text>
                    <Text style={styles.text}>ユーザ権限: {userInfo.role}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('UserManagementScreen', { token: loginResData.token })}
                    style={styles.authButton}>
                    <Text style={styles.buttonText}>ユーザ管理</Text>
                </TouchableOpacity>
                <View style={styles.listItemContainer}>
                    <ItemContainer token={loginResData.token} role={userInfo.role} items={projectsInfo} />
                </View>
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity onPress={onProjectCreatePress}
                        style={styles.bottomButton}>
                        <Text style={styles.buttonText}>案件登録</Text>
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
                                <View style={styles.modalTitle}>
                                    <Text style={styles.modalTitleText}>案件作成</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    value={createValues.name}
                                    onChangeText={(text) => handleChange('name', text)}
                                    placeholder="案件名"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={createValues.customer}
                                    onChangeText={(text) => handleChange('customer', text)}
                                    placeholder="顧客企業"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={createValues.skills}
                                    onChangeText={(text) => handleChange('skills', text)}
                                    placeholder="スキル (カンマ区切り)"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={createValues.description}
                                    onChangeText={(text) => handleChange('description', text)}
                                    placeholder="詳細"
                                />
                                <RNPickerSelect
                                    items={statusOptions}
                                    style={pickerSelectStyles}
                                    dropDownStyle={styles.dropdownStyle}
                                    value={createValues.status}
                                    onValueChange={(value) =>
                                        handleChange('status', value)
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    value={createValues.assignees}
                                    onChangeText={(text) => handleChange('assignees', text)}
                                    placeholder="メンバー名 (カンマ区切り)"
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

    text: {
        fontWeight: 'bold',
        color: '#8783a6',
        fontSize: 15,
        marginBottom: 3
    },
    authButton: {
        marginTop: 3,
        borderColor: '#8783a6',
        backgroundColor: '#8783a6',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginBottom: 10
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
        height: '70%'
    },
    bottomButton: {
        borderColor: '#8783a6',
        backgroundColor: '#8783a6',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flex: 2,
        margin: 5
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        padding: 5,
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
