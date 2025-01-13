import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import API_BASE_URL from '../config/config';

/**
 * UserEdit.js
 * ユーザー編集モーダル処理
 */

const UserEdit = ({ visible, userId, onCancel, onSaveSuccess, token }) => {
    const [editValues, setEditValues] = useState({
        _id: '',
        name: '',
        role: '',
        email: '',
    });

    // roleステータスオプション
    const [statusOptions, setStatusOptions] = useState([
        { label: 'user', value: 'user' },
        { label: 'admin', value: 'admin' },
    ]);

    const [statusValue, setStatusValue] = useState("");

    // 初期値の設定 (モーダルが表示されるたびに実行)
    useEffect(() => {
        if (visible && userId) {
            const initialStatusValue = userId.role || '';
            setEditValues({
                _id: userId._id || '',
                name: userId.name || '',
                role: userId.role || '',
                email: userId.email || '',
            });
            setStatusValue(initialStatusValue);
            console.log("statusValue", statusValue);
        }
    }, [visible, userId]);

    const handleSave = async () => {
        try {
            const updatedUser = {
                _id: editValues._id,
                name: editValues.name,
                role: editValues.role,
                email: editValues.email,
            };
            // 【API通信】PUT ユーザー編集
            const fixUserResponse = await axios.put(`${API_BASE_URL}/api/v1/users/${editValues._id}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (fixUserResponse.data) {
                onSaveSuccess(fixUserResponse.data);
            }
        } catch (error) {
            console.error('更新失敗', error);
        }
    };

    const handleChange = (field, value) => {
        setEditValues(prev => ({
            ...prev,
            [field]: value
        }));
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
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.modalTitle}>
                            <Text style={styles.modalTitleText}>ユーザー編集</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={editValues.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholder="ユーザー名"
                        />
                        <RNPickerSelect
                            items={statusOptions}
                            defaultValue={statusValue}
                            style={pickerSelectStyles}
                            dropDownStyle={styles.dropdownStyle}
                            value={statusValue}
                            onValueChange={(value) => {
                                handleChange('role', value);
                                setStatusValue(value);
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            value={editValues.email}
                            onChangeText={(text) => handleChange('email', text)}
                            placeholder="メールアドレス"
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
    );
};

const styles = StyleSheet.create({
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
    bottomButton: {
        borderColor: '#8783a6',
        backgroundColor: '#8783a6',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        fontSize: 18,
        flex: 2,
    },
    buttonText: {
        backgroundColor: '#8783a6',
        borderRadius: 5,
        alignItems: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ece8f6',
    },
});

export default UserEdit;