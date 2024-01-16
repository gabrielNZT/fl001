import React, { useContext, useEffect, useMemo } from 'react';
import { CloseOutlined, DeleteOutlined, LoadingOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Form, Input, Modal, Spin, Statistic, Tag, Typography } from 'antd';
import { useState } from 'react';

import { DEFAULT_IMAGE_BASE_64 } from 'constants';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Private } from 'components';
import { SupabaseContext } from 'provider/SupabaseProvider';
import { USER_ID_KEY } from 'constants';

import './style.css';
import { isAdmin } from 'components/Private';

const { Text } = Typography;
const { Countdown } = Statistic;

const CardConfronto = ({
    time1_id,
    time1_name = "",
    time1_image = DEFAULT_IMAGE_BASE_64,
    time2_id,
    time2_name = "",
    time2_image = DEFAULT_IMAGE_BASE_64,
    date,
    result,
    expire,
    phase,
    id,
    selected_team_id,
    isParticipating,
    refetchConfrontos = async () => { },
    disabled = false
}) => {
    const [showFormResult, setShowFormResult] = useState(false);
    const [selectedKey, setSelectedKey] = useState();
    const [loading, setLoading] = useState(false);
    const [expired, setExpired] = useState({ bool: false, status: '' });

    const [form] = Form.useForm();

    const momentFinishedDate = useMemo(() => expire ? moment(expire, 'DD/MM/YYYY HH:mm') : moment(`${date} 13:00`, 'DD/MM/YYYY HH:mm'), [date, expire]);

    const supabase = useContext(SupabaseContext);
    const user_id = useMemo(() => localStorage.getItem(USER_ID_KEY), []);

    const time1 = useMemo(() => ({
        id: time1_id,
        name: time1_name,
        image: time1_image
    }), [time1_id, time1_image, time1_name]);
    const time2 = useMemo(() => ({
        id: time2_id,
        name: time2_name,
        image: time2_image
    }), [time2_id, time2_image, time2_name]);

    const options = useMemo(() => [
        { key: time1_id, value: time1_name },
        { key: time2_id, value: time2_name },
    ], [time1_id, time1_name, time2_id, time2_name]);

    const deadline = useMemo(() => {
        return expire ? moment(expire, 'DD/MM/YYYY HH:mm').valueOf() : moment(`${date} 13:00`, 'DD/MM/YYYY HH:mm').valueOf();
    }, [expire, date]);

    const finishedConfronto = useMemo(() => (expired.bool || moment().isAfter(momentFinishedDate) || result || disabled), [disabled, expired.bool, momentFinishedDate, result]);

    const cardConfrontoClassName = useMemo(() => {
        const classes = [];

        classes.push('card-confronto');
        if (finishedConfronto && !isAdmin()) {
            classes.push('expired-card');
        }

        if (expired.status) {
            classes.push(`${status}-card`);
        }

        try {
            const scoreTime1 = parseInt(result.split('-')[0]);
            const scoreTime2 = parseInt(result.split('-')[1]);
            const winner_time_id = (scoreTime1 === scoreTime2 ? null : (scoreTime1 > scoreTime2 ? time1.id : time2.id));
            if (winner_time_id && selected_team_id) {
                if (winner_time_id === selected_team_id) {
                    classes.push('success-card');
                } else {
                    classes.push('error-card');
                }
            }

        } catch (e) {
            console.log(e);
        }

        return classes.join(' ');
    }, [expired.status, finishedConfronto, result, selected_team_id, time1.id, time2.id]);

    const onFinish = () => {
        setExpired({ bool: true, status: '' });
    };

    const deleteAposta = () => {
        return supabase
            .from('confronto_user')
            .delete()
            .eq('confronto_id', id)
            .eq('user_id', user_id);
    }

    const updateAposta = (selected_team_id) => {
        return supabase
            .from('confronto_user')
            .update({ selected_team_id })
            .eq('confronto_id', id)
            .eq('user_id', user_id)
            .select();
    }

    const createAposta = (selected_team_id) => {
        return supabase
            .from('confronto_user')
            .insert([
                { user_id, confronto_id: id, selected_team_id },
            ])
            .select();
    }

    const handleChange = async (key) => {
        if (isAdmin()) {
            return Modal.info({
                title: 'Você é um administrador.',
                content: 'Usuários com esse nível de permissão não podem participar das apostas.'
            });
        }

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

        const lastSelectedKey = selectedKey;
        const method = (!key ? 'DELETE' : ((!lastSelectedKey && !!key) ? 'POST' : 'PUT'));
        const methodHashTable = {
            PUT: updateAposta,
            POST: createAposta,
            DELETE: deleteAposta
        };
        setLoading(true);
        setSelectedKey(key);

        try {
            const functionToCall = methodHashTable[method]
            const { error } = await functionToCall(key);

            if (error) {
                throw error;
            }

            toast.success(method === 'POST' ? 'Aposta realizada com sucesso!' : 'Alteração realizada com sucesso!');
            refetchConfrontos();
        } catch (e) {
            console.log(e);
            setSelectedKey(lastSelectedKey);
            toast.error('Não foi possível salvar sua aposta. Entre em contato com o suporte se o problema persistir.');
        }

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

    const onBlurResult = async () => {
        const validarString = (str) => {
            const regex = /^\d+-\d+$/;
            return regex.test(str);
        };

        const { result } = form.getFieldsValue();

        if (!result) {
            setShowFormResult(false);
            return;
        }

        if (!validarString(result)) {
            return Modal.error({ title: 'Dados inválidos', content: 'O resultado deve seguir o seguinte padrão "1-0" (número-número).' });
        }

        const scoreTime1 = parseInt(result.split('-')[0]);
        const scoreTime2 = parseInt(result.split('-')[1]);
        const winner_time_id = (scoreTime1 === scoreTime2 ? null : (scoreTime1 > scoreTime2 ? time1.id : time2.id));
        Modal.confirm({
            width: 500,
            okText: "Confirmar",
            title: 'Definir resultado',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Alert style={{ marginBottom: '10px' }} message="O resultado não poderá mais ser editado após confirmação!" type='warning' />
                    <span> Resultado: {result}</span>
                    <span> Time vencedor: {scoreTime1 > scoreTime2 ? time1.name : time2.name}</span>
                    {phase === 'groups' && (<span> Fase de pontos </span>)}
                    {phase === 'playoff' && (<span> Playoffs </span>)}
                    <strong style={{ marginTop: '10px' }}> Errar o resultado pode impactar no resultado do bolão! </strong>
                </div>
            ),
            onOk: async () => {
                setLoading(true);
                try {
                    const { error } = await supabase
                        .from('confronto')
                        .update({ result, winner_time_id })
                        .eq('id', id)
                        .select();

                    if (error) {
                        throw error;
                    }


                    const { error: errorUpdatePontuacao } = await supabase
                        .rpc('atualizar_pontuacao_confronto', {
                            v_id_confronto: id
                        });

                    if (errorUpdatePontuacao) {
                        throw errorUpdatePontuacao;
                    }

                    setShowFormResult(false);
                    refetchConfrontos();
                } catch (e) {
                    console.log(e);
                    toast.error('Não foi possível definir o resultado do confronto');
                } finally {
                    setLoading(false);
                }
            }
        })
    }

    useEffect(() => {
        setSelectedKey(selected_team_id);
    }, [selected_team_id]);

    const ContainerTime = ({ id, name, image }) => {
        return (
            <div className="card-confroto-time" onClick={() => handleChange(selectedKey === id ? null : id)}>
                <Avatar size={48} shape='square' src={image || DEFAULT_IMAGE_BASE_64} icon={<TeamOutlined />} />
                <Text
                    strong
                    style={(selectedKey === id && !isAdmin()) ? { color: 'var(--primary-color)', transform: 'scale(1.1)', transition: '0.4s', fontWeight: 'bold' } : undefined}
                >
                    {name}
                </Text>
            </div>
        );
    };

    return (
        <Spin spinning={loading} tip="Salvando alteração" indicator={<LoadingOutlined />}>
            <Card className={cardConfrontoClassName} style={{ minWidth: 450 }}>
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
                    <ContainerTime {...time1} />
                    <CloseOutlined style={{ fontSize: '26px' }} />
                    <ContainerTime {...time2} />
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={isAdmin() ? { cursor: 'pointer', height: '50px' } : {}} onClick={() => isAdmin() ? setShowFormResult(true) : null} >
                        {showFormResult ? (
                            <Form initialValues={{ result: result || '' }} form={form} layout='vertical' >
                                <Form.Item className='remove-padding-form-item' label={<Text type="secondary">Resultado:</Text>} name={"result"}>
                                    <Input
                                        onKeyDown={(event) => event.keyCode === 13 ? event.target.blur() : null}
                                        size='small'
                                        autoFocus
                                        style={{ maxWidth: '70px' }}
                                        placeholder='Ex.: 1-0'
                                        onBlur={onBlurResult}
                                    />
                                </Form.Item>
                            </Form>
                        ) : (
                            <>
                                <Text type="secondary">Resultado:</Text>
                                <br />
                                <Text>
                                    <TrophyOutlined /> {result || '-'}
                                </Text>
                            </>
                        )}
                    </div>
                    <Countdown title="Encerramento da aposta:" value={finishedConfronto ? moment() : deadline} onFinish={onFinish} />
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