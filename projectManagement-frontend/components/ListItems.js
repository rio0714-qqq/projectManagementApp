import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import ProjectEdit from './ProjectEdit';
import RoleUserProjectEdit from './RoleUserProjectEdit';
import ProjectDelete from './ProjectDelete';

/**
* ListItems.js
* 案件アイテムリスト作成処理
*/

const ProjectItem = ({ item, isExpanded, onPress, onProjectEditPress, onProjectDeletePress, role, assigneesInfo }) => {
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
                        <Text style={styles.itemText}>顧客企業: {item.customer}</Text>
                        <Text>スキル: {item.skills.join(', ')}</Text>
                        <Text>詳細: {item.description}</Text>
                        <Text>ステータス: {item.status}</Text>
                        {console.log("item.assignees", item.assignees)}
                        {role === "admin" && (
                            <Text>
                                メンバー: {item.assignees.map(assignee => assignee.name ? assignee.name : assignee).join(', ')}
                            </Text>
                        )}
                        {role === "user" && (
                            <Text>
                                メンバー: {assigneesInfo ? assigneesInfo : item.assignees.map(assignee => assignee.name ? assignee.name : assignee).join(', ')}
                            </Text>
                        )}
                        <Text>作成日: {new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => onProjectEditPress(item._id)}
                            style={styles.bottomButton}>
                            <Text style={styles.button}>案件編集</Text>
                        </TouchableOpacity>
                        {role === "admin" && (
                            <TouchableOpacity onPress={() => onProjectDeletePress(item._id)}
                                style={styles.bottomButton}>
                                <Text style={styles.button}>案件削除</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};

// アイテム情報表示
export const ItemContainer = ({ items, token, role }) => {
    const [isExpand, setIsExpand] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editProjectItem, setEditProjectItem] = useState(null);
    const [projectItems, setProjectItems] = useState(items);
    const [assigneesInfo, setAssigneesInfo] = useState('');

    useEffect(() => {
        setProjectItems(items);
    }, [items]);

    const toggleDetails = (state) => {
        setIsExpand(isExpand === state ? null : state);
    };

    const onProjectEditPress = (item) => {
        setEditProjectItem(item);
        setEditModalVisible(true);
    };

    const saveData = (updatedItem, members) => {
        if (updatedItem && updatedItem.data) {
            const updatedItems = projectItems.map(item => {
                if (item._id === updatedItem.data._id) {
                    const assigneesNames = updatedItem.data.assignees
                        .map(id => {
                            const member = members.find(member => member.value === id);
                            return member ? member.label : 'Unknown';
                        });

                    return {
                        ...item,
                        ...updatedItem.data,
                        assignees: assigneesNames
                    };
                }
                return item;
            });
            setProjectItems(updatedItems);
        } else {
            console.error('保存エラー');
        }
    };

    const statusSaveData = (updatedItem, members) => {
        if (updatedItem && updatedItem.data) {
            const updatedItems = projectItems.map(item => {
                if (item._id === updatedItem.data._id) {
                    const { assignees, ...restOfUpdatedItem } = updatedItem.data;

                    return {
                        ...item,
                        ...restOfUpdatedItem,
                        assignees: item.assignees
                    };
                }
                return item;
            });
            setProjectItems(updatedItems);
        } else {
            console.error('保存エラー');
        }
    };

    const handleSaveSuccess = (updatedItem, members, updatedAssignees) => {
        if (role == "admin") {
            setAssigneesInfo(updatedAssignees);
            setEditModalVisible(false);
            saveData(updatedItem, members);
        } else {
            setAssigneesInfo(updatedAssignees);
            setEditModalVisible(false);
            statusSaveData(updatedItem, members);
        }
    };

    const onProjectDeletePress = (item) => {
        setEditProjectItem(item);
        setDeleteModalVisible(true);
    };

    const handleDeleteSuccess = (deletedProjectId) => {
        setDeleteModalVisible(false);
        const updatedItems = projectItems.filter(item => item._id !== deletedProjectId);
        setProjectItems(updatedItems);
    };

    return (
        <View>
            <FlatList
                data={projectItems}
                extraData={projectItems}
                renderItem={({ item }) => (
                    <ProjectItem
                        role={role}
                        item={item}
                        isExpanded={isExpand === item._id}
                        onPress={() => toggleDetails(item._id)}
                        onProjectEditPress={() => onProjectEditPress(item)}
                        onProjectDeletePress={() => onProjectDeletePress(item)}
                        assigneesInfo={assigneesInfo}
                    />
                )}
                keyExtractor={item => item._id}
            />
            {editProjectItem && (
                <>
                    {/* admin */}
                    {role === "admin" && (
                        <ProjectEdit
                            token={token}
                            visible={editModalVisible}
                            projectId={editProjectItem}
                            onSaveSuccess={handleSaveSuccess}
                            onCancel={() => setEditModalVisible(false)}
                        />
                    )}

                    {/* user */}
                    {role === "user" && (
                        <RoleUserProjectEdit
                            token={token}
                            assigneesInfo={assigneesInfo}
                            visible={editModalVisible}
                            projectId={editProjectItem}
                            onSaveSuccess={handleSaveSuccess}
                            onCancel={() => setEditModalVisible(false)}
                        />
                    )}
                </>
            )}

            {editProjectItem && (
                <ProjectDelete
                    token={token}
                    visible={deleteModalVisible}
                    projectId={editProjectItem}
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