import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ArrowLeftOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Spin, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import TabConfrontos from "./TabConfrontos";
import TabBets from "./TabBets";
import TabUsers from "./TabUsers";

import { SupabaseContext } from "provider/SupabaseProvider";
import { DEFAULT_IMAGE_BASE_64 } from "constants";
import { isAdmin } from "components/Private";
import { USER_ID_KEY } from "constants";

import './style.css';

const DetailsBolao = () => {
    const [loadingParticipating, setLoadingParticipating] = useState(false);
    const [isParticipating, setIsParticipating] = useState();
    const [bolao, setBolao] = useState({});
    const [loading, setLoading] = useState(true);
    const [bolaoUsers, setBolaoUsers] = useState([]);

    const navigate = useNavigate();

    const supabase = useContext(SupabaseContext);
    const { id } = useParams();
    const { description, name, image_bolao } = bolao;

    const user_id = useMemo(() => localStorage.getItem(USER_ID_KEY), []);

    const fetchDetails = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('bolao')
                .select()
                .eq('id', id);

            if (error) {
                throw error;
            }

            if (!data.length) {
                navigate('/bolao');
                toast.info('Esse bolão não existe.');
                return;
            }

            setBolao(data[0] || {});
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível carregar os detalhes do bolão. Entre em contato com o suporte.')

        } finally {
            setLoading(false);
        }
    }, [id, navigate, supabase]);

    const participingBolao = async () => {
        setLoadingParticipating(true);
        try {
            const { error } = await supabase
                .from('bolao_user')
                .insert([
                    { user_id, bolao_id: id, registered: true },
                ])
                .select();

            if (error) {
                throw error;
            }

            setIsParticipating(true);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingParticipating(false);
        }
    }

    const fetchIsParticipating = useCallback(async () => {
        try {
            const { data: bolao_user, error } = await supabase
                .from('bolao_user')
                .select('registered')
                .eq('user_id', user_id)
                .eq('bolao_id', id);

            if (error) {
                throw error;
            }

            setIsParticipating(!!bolao_user[0]?.registered);
        } catch (e) {
            console.log(e);
        }
    }, [id, supabase, user_id]);

    const fetchUsers = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_users_pontuacao', {
                    bolaoid: id
                });

            if (error) {
                throw error;
            }

            data.sort((a, b) => b.pontuacao - a.pontuacao);
            setBolaoUsers(data.map((user, index) => ({ position: index + 1, ...user })));
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível obter os usuários participantes!');
        }
    }, [id, supabase]);

    const items = [
        { key: '1', label: 'Confrontos', children: <TabConfrontos isParticipating={isParticipating} loadingDetails={loading} /> },
        { key: '2', label: 'Bets', children: <TabBets /> },
        { key: '3', label: 'Participantes', children: <TabUsers fetchUsers={fetchUsers} bolaoUsers={bolaoUsers} /> },
    ];

    const goBack = () => {
        navigate('/bolao');
    };

    useEffect(() => {
        Promise.all([fetchDetails(), fetchIsParticipating(), fetchUsers()]);
    }, [fetchDetails, fetchIsParticipating, fetchUsers]);

    return (
        <Spin size="large" spinning={loading} tip="Carregando  dados..." indicator={<LoadingOutlined />} >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ borderBottom: '1px solid white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <ArrowLeftOutlined className="arrow-return" onClick={goBack} />
                            <h1> {name} </h1>
                        </span>
                        <img
                            src={image_bolao || DEFAULT_IMAGE_BASE_64}
                            alt="image-bolao"
                            style={{
                                height: '96px',
                                width: '96px',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', alignItems: 'flex-end', paddingBottom: '10px' }}>
                        <p style={{ maxWidth: '80%', overflowWrap: 'break-word' }}> {description} </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {isAdmin() ? (
                                <>
                                    <Button type="primary"> Editar </Button>
                                    <Button type="primary" danger> Deletar </Button>
                                </>
                            ) : (
                                <Button
                                    loading={loadingParticipating}
                                    disabled={isParticipating}
                                    icon={<CheckCircleOutlined />}
                                    onClick={participingBolao}
                                    type="primary"
                                >
                                    {isParticipating ? "Já inscrito" : "Participar"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <Tabs defaultActiveKey="1" type="card" items={items} />
            </div>
        </Spin>
    );
};

export default DetailsBolao;