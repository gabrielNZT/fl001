import React from "react";
import { Avatar, Table } from "antd";
import { FieldNumberOutlined, UserOutlined } from "@ant-design/icons";

const mockData = [
    { id: 1, position: 1, points: 150, username: 'User1', user_image: 'url_da_foto_1' },
    { id: 2, position: 2, points: 120, username: 'User2', user_image: 'url_da_foto_2' },
    { id: 3, position: 3, points: 100, username: 'User3', user_image: 'url_da_foto_3' },
];

const columns = [
    { title: 'Posição', key: 'position', dataIndex: 'position', render: (position) => <p style={{ fontWeight: 'bold' }} > <FieldNumberOutlined /> {position} </p> },
    { title: 'Username', key: 'username', dataIndex: 'username' },
    { title: 'Foto', key: 'user_image', dataIndex: 'user_image', render: () => <Avatar size={32} icon={<UserOutlined />} /> },
    { title: 'Pontuação', key: 'points', dataIndex: 'points' }
];

const TabUsers = () => {
    return (
        <div className="fade-in">
            <p> Usuários que estão participando desse bolão. </p>
            <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={mockData}
            />
        </div>
    );
}

export default TabUsers;