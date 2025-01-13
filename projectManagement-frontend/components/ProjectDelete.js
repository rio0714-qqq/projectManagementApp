import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/config';

/**
 * ProjectDelete.js
 * 案件削除モーダル処理
 */

const ProjectDelete = ({ visible, projectId, onCancel, onDeleteSuccess, token }) => {
    const deleteProjectInfo = async () => {
        try {

            // 【API通信】Delete 案件削除
            const deleteProjectResponse = await axios.delete(`${API_BASE_URL}/api/v1/projects/${projectId._id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return projectId._id;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const handleDelete = async () => {
        try {
            const deletedItem = await deleteProjectInfo();
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
                    <Text style={styles.modalTitle}>案件を削除しますか？</Text>
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

export default ProjectDelete;