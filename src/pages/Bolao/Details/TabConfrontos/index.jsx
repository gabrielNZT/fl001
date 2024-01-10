import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Collapse, Empty, Spin } from "antd";
import { CardConfronto, CreateConfronto } from "components";
import moment from "moment";
import { SupabaseContext } from "provider/SupabaseProvider";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TabConfrontos = ({ loadingDetails }) => {
    const [confrontos, setConfrontos] = useState({ currentWeek: [], outhers: {} });
    const [loading, setLoading] = useState(true);
    console.log(confrontos);
    const supabase = useContext(SupabaseContext);
    const { id } = useParams();

    const pertenceSemanaAtual = data => {
        const dataAtual = moment();
        const dataFornecida = moment(data, 'DD/MM/YYYY');

        const inicioSemanaAtual = dataAtual.startOf('week');
        const fimSemanaAtual = dataAtual.endOf('week');

        return dataFornecida.isBetween(inicioSemanaAtual, fimSemanaAtual, null, '[]');
    };


    const fetchConfrontos = useCallback(async () => {
        setLoading(prev => !prev ? true : prev);
        try {
            const { data, error } = await supabase
                .rpc('getconfrontos', { bol_id: parseInt(id) })

            if (error) {
                throw error;
            }

            const currentWeek = [];
            const outhers = [];

            data.forEach((confronto) => {
                if (pertenceSemanaAtual(confronto.date)) {
                    currentWeek.push(confronto);
                } else {
                    outhers.push(confronto);
                }
            });

            const groupByDate = {};

            data.forEach((confronto, index) => {
                confronto['group'] = `Rodada ${index + 1}`;
                if (!pertenceSemanaAtual(confronto.date)) {
                    if (groupByDate[confronto.date]) {
                        groupByDate[confronto.date] = [...groupByDate[confronto.date], confronto];
                    } else {
                        groupByDate[confronto.date] = [confronto];
                    }
                }
            });

            setConfrontos({ currentWeek, outhers: groupByDate });
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível obter os confrontos. entre em contato com o suporte');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfrontos();
    }, [fetchConfrontos]);

    return (
        <Spin spinning={loadingDetails ? false : loading} tip="Carregando confrontos..." indicator={<LoadingOutlined />}>
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CreateConfronto refetchConfrontos={fetchConfrontos} />
                <Alert showIcon message="Cada acerto de confronto da fase de pontos equivale a 1 ponto, já os playoffs equivale a 2.5 pontos." type="info" />
                <Collapse size="large" defaultActiveKey={'1'} >
                    <Collapse.Panel header="Rodadas atuais" key={'1'}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h3> Esses são os confrontos da semana, aposte agora! </h3>
                            <div className="card-confrontos-list">
                                {!confrontos.currentWeek.length ?
                                    <Empty description="Não há nenhum confronto para essa semana cadastrado." /> : (
                                        <div className="card-confrontos-list-container">
                                            {confrontos.currentWeek.map((confronto) => <CardConfronto key={confronto.id} {...confronto} />)}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="Outras" key={'2'}>
                        {Object.entries(confrontos.outhers).map(([, confrontosList]) => {
                            return (
                                <>
                                    {!confrontosList.length ? <Empty description="Não há nenhum confronto há ser listado." /> : (
                                        <div className="card-confrontos-list">
                                            <h2> {confrontosList[0].group} </h2>
                                            <div className="card-confrontos-list-container">
                                                {confrontosList.map((confronto) => <CardConfronto key={confronto.id} {...confronto} />)}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )
                        })}
                    </Collapse.Panel>
                </Collapse>
            </div>
        </Spin>
    );
}

export default TabConfrontos;