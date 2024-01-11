import React, { useEffect, useState } from 'react';

import { Card, Empty, Spin, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateBolao } from '../../../components';

import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SupabaseContext } from '../../../provider/SupabaseProvider';
import { setAll } from '../../../store/bolaoReducer';
import { DEFAULT_IMAGE_BASE_64, USER_ID_KEY } from '../../../constants';

import { LoadingOutlined } from '@ant-design/icons';
import './style.css';

const { Meta } = Card;

const Home = () => {
    const [loading, setLoading] = useState(true);
    const supabase = useContext(SupabaseContext);

    const availables = useSelector(state => state.bolao.availables);
    const participating = useSelector(state => state.bolao.participating);
    const finished = useSelector(state => state.bolao.finished);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchBoloes = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('bolao')
                .select(`
                      *,
                      bolao_user (
                      registered,
                      user_id,
                      bolao_id
                    )
                `);

            if (error) {
                throw error;
            }

            const avaibleList = [];
            const participatingList = [];
            const finishedList = [];

            const currentUserId = localStorage.getItem(USER_ID_KEY);

            for (const bolao of data) {
                const { description, image_bolao, name, id } = bolao;
                const bolaoData = { description, image_bolao, name, id };
                const bolao_user = bolao.bolao_user;

                if (bolao.finished) {
                    finishedList.push(bolaoData);
                    continue;
                }

                if (bolao_user.find(bu => bu.user_id === currentUserId && bu.bolao_id === id && bu.registered)) {
                    participatingList.push(bolaoData);
                    continue;
                }

                avaibleList.push(bolaoData);
            }

            dispatch(setAll({ avaibleList, participatingList, finishedList }));
        } catch (error) {
            console.error('Erro ao executar o LEFT JOIN:', error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const CardList = ({ dataList = [], emptyDescription = "" }) => {
        if (!dataList.length) {
            return <Empty description={emptyDescription} />;
        }

        return (
            <div className='bolao-list-cards'>
                {dataList.map((data) => (
                    <Card
                        key={data.id}
                        onClick={() => onSelectCard(data.id)}
                        hoverable
                        style={{
                            width: 240,
                        }}
                        cover={<img style={{ height: '318px', objectFit: 'cover' }} alt={`bolao - ${data.id}`} src={data.image_bolao || DEFAULT_IMAGE_BASE_64} />}
                    >
                        <Meta title={data.name} description={data.description} />
                    </Card>
                ))}
            </div>
        );
    };

    const items = [
        {
            label: 'Participando',
            key: '1',
            children: (
                <div className='fade-in'>
                    <CardList dataList={participating} emptyDescription="Você ainda não está participando de nenhum bolão, vá na aba 'disponíveis' e entre em um bolão." />
                </div>
            ),
        },
        {
            label: 'Disponíveis',
            key: '2',
            children: (
                <div className='fade-in'>
                    <CardList dataList={availables} emptyDescription="Não há nenhum bolão disponível, entre em contato com o admin para solicitar a criação." />
                </div>
            ),
        },
        {
            label: 'Finalizados',
            key: '3',
            children: (
                <div className='fade-in'>
                    <CardList dataList={finished} emptyDescription="Não há nenhum bolão finalizado." />
                </div>
            ),
        },
    ];

    const onSelectCard = (id) => {
        navigate(`/bolao/${id}`);
    };

    useEffect(() => {
        fetchBoloes();
    }, [fetchBoloes]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1> Bolões </h1>
                <CreateBolao fetchBoloes={fetchBoloes} />
            </div>
            <Spin size='large' spinning={loading} tip="Carregando bolões..." indicator={<LoadingOutlined />}>
                <Tabs style={{ marginTop: '8px' }} type='card' items={items} defaultActiveKey='1' />
            </Spin>
        </>
    );
};

export default Home;