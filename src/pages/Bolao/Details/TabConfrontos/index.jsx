import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Collapse, Empty, Form, Select, Spin, Statistic } from "antd";
import { CardConfronto, CreateConfronto } from "components";
import { USER_ID_KEY } from "constants";
import moment from "moment";
import { SupabaseContext } from "provider/SupabaseProvider";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CountUp from 'react-countup';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const formatter = (value) => <CountUp end={value} separator="," />;

const TabConfrontos = ({ loadingDetails, isParticipating }) => {
    const [countResultsFilter, setCountResultsFilter] = useState(0);
    const [allConfrontos, setAllConfrontos] = useState([]);
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

    const agroupData = (data) => {
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
    }

    const fetchConfrontos = useCallback(async () => {
        setLoading(prev => !prev ? true : prev);
        try {
            const { data, error } = await supabase
                .rpc('getconfrontos', { bol_id: parseInt(id), userid: localStorage.getItem(USER_ID_KEY) })

            if (error) {
                throw error;
            }

            setAllConfrontos(data);
            setCountResultsFilter(data.length)
            agroupData(data);

        } catch (e) {
            console.log(e);
            toast.error('Não foi possível obter os confrontos. entre em contato com o suporte');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFilters = (value) => {
        const isAcert = ({ result, selected_team_id, time1_id, time2_id }) => {
            try {
                if (!result) {
                    return null;
                }

                const scoreTime1 = parseInt(result?.split('-')[0]);
                const scoreTime2 = parseInt(result?.split('-')[1]);
                const winner_time_id = (scoreTime1 === scoreTime2 ? null : (scoreTime1 > scoreTime2 ? time1_id : time2_id));
                if (winner_time_id && selected_team_id) {
                    if (winner_time_id === selected_team_id) {
                        return true;
                    } else {
                        return false;
                    }
                }

            } catch (e) {
                console.warn(e);
            }
        }

        setLoading(true);
        new Promise((resolve, reject) => {
            setTimeout(() => {
                switch (value) {
                    case 'win':
                        const wins = [];
                        allConfrontos.forEach((confronto) => {
                            if (isAcert(confronto)) {
                                wins.push(confronto);
                            }
                        });
                        setCountResultsFilter(wins.length);
                        agroupData(wins);
                        resolve();
                        return;
                    case 'lose':
                        const loses = [];
                        allConfrontos.forEach((confronto) => {
                            if (isAcert(confronto) === false) {
                                loses.push(confronto);
                            }
                        });
                        setCountResultsFilter(loses.length);
                        agroupData(loses);
                        resolve();
                        return;
                    default:
                        agroupData(allConfrontos);
                        setCountResultsFilter(allConfrontos.length)
                        resolve();
                        return;
                }
            }, 400)
        })
            .finally(() => {
                setLoading(false);
            })
    }

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
                <Form.Item style={{ margin: 0 }} label={'Filtrar por'}>
                    <Select
                        onChange={handleFilters}
                        size="large"
                        style={{ maxWidth: '200px' }}
                        defaultValue={'all'}
                        options={[
                            { label: 'Acertos', value: 'win' },
                            { label: 'Erros', value: 'lose' },
                            { label: 'Todos', value: 'all' }
                        ]}
                    />
                </Form.Item>
                <Statistic title="Confrontos" value={countResultsFilter} formatter={formatter} />
                <Alert showIcon message="Cada acerto de confronto da fase de pontos equivale a 1 ponto, já os playoffs equivale a 1.5 pontos." type="info" />
                <Collapse size="large" defaultActiveKey={'1'} >
                    <Collapse.Panel header="Rodadas atuais" key={'1'}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
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