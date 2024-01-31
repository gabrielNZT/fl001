import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Statistic, Table, message } from "antd"
import CountUp from 'react-countup';
import useSearchTable from "hooks/useSearchTable";
import { SupabaseContext } from "provider/SupabaseProvider";
import React, { useContext, useMemo, useState } from "react"
import { PieBar } from "components";

const formatter = (value) => <CountUp end={value} separator="," />;

const ViewVotes = ({ confrontoId, times = [] }) => {
    const supabase = useContext(SupabaseContext);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const optionsSelect = useMemo(() => times.map((time) => ({ text: time.name, value: time.name })), [times]);
    const dataCharts = useMemo(() => {
        const time1 = times[0] || {};
        const times2 = times[1] || {};

        const parameters1 = { name: time1.name, count: data.filter((record) => record.name === time1.name).length };
        const parameters2 = { name: times2.name, count: data.filter((record) => record.name === times2.name).length };

        return [parameters1, parameters2];
    }, [data, times]);


    const getSearchProps = useSearchTable();

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: responseData, error } = await supabase
                .rpc('obter_dados_confronto', {
                    confrontoid: confrontoId
                })
            if (error) {
                throw new Error(error);
            }

            setData(responseData);
        } catch (e) {
            message.error('Não foi possível obter os confrontos');
        } finally {
            setLoading(false);
        }
    }

    const openModal = () => {
        setOpen(true);
        fetchData();
    }

    const closeModal = () => {
        setOpen(false);
    }

    return (
        <>
            <Button type="primary" ghost onClick={openModal}> Ver apostas </Button>
            <Modal
                open={open}
                title='Ver apostas'
                onCancel={closeModal}
                footer={[<Button key='1' onClick={closeModal} type="default"> Fechar</Button>]}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Statistic title="Total de apostas" value={data.length} formatter={formatter} />
                    </div>
                    <PieBar data={dataCharts} />
                </span>
                <Table
                    rowKey={'nick'}
                    dataSource={data}
                    columns={[
                        { title: 'Nick', dataIndex: 'nick', key: 'nick', ...getSearchProps('nick') },
                        {
                            title: 'Time selecionado', dataIndex: 'name', key: 'name', filters: optionsSelect,
                            onFilter: (value, record) => record.name.includes(value),
                        }
                    ]}
                    loading={{
                        spinning: loading,
                        indicator: <LoadingOutlined />,
                        size: "large"
                    }}
                    scroll={{ y: 250 }}

                />
            </Modal>
        </>
    );
}

export default ViewVotes;