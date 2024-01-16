import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Button, DatePicker, Form, Modal, Select, Spin } from "antd";
import { Private } from "components";
import moment from "moment";
import { SupabaseContext } from "provider/SupabaseProvider";
import React, { useCallback, useContext, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { insensitiveSearch } from "utils";

const requiredRule = { required: true, message: 'Preencha esse campo!' };

const CreateConfronto = ({ refetchConfrontos }) => {
    const [loadingSave, setLoadingSave] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allTimes, setAllTimes] = useState([]);
    const [open, setOpen] = useState(false);

    const [form] = Form.useForm();

    const time1_id = Form.useWatch('time1_id', form);
    const time2_id = Form.useWatch('time2_id', form);
    const { id } = useParams();

    const supabase = useContext(SupabaseContext);

    const openModal = () => {
        setOpen(true);
        fetchTimes();
    }
    const closeModal = () => {
        setOpen(false);
    }

    const filterOptionSelect = (input, option) => insensitiveSearch(option.label, input);

    const fetchTimes = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('time')
                .select('id, name');

            if (error) {
                throw error;
            }


            setAllTimes(data.map((time) => ({ value: time.id, label: `${time.id} - ${time.name}` })));
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível carregar os times. Entre em contato com o suporte.');
            closeModal();
        } finally {
            setLoading(false);
        }
    }, []);

    const onFinish = (callback) => {
        form.validateFields().then(async (values) => {
            setLoadingSave(true);
            try {
                values['bolao_id'] = id;
                values['expire'] = values.expire?.format('DD/MM/YYYY HH:mm');
                values['date'] = values.date.format('DD/MM/YYYY');

                const payload = [];
                Object.entries(values).forEach(([key, value]) => {
                    payload.push({ [key]: value });
                });
                const { error } = await supabase
                    .from('confronto')
                    .insert(values)
                    .select();

                if (error) {
                    throw error;
                }

                toast.success('Confronto criado com sucesso!');
            } catch (e) {
                console.log(e);
                toast.error('Não foi possível salvar o confronto. Entre em contato com o suporte');
            } finally {
                setLoadingSave(false);
                callback?.();
                refetchConfrontos();
            }
        });
    }

    const onSave = () => {
        const callback = () => {
            closeModal();
            form.resetFields();
        }

        onFinish(callback)
    }

    const saveAndContinues = () => {
        const callback = () => {
            form.resetFields();
        }

        onFinish(callback);
    }

    const disabledDates = (current) => {
        return current && current < moment().startOf('day');
    }

    return (
        <Private>
            <Button onClick={openModal} style={{ width: 'fit-content' }} size="large" type="primary" ghost> Criar confronto </Button>
            <Modal
                onCancel={closeModal}
                open={open}
                title="Criar confronto"
                footer={[
                    <Button key="1" onClick={closeModal} > Cancelar </Button>,
                    <Button key="2" type="primary" ghost onClick={onSave} disabled={loading || loadingSave}> Salvar </Button>,
                    <Button key="3" type="primary" onClick={saveAndContinues} disabled={loading || loadingSave}> Salvar e continuar </Button>
                ]}
            >
                <Spin spinning={loading || loadingSave} tip={loading ? "Carregando times..." : "Salvando confronto..."} indicator={<LoadingOutlined />} >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ phase: 'groups' }}
                    >
                        <Alert
                            style={{ marginBottom: '16px' }}
                            showIcon
                            type="info"
                            message="Caso não seja informada o horário de encerramento das apostas, será considerado 13:00 horas no dia do confronto."
                        />
                        <Form.Item required name={"time1_id"} label="Time mandante" rules={[requiredRule]}>
                            <Select
                                options={allTimes.filter((time) => time.value !== time2_id)}
                                showSearch
                                filterOption={filterOptionSelect}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item required name={"time2_id"} label="Time visitante" rules={[requiredRule]}>
                            <Select
                                options={allTimes.filter((time) => time.value !== time1_id)}
                                showSearch
                                filterOption={filterOptionSelect}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item required name={"phase"} label="Fase" rules={[requiredRule]}>
                            <Select
                                defaultValue={'groups'}
                                options={[{ label: 'Fase de grupos', value: 'groups' }, { label: 'Playoff', value: 'playoff' }]}
                            />
                        </Form.Item>
                        <Form.Item required name={"date"} label="Data do confronto" rules={[requiredRule]}>
                            <DatePicker
                                style={{ width: '200px' }}
                                //disabledDate={disabledDates}
                                format={"DD/MM/YYYY"}
                            />
                        </Form.Item>
                        <Form.Item name={"expire"} label="Encerramento das apostas">
                            <DatePicker
                                style={{ width: '200px' }}
                                disabledDate={disabledDates}
                                format={"DD/MM/YYYY HH:mm"}
                                showTime
                                showHour
                                showMinute
                                showNow={false}
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </Private>
    );
}

export default CreateConfronto;