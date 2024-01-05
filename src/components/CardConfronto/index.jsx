import { CloseOutlined, LoadingOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Avatar, Card, Spin, Statistic, Tag, Typography } from 'antd';
import { useState } from 'react';
import './style.css';

const { Text } = Typography;
const { Countdown } = Statistic;

const options = [
    { key: 'furia', label: 'Furia' },
    { key: 'pain', label: 'Pain' }
];

const CardConfronto = () => {
    const [selectedKey, setSelectedKey] = useState();
    const [loading, setLoading] = useState(false);

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
        <Card className="card-confronto" style={{ minWidth: 450 }}>
            <Spin spinning={loading} tip="Salvando alteração" indicator={<LoadingOutlined />}>
                <span style={{ display: 'flex', gap: '0px' }}>
                    <Tag color='red' > Playoffs </Tag>
                    <Tag color='blue' >  Fase de pontos </Tag>
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-confroto-time" onClick={() => handleChange('furia')}>
                        <Avatar size={48} src="https://fugdjpddxihzqhgwclmj.supabase.co/storage/v1/object/public/imagesFL001/image.png" icon={<TeamOutlined />} />
                        <Text strong style={selectedKey === 'furia' ? { color: 'var(--primary-color)' } : undefined}>Furia</Text>
                    </div>
                    <CloseOutlined style={{ fontSize: '26px' }} />
                    <div className="card-confroto-time" onClick={() => handleChange('pain')}>
                        <Avatar size={48} src="https://fugdjpddxihzqhgwclmj.supabase.co/storage/v1/object/public/imagesFL001/image%20(9).png" icon={<TeamOutlined />} />
                        <Text strong style={selectedKey === 'pain' ? { color: 'var(--primary-color)' } : undefined}>Pain</Text>
                    </div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Text type="secondary">Resultado:</Text>
                        <br />
                        <Text>
                            <TrophyOutlined /> {'1-0'}
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
            </Spin>
        </Card >
    );
};

export default CardConfronto;