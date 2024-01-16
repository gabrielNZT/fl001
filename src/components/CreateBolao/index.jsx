import React, { useEffect } from 'react';

import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin, Upload } from 'antd';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { SupabaseContext } from '../../provider/SupabaseProvider';
import { Private } from '../index';

import './style.css';

const CreateBolao = ({ fetchBoloes, isUpdate = false, initialValues = {}, bolaoId }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabase = useContext(SupabaseContext);
    const [form] = Form.useForm();

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

            let pathImage = null;
            const { name, description, image_bolao } = values || {};

            if (image_bolao) {
                const file = image_bolao[0].originFileObj;
                const pathFile = `bolao/${file.name}`;
                const { data: response } = await supabase.storage
                    .from('imagesFL001')
                    .upload(pathFile, file);

                pathImage = response?.fullPath;

                if (pathImage) {
                    const { data: responseImage } = await supabase
                        .storage
                        .from('imagesFL001')
                        .getPublicUrl(pathFile);

                    pathImage = responseImage.publicUrl;
                }
            }

            if (!isUpdate) {
                const { error } = await supabase
                    .from('bolao')
                    .insert({
                        description,
                        name,
                        ...(!!pathImage && { image_bolao: pathImage })
                    });

                if (error) {
                    throw error;
                }
            } else {
                const { error } = await supabase
                    .from('bolao')
                    .update({
                        description,
                        name,
                        ...(!!pathImage && { image_bolao: pathImage })
                    })
                    .eq('id', bolaoId);

                if (error) {
                    throw error;
                }
            }

            toast.success('Bolão criado com sucesso!');
            closeModal();
            fetchBoloes();
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível criar o bolão, entre em contato com o suporte.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);

    return (
        <>
            <Private>
                <Button type='primary' onClick={openModal} > {!isUpdate ? 'Criar bolão' : 'Editar'} </Button>
            </Private>
            <Modal
                open={open}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText="Salvar"
                title="Criar Bolão"
            >
                <Spin spinning={loading} tip="Criando bolão..." indicator={<LoadingOutlined />} >
                    <Form
                        form={form}
                        layout='vertical'
                        onFinish={handleFormSubmit}
                    >
                        <Form.Item label={"Nome"} name="name" rules={[{ required: true, message: 'Por favor, insira o nome' }]}>
                            <Input maxLength={32} count={{ show: true, max: 32 }} />
                        </Form.Item>
                        <Form.Item label={"Descrição"} name="description" rules={[{ required: true, message: 'Por favor, insira a descrição' }]}>
                            <Input.TextArea maxLength={128} count={{ show: true, max: 128 }} />
                        </Form.Item>
                        <Form.Item
                            name="image_bolao"
                            label="Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                accept={['image/png', 'image/jpg', 'image/jpeg']}
                                listType="picture"
                                showPreviewIcon={false}
                                action={undefined}
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};

export default CreateBolao;
