import React, { useEffect } from 'react';

import { Card, Empty, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateBolao } from '../../../components';

import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SupabaseContext } from '../../../provider/SupabaseProvider';
import './style.css';
import { setAll } from '../../../store/BolaoReducer';

const { Meta } = Card;

const Home = () => {
    const supabase = useContext(SupabaseContext);

    const availables = useSelector(state => state.bolao.availables);
    const participating = useSelector(state => state.bolao.participating);
    const finished = useSelector(state => state.bolao.finished);

    console.log(availables, participating)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchBoloes = useCallback(async () => {
        try {
            // Substitua 'bolao' e 'bolao_user' pelos nomes reais de suas tabelas no Supabase
            const { data, error } = await supabase
                .from('bolao')
                .select(`
                      *,
                      bolao_user (
                      registered
                    )
                `);

            if (error) {
                throw error;
            }

            const avaibleList = [];
            const participatingList = [];
            const finishedList = [];

            const currentUserId = '';

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
        }
    }, []);

    const items = [
        {
            label: 'Disponíveis',
            key: '1',
            children: (
                <div className='fade-in'>
                    {!availables.length ? (
                        <Empty description="Não há nenhum bolão disponível, entre em contato com o admin para solicitar a criação." />
                    ) : (
                        <div className='bolao-list-cards'>
                            {availables.map((data) => (
                                <Card
                                    key={data.id}
                                    onClick={() => onSelectCard(data.id)}
                                    hoverable
                                    style={{
                                        width: 240,
                                    }}
                                    cover={<img style={{ height: '240px', objectFit: 'cover', background: 'white' }} alt={`bolao - ${data.id}`} src={data.image_bolao || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAYFBMVEXDw8MAAABwcHDHx8eKioqkpKS8vLzGxsatra3KysqQkJCenp6AgIB3d3dra2u3t7dZWVlMTEyysrIsLCxTU1NDQ0OUlJQhISEyMjJlZWUMDAw9PT2Dg4N0dHQYGBhGRkaaAXj3AAACVklEQVR4nO3a63KiQBBAYbATxxYQbxtNdjd5/7dMIFwEGbaA1Fo05/tpNFVzZJgBCQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICFEdFJROTRQ5jKxbvVRLF79CCmkW043XbeEeTpBxo8zXs2ZA2i9RSRiQbPUw5l90wDUw2cqIyIYamBHpP9Lho+GEMNNM7P8IfB/8BOg2qbcNaB/8BQg2qt3ww8J5hpkA2kkAwcj50GUdVgN3AymGkQpPW+1zMXfFeHdhror7LBuvt9GsXHzpHaaVAdCC/dw9FddnnYNU0MNXDp4WuUp6j7bCAv3jXDUIPAabo5eia9K46SS9ffDDX44nxbA7kWM2V/f5gYa+CTnwyKVeMuwjIaSL15CMNj+72LaODWt7fNTotsUG8dcq+t2bCEBpq0bqC2dhA2G4ho/cLN1VT3TtJkA00u57R8xQVvdw2ujdlgsYGusnGWEfRwl6B1aWmwQbEQ/v4elf7pSBCGt7cdDTYoF8K/2XftNp0JGqcEew3qhTD7rt27p8FHPRvMNbhZCN/Wge49CcIwqSJYa9BYCD+07yfpxmcsNQgax/6qJ0H4Xn7EWAM99426pfwhwlYDz0LoU1xGm2rgXQh9vu+smWoQXAY2uJhr0LMQ+uR31gw1GPVs1lZMNUj/PeIOqaUGchrV4Cp2GujrqATZZbSVBr274n5bNdJANuOJjQY8ozl6GtRm3sD9yDPb824QuHjqo/ureOYJ8p8TZKJHDwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOB/+wQBph2Iu8J1cQAAAABJRU5ErkJggg=="} />}
                                >
                                    <Meta title={data.name} description={data.description} />
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
        {
            label: 'Participando',
            key: '2',
            children: (
                <div className='fade-in'>
                    {!participating.length ? (
                        <Empty description="Você ainda não está participando de nenhum bolão, vá na aba 'disponíveis' e entre em um bolão." />
                    ) : (
                        <div className='bolao-list-cards'>
                            {participating.map((data) => (
                                <Card
                                    key={data.id}
                                    onClick={() => onSelectCard(data.id)}
                                    hoverable
                                    style={{
                                        width: 240,
                                    }}
                                    cover={<img alt={`bolao - ${data.id}`} src={data.image_bolao} />}
                                >
                                    <Meta title={data.name} description={data.description} />
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
        {
            label: 'Finalizados',
            key: '3',
            children: (
                <div className='bolao-list-cards fade-in'>
                    <Card
                        onClick={() => onSelectCard('1')}
                        hoverable
                        style={{
                            width: 240,
                        }}
                        cover={<img alt="example" src="https://s2-ge.glbimg.com/NrL-x34Dmx7NlNkHEYEp6D2lnto=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/o/M/jsPoQWTvuJC1z2RQB2yQ/bolao-eptv.png" />}
                    >
                        <Meta title="Bolao 2024" description="Campeonato brasileiro de league of legends" />
                    </Card>
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
            <Tabs style={{ marginTop: '8px' }} type='card' items={items} defaultActiveKey='1' />
        </>
    );
};

export default Home;