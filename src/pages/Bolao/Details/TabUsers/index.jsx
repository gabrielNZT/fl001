import React, { useEffect } from "react";
import { Avatar, Table } from "antd";
import { FieldNumberOutlined, UserOutlined } from "@ant-design/icons";
import useSearchTable from "hooks/useSearchTable";

const TabUsers = ({ fetchUsers, bolaoUsers }) => {
    const getSearchTableProps = useSearchTable();

    const columns = [
        {
            title: 'Posição',
            key: 'position',
            dataIndex: 'position',
            sorter: (a, b) => a.position - b.position,
            render: (position) => <p style={{ fontWeight: 'bold' }} > <FieldNumberOutlined /> {position} </p>
        },
        { title: 'Username', key: 'username', dataIndex: 'username', ...getSearchTableProps('username') },
        { title: 'Foto', key: 'user_image', dataIndex: 'user_image', render: (picture_image) => <Avatar src={picture_image || undefined} size={32} icon={<UserOutlined />} /> },
        {
            title: 'Pontuação',
            key: 'pontuacao',
            dataIndex: 'pontuacao',
            sorter: (a, b) => a.pontuacao - b.pontuacao,
        }
    ];

    useEffect(() => {
        if (!bolaoUsers) {
            fetchUsers();
        }
    }, [bolaoUsers, fetchUsers]);

    return (
        <div className="fade-in">
            <p> Usuários que estão participando desse bolão. </p>
            <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={bolaoUsers || []}
            />
        </div>
    );
}

export default TabUsers;