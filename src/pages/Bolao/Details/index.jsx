import { ArrowLeftOutlined, CheckCircleOutlined, FieldNumberOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Collapse, Empty, Table, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { CardConfronto } from "../../../components";
import './style.css';

const DetailsBolao = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isAdmin = true;

    const mockData = [
        { id: 1, position: 1, points: 150, username: 'User1', user_image: 'url_da_foto_1' },
        { id: 2, position: 2, points: 120, username: 'User2', user_image: 'url_da_foto_2' },
        { id: 3, position: 3, points: 100, username: 'User3', user_image: 'url_da_foto_3' },
    ];

    const columns = [
        { title: 'Posição', key: 'position', dataIndex: 'position', render: (position) => <p style={{ fontWeight: 'bold' }} > <FieldNumberOutlined /> {position} </p> },
        { title: 'Username', key: 'username', dataIndex: 'username' },
        { title: 'Foto', key: 'user_image', dataIndex: 'user_image', render: (_, record) => <Avatar size={32} icon={<UserOutlined />} /> },
        { title: 'Pontuação', key: 'points', dataIndex: 'points' }
    ];

    const items = [
        {
            key: '1', label: 'Confrontos', children: (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Alert showIcon message="Cada acerto de confronto da fase de pontos equivale a 1 ponto, já os playoffs equivale a 2.5 pontos." type="info" />
                    <Collapse size="large" defaultActiveKey={'1'} >
                        <Collapse.Panel header="Rodadas atuais" key={'1'}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <h3> Esses são os confrontos da semana, aposte agora! </h3>
                                <div className="card-confrontos-list">
                                    <div className="card-confrontos-list-container">
                                        <CardConfronto />
                                    </div>
                                </div>
                            </div>
                        </Collapse.Panel>
                        <Collapse.Panel header="Outras" key={'2'}>
                            <div className="card-confrontos-list">
                                <h2> Rodada 2 </h2>
                                <div className="card-confrontos-list-container">
                                    <CardConfronto />
                                    <CardConfronto />
                                    <CardConfronto />
                                </div>
                            </div>
                            <div className="card-confrontos-list">
                                <h2> Rodada 1 </h2>
                                <div className="card-confrontos-list-container">
                                    <CardConfronto />
                                    <CardConfronto />
                                    <CardConfronto />
                                </div>
                            </div>
                        </Collapse.Panel>
                    </Collapse>
                </div>
            )
        },
        {
            key: '2', label: 'Bets', children: (
                <div className="fade-in">
                    <Empty description={<h2> Não há nenhuma bet </h2>} >
                        <p> Entre em contato com o admin da página para criar as bets. </p>
                    </Empty>
                </div>
            )
        },
        {
            key: '3', label: 'Participantes', children: (
                <div className="fade-in">
                    <p> Usuários que estão participando desse bolão. </p>
                    <Table
                        rowKey={(record) => record.id}
                        columns={columns}
                        dataSource={mockData}
                    />
                </div>
            )
        },
    ];

    const goBack = () => {
        navigate('/bolao');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <ArrowLeftOutlined className="arrow-return" onClick={goBack} />
                        <h1> Bolao 2024 </h1>
                    </span>
                    <img
                        src="https://s2-ge.glbimg.com/NrL-x34Dmx7NlNkHEYEp6D2lnto=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/o/M/jsPoQWTvuJC1z2RQB2yQ/bolao-eptv.png"
                        alt="image-bolao"
                        style={{
                            height: '96px',
                            width: '96px',
                            objectFit: 'cover'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                    <p style={{ maxWidth: '80%', overflowWrap: 'break-word' }}> Campeonato brasileiro de league of legends </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {isAdmin ? (
                            <>
                                <Button type="primary"> Editar </Button>
                                <Button type="primary" danger> Deletar </Button>
                            </>
                        ) : (
                            <Button disabled icon={<CheckCircleOutlined />} type="primary"> Já está participando </Button>
                        )}
                    </div>
                </div>
            </div>
            <Tabs defaultActiveKey="1" type="card" items={items} />
        </div>
    );
};

export default DetailsBolao;