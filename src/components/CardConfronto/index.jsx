import React, { useContext, useMemo } from 'react';
import { CloseOutlined, DeleteOutlined, LoadingOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Modal, Spin, Statistic, Tag, Typography } from 'antd';
import { useState } from 'react';

import { DEFAULT_IMAGE_BASE_64 } from 'constants';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Private } from 'components';
import { SupabaseContext } from 'provider/SupabaseProvider';

import './style.css';

const { Text } = Typography;
const { Countdown } = Statistic;

const CardConfronto = ({
    time1_name = "",
    time1_image = DEFAULT_IMAGE_BASE_64,
    time2_name = "",
    time2_image = DEFAULT_IMAGE_BASE_64,
    date,
    result,
    expire,
    phase,
    id,
    refetchConfrontos = async () => { },
    isParticipating
}) => {
    const [selectedKey, setSelectedKey] = useState();
    const [loading, setLoading] = useState(false);

    const supabase = useContext(SupabaseContext);

    const options = useMemo(() => [
        { key: time1_name, value: time1_name },
        { key: time2_name, value: time2_name },
    ], [time1_name, time2_name]);

    const deadline = useMemo(() => {
        return expire ? moment(expire, 'DD/MM/YYYY HH:mm').valueOf() : moment(date, 'DD/MM/YYYY').valueOf();
    }, [expire, date]);


    const onFinish = () => {
        console.log('finished!');
    };

    const handleChange = async (key) => {
        if (!isParticipating) {
            return Modal.info({
                title: 'Você não está participando.',
                content: 'Clique em "participar" para começar a apostar.',
                onOk: () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }

        setLoading(true);
        setSelectedKey(key);

        await new Promise((resolve) => {
            setTimeout(() => resolve(), 700);
        });

        setLoading(false);
    };

    const deleteConfronto = async (id) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('confronto')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            toast.success('Deletado com sucesso!');
            refetchConfrontos();
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível deletar o confronto contate o suporte!');
        } finally {
            setLoading(false);
        }
    }

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Deseja excluir esse Confronto?',
            icon: <DeleteOutlined style={{ color: 'red' }} />,
            content: 'Deletar esse confronto pode impactar no resultado do bolao.',
            okText: 'Confirmar',
            onOk() {
                deleteConfronto(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <Spin spinning={loading} tip="Salvando alteração" indicator={<LoadingOutlined />}>
            <Card className="card-confronto" style={{ minWidth: 450 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }} >
                    <span style={{ display: 'flex', gap: '0px', marginBottom: '6px' }}>
                        {phase === 'groups' && (<Tag color='blue' >  Fase de pontos </Tag>)}
                        {phase === 'playoff' && (<Tag color='red' > Playoffs </Tag>)}
                    </span>
                    <Private>
                        <Button onClick={showDeleteConfirm} type='primary' ghost danger >Deletar</Button>
                    </Private>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-confroto-time" onClick={() => handleChange(time1_name)}>
                        <Avatar size={48} shape='square' src={time1_image} icon={<TeamOutlined />} />
                        <Text strong style={selectedKey === time1_name ? { color: 'var(--primary-color)', transform: 'scale(1.1)', transition: '0.4s', fontWeight: 'bold' } : undefined}>{time1_name}</Text>
                    </div>
                    <CloseOutlined style={{ fontSize: '26px' }} />
                    <div className="card-confroto-time" onClick={() => handleChange(time2_name)}>
                        <Avatar size={48} shape='square' src={time2_image} icon={<TeamOutlined />} />
                        <Text strong style={selectedKey === time2_name ? { color: 'var(--primary-color)', transform: 'scale(1.1)', transition: '0.4s' } : undefined}>{time2_name}</Text>
                    </div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Text type="secondary">Resultado:</Text>
                        <br />
                        <Text>
                            <TrophyOutlined /> {result || '-'}
                        </Text>
                    </div>
                    <Countdown title="Encerramento da aposta:" value={deadline} onFinish={onFinish} />
                    <div>
                        <Text type="secondary">Time escolhido:</Text>
                        <br />
                        <Text>
                            {options.find(option => option.key === selectedKey)?.value || '-'}
                        </Text>
                    </div>
                </div>

            </Card >
        </Spin>
    );
};

export default CardConfronto;