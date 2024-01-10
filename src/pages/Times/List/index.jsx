import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Table, Space, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { SupabaseContext } from 'provider/SupabaseProvider';
import { toast } from 'react-toastify';
import { DEFAULT_IMAGE_BASE_64 } from 'constants';

import './style.css';

const { confirm } = Modal;

const ListTimes = () => {
    const [dataSource, setDataSource] = useState([]);

    const [loading, setLoading] = useState(true);


    const supabase = useContext(SupabaseContext);

    const handleEdit = () => { };

    const handleDelete = (record) => {
        try {
            console.log(record);
        } catch (e) {
            toast.error('Não foi possível deletar o time. Entre em contato com o suporte.');
        }
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: 'Deseja excluir esse time?',
            icon: <DeleteOutlined style={{ color: 'red' }} />,
            content: 'Essa ação é irreversível.',
            okText: 'Confirmar',
            onOk() {
                handleDelete(record);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const fetchTimes = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('time')
                .select('*');

            if (error) {
                throw error;
            }
            console.log(data)
            setDataSource(data);
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível obter os times. Entre em contato com o suporte');
        } finally {
            setLoading(false);
        }
    }, []);

    const columns = [
        {
            title: 'Identificador',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Abreviação',
            dataIndex: 'abbreviation',
            key: 'abbreviation'
        },
        {
            title: 'Imagem',
            dataIndex: 'time_image',
            key: 'time_image',
            render: (time_image, { name }) => <img alt={`${name} image`} src={time_image || DEFAULT_IMAGE_BASE_64} style={{ height: '48px', objectFit: 'cover' }} />
        },
        {
            title: 'Ações',
            key: 'actions',
            width: '150px',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchTimes();
    }, [fetchTimes]);

    return (
        <div className='container-list-times'>
            <h1> Listagem de times cadastrados </h1>
            <Button type='primary'> Adicionar time </Button>
            <Table
                loading={{
                    spinning: loading,
                    indicator: <LoadingOutlined />
                }}
                dataSource={dataSource}
                columns={columns}
                rowKey={'id'}
            />
        </div>
    );
};

export default ListTimes;
