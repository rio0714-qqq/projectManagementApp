import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/config';

/**
 * UserDelete.js
 * ユーザー削除モーダル処理
 */

const UserDelete = ({ visible, userId, onCancel, onDeleteSuccess, token }) => {

    const deleteUserInfo = async () => {
        try {

            // 【API通信】DELETE ユーザー削除
            const deleteUserResponse = await axios.delete(`${API_BASE_URL}/api/v1/users/${userId._id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return userId._id;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const handleDelete = async () => {
        try {
            const deletedItem = await deleteUserInfo();
            if (deletedItem) onDeleteSuccess(deletedItem);
        } catch (error) {
            console.error('削除エラー', error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>ユーザーを削除しますか？</Text>
                    <TouchableOpacity onPress={handleDelete}>
                        <Text style={styles.modalButton}>削除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={styles.modalButton}>キャンセル</Text>
                    </TouchableOpacity>
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
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    modalButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8783a6',
        marginTop: 10,
    },
});

export default UserDelete;