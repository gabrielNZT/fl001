import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Collapse, Empty, Spin } from "antd";
import { CardConfronto, CreateConfronto } from "components";
import { USER_ID_KEY } from "constants";
import moment from "moment";
import { SupabaseContext } from "provider/SupabaseProvider";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TabConfrontos = ({ loadingDetails, isParticipating }) => {
    const [confrontos, setConfrontos] = useState({ currentWeek: [], outhers: {} });
    const [loading, setLoading] = useState(true);

    const supabase = useContext(SupabaseContext);
    const { id } = useParams();

    const pertenceSemanaAtual = data => {
        const dataAtual = moment();
        const dataFornecida = moment(data, 'DD/MM/YYYY');

        const inicioSemanaAtual = dataAtual.startOf('isoWeek').format('YYYY-MM-DD');
        const fimSemanaProxima = dataAtual.add(1, 'week').startOf('isoWeek').format('YYYY-MM-DD');

        return dataFornecida.isBetween(inicioSemanaAtual, fimSemanaProxima, null, '[]');
    };

    const fetchConfrontos = useCallback(async () => {
        setLoading(prev => !prev ? true : prev);
        try {
            const { data, error } = await supabase
                .rpc('getconfrontos', { bol_id: parseInt(id), userid: localStorage.getItem(USER_ID_KEY) })

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

            data.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateA - dateB;
            });

            const groupByDate = {};
            let roudNumber = 1;
            data.forEach((confronto) => {
                confronto['group'] = `Rodada ${roudNumber}`;

                if (groupByDate[confronto.date]) {
                    groupByDate[confronto.date] = [...groupByDate[confronto.date], confronto];
                } else {
                    groupByDate[confronto.date] = [confronto];
                    roudNumber++;
                }
            });

            const outhersGroupByDate = {};
            const currentByDate = {};
            Object.entries(groupByDate).forEach(([date, confrontos]) => {
                if (!pertenceSemanaAtual(date)) {
                    outhersGroupByDate[date] = confrontos;
                } else {
                    currentByDate[date] = confrontos;
                }
            });

            setConfrontos({ currentWeek: currentByDate, outhers: outhersGroupByDate });
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível obter os confrontos. entre em contato com o suporte');
        } finally {
            setLoading(false);
        }
    }, []);

    const propsCardConfronto = {
        isParticipating,
        refetchConfrontos: fetchConfrontos
    };

    useEffect(() => {
        fetchConfrontos();
    }, [fetchConfrontos]);

    return (
        <Spin spinning={loadingDetails ? false : loading} tip="Carregando confrontos..." indicator={<LoadingOutlined />}>
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CreateConfronto refetchConfrontos={fetchConfrontos} />
                <Alert showIcon message="Cada acerto de confronto da fase de pontos equivale a 1 ponto, já os playoffs equivale a 1.5 pontos." type="info" />
                <Collapse size="large" defaultActiveKey={'1'} >
                    <Collapse.Panel header="Rodadas atuais" key={'1'}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h1> Esses são os confrontos da semana, aposte agora! </h1>
                            {!Object.values(confrontos.currentWeek).length && <Empty description="Não há nenhum confronto há ser listado." />}
                            {Object.entries(confrontos.currentWeek).map(([, confrontosList]) => {
                                return (
                                    <>
                                        <div className="card-confrontos-list">
                                            <h3> {confrontosList[0].group} - {confrontosList[0].date} </h3>
                                            <div className="card-confrontos-list-container">
                                                {confrontosList.map((confronto) => <CardConfronto key={confronto.id} {...confronto}  {...propsCardConfronto} />)}
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="Outras" key={'2'}>
                        {!Object.values(confrontos.outhers).length && <Empty description="Não há nenhum confronto há ser listado." />}
                        {Object.entries(confrontos.outhers).map(([, confrontosList]) => {
                            return (
                                <>
                                    <div className="card-confrontos-list">
                                        <h2> {confrontosList[0].group} - {confrontosList[0].date} </h2>
                                        <div className="card-confrontos-list-container">
                                            {confrontosList.map((confronto) => <CardConfronto disabled key={confronto.id} {...confronto}  {...propsCardConfronto} />)}
                                        </div>
                                    </div>
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