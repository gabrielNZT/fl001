import React, { useCallback, useContext, useEffect, useState } from "react";

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

import './style.css';

const DetailsBolao = () => {
    const [bolao, setBolao] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const supabase = useContext(SupabaseContext);
    const { id } = useParams();
    const { description, name, image_bolao } = bolao;

    const fetchDetails = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('bolao')
                .select()
                .eq('id', id);

            if (error) {
                throw error;
            }

            setBolao(data[0] || {});
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível carregar os detalhes do bolão. Entre em contato com o suporte.')

        } finally {
            setLoading(false);
        }
    }, []);


    const items = [
        { key: '1', label: 'Confrontos', children: <TabConfrontos loadingDetails={loading} /> },
        { key: '2', label: 'Bets', children: <TabBets /> },
        { key: '3', label: 'Participantes', children: <TabUsers /> },
    ];

    const goBack = () => {
        navigate('/bolao');
    };

    useEffect(() => {
        fetchDetails();
    }, []);

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
                                <Button icon={<CheckCircleOutlined />} type="primary"> Participar </Button>
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