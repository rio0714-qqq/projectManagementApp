import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import UserEdit from './UserEdit';
import UserDelete from './UserDelete';

/**
* UserListItems.js
* ユーザーアイテムリスト作成処理
*/

const UserItem = ({ item, isExpanded, onPress, onUserEditPress, onUserDeletePress }) => {
    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <TouchableOpacity onPress={onPress}>
                    {isExpanded
                        ? <AntDesignIcon name='upcircle' size={17} color='#393E46' style={styles.toggleIcon} />
                        : <AntDesignIcon name='downcircle' size={17} color='#393E46' style={styles.toggleIcon} />
                    }
                </TouchableOpacity>
            </View>
            {isExpanded && (
                <View style={styles.itemDetails}>
                    <View>
                        <Text>権限: {item.role}</Text>
                        <Text>メールアドレス: {item.email}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => onUserEditPress(item._id)}
                            style={styles.bottomButton}>
                            <Text style={styles.button}>編集</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onUserDeletePress(item._id)}
                            style={styles.bottomButton}>
                            <Text style={styles.button}>削除</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

// アイテム情報表示
export const UserItemContainer = ({ items, token }) => {
    const [isExpand, setIsExpand] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editUserItem, setEditUserItem] = useState(null);
    const [userItems, setUserItems] = useState(items);

    useEffect(() => {
        setUserItems(items);
    }, [items]);

    const toggleDetails = (state) => {
        setIsExpand(isExpand === state ? null : state);
    };

    const onUserEditPress = (item) => {
        setEditUserItem(item);
        setEditModalVisible(true);
    };

    const saveData = (updatedItem) => {
        if (updatedItem && updatedItem.data) {
            const updatedItems = userItems.map(item => {
                if (item._id === updatedItem.data._id) {
                    return {
                        ...item,
                        ...updatedItem.data
                    };
                }
                return item;
            });
            setUserItems(updatedItems);
        } else {
            console.error('保存エラー');
        }
    };

    const handleSaveSuccess = (updatedItem, updatedAssignees) => {
        setEditModalVisible(false);
        saveData(updatedItem);
    };

    const onUserDeletePress = (item) => {
        setEditUserItem(item);
        setDeleteModalVisible(true);
    };

    const handleDeleteSuccess = (deletedUserId) => {
        setDeleteModalVisible(false);
        const updatedItems = userItems.filter(item => item._id !== deletedUserId);
        setUserItems(updatedItems);
    };
    return (
        <View>
            <FlatList
                data={userItems}
                extraData={userItems}
                renderItem={({ item }) => (
                    <UserItem
                        item={item}
                        isExpanded={isExpand === item._id}
                        onPress={() => toggleDetails(item._id)}
                        onUserEditPress={() => onUserEditPress(item)}
                        onUserDeletePress={() => onUserDeletePress(item)}
                    />
                )}
                keyExtractor={item => item._id}
            />
            {editUserItem && (
                <>
                    <UserEdit
                        token={token}
                        visible={editModalVisible}
                        userId={editUserItem}
                        onSaveSuccess={handleSaveSuccess}
                        onCancel={() => setEditModalVisible(false)}
                    />

                </>
            )}

            {editUserItem && (
                <UserDelete
                    token={token}
                    visible={deleteModalVisible}
                    userId={editUserItem}
                    onDeleteSuccess={handleDeleteSuccess}
                    onCancel={() => setDeleteModalVisible(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        marginTop: 5,
        marginBottom: 5,
        padding: 16,
        borderWidth: 3,
        borderColor: '#8783a6',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 18,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    toggleIcon: {

    },
    button: {
        borderColor: '#8783a6',
        backgroundColor: '#8783a6',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18,
        color: '#ece8f6',
        fontWeight: 'bold',
    },
    itemDetails: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
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
});