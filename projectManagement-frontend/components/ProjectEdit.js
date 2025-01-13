import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import API_BASE_URL from '../config/config';

/**
 * ProjectEdit.js
 * 案件編集モーダル処理
 */

const ProjectEdit = ({ visible, projectId, onCancel, onSaveSuccess, token }) => {
    const [editValues, setEditValues] = useState({
        _id: '',
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

    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [statusValue, setStatusValue] = useState("");

    // 初期値の設定 (モーダルが表示されるたびに実行)
    useEffect(() => {
        if (visible && projectId) {
            const initialStatusValue = projectId.status || '';
            setEditValues({
                _id: projectId._id || '',
                name: projectId.name || '',
                customer: projectId.customer || '',
                skills: Array.isArray(projectId.skills) ? projectId.skills.join(', ') : projectId.skills || '',
                description: projectId.description || '',
                status: initialStatusValue,
                assignees: projectId.assignees.map(assignee => assignee.name ? assignee.name : assignee).join(', '), // ※初期表示処理に必須
            });
            setStatusValue(initialStatusValue);
            console.log("statusValue", statusValue);
        }

    }, [visible, projectId, members]);

    // メンバーの取得
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoadingMembers(true);
                // 【API通信】GET ユーザー取得
                const response = await axios.get(`${API_BASE_URL}/api/v1/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const uniqueMembers = response.data.data.map(member => ({
                    label: member.name,
                    value: member._id,
                }));
                setMembers(uniqueMembers);
                setLoadingMembers(false);
            } catch (error) {
                console.error('取得失敗', error);
                setLoadingMembers(false);
            }
        };

        fetchMembers();
    }, [token]);


    const getMemberNames = (ids) => {
        return ids
            .map(id => members.find(member => member.value === id)?.label)
            .filter(name => name !== undefined)
            .join(', ');
    };

    const handleSave = async () => {
        if (loadingMembers) {
            console.error('保存エラー');
            return;
        }
        try {
            const updatedProject = {
                _id: editValues._id,
                name: editValues.name,
                customer: editValues.customer,
                skills: editValues.skills.split(',').map(skill => skill.trim()),
                description: editValues.description,
                status: editValues.status,
                assignees: editValues.assignees.split(',').map(name => {
                    const member = members.find(member => member.label === name.trim());
                    return member ? member.value : '';
                }).filter(id => id !== ''),
            };
            // 【API通信】PUT 案件編集
            const fixProjectResponse = await axios.put(`${API_BASE_URL}/api/v1/projects/${editValues._id}`, updatedProject, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (fixProjectResponse.data) {
                onSaveSuccess(fixProjectResponse.data, members);
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
                            <Text style={styles.modalTitleText}>案件編集</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={editValues.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholder="案件名"
                        />
                        <TextInput
                            style={styles.input}
                            value={editValues.customer}
                            onChangeText={(text) => handleChange('customer', text)}
                            placeholder="顧客企業"
                        />
                        <TextInput
                            style={styles.input}
                            value={editValues.skills}
                            onChangeText={(text) => handleChange('skills', text)}
                            placeholder="スキル (カンマ区切り)"
                        />
                        <TextInput
                            style={styles.input}
                            value={editValues.description}
                            onChangeText={(text) => handleChange('description', text)}
                            placeholder="詳細"
                        />
                        <RNPickerSelect
                            items={statusOptions}
                            defaultValue={statusValue}
                            style={pickerSelectStyles}
                            dropDownStyle={styles.dropdownStyle}
                            value={statusValue}
                            onValueChange={(value) => {
                                handleChange('status', value);
                                setStatusValue(value);
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            value={editValues.assignees}
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

export default ProjectEdit;