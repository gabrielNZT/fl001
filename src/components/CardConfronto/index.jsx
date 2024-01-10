import React, { useMemo } from 'react';
import { CloseOutlined, LoadingOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Avatar, Card, Spin, Statistic, Tag, Typography } from 'antd';
import { useState } from 'react';
import './style.css';
import { DEFAULT_IMAGE_BASE_64 } from 'constants';

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
    phase
}) => {
    const [selectedKey, setSelectedKey] = useState();
    const [loading, setLoading] = useState(false);

    const options = useMemo(() => [
        { key: time1_name, value: time1_name },
        { key: time2_name, value: time2_name },
    ], [time1_name, time2_name]);

    const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
    const onFinish = () => {
        console.log('finished!');
    };

    const handleChange = async (key) => {
        setLoading(true);
        setSelectedKey(key);

        await new Promise((resolve) => {
            setTimeout(() => resolve(), 700);
        });

        setLoading(false);
    };

    return (
        <Spin spinning={loading} tip="Salvando alteração" indicator={<LoadingOutlined />}>
            <Card className="card-confronto" style={{ minWidth: 450 }}>
                <span style={{ display: 'flex', gap: '0px', marginBottom: '6px' }}>
                    {phase === 'groups' && (<Tag color='blue' >  Fase de pontos </Tag>)}
                    {phase === 'playoff' && (<Tag color='red' > Playoffs </Tag>)}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-confroto-time" onClick={() => handleChange('furia')}>
                        <Avatar size={48} shape='square' src={time1_image} icon={<TeamOutlined />} />
                        <Text strong style={selectedKey === time1_name ? { color: 'var(--primary-color)' } : undefined}>{time1_name}</Text>
                    </div>
                    <CloseOutlined style={{ fontSize: '26px' }} />
                    <div className="card-confroto-time" onClick={() => handleChange('pain')}>
                        <Avatar size={48} shape='square' src={time2_image} icon={<TeamOutlined />} />
                        <Text strong style={selectedKey === time2_name ? { color: 'var(--primary-color)' } : undefined}>{time2_name}</Text>
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
                            {options.find(option => option.key === selectedKey)?.label || '-'}
                        </Text>
                    </div>
                </div>

            </Card >
        </Spin>
    );
};

export default CardConfronto;