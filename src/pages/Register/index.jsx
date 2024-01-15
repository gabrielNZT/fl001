import React from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SupabaseContext } from '../../provider/SupabaseProvider';
import image from '../../assets/gameswp.png'

import './style.css';

const Register = () => {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = useContext(SupabaseContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const { username, password, nickname } = values;
        try {
            const { data: nicks } = await supabase
                .from('profiles')
                .select('nick')
                .eq('nick', nickname);

            if (nicks?.length > 0) {
                toast.error('Esse nick já está em uso!');
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email: username,
                password: password,
            });

            if (error) {
                throw error;
            }

            const { error: saveProfileError } = await supabase
                .from('profiles')
                .insert([
                    { email: username,  nick: nickname, user_id: data.user.id }
                ])
                .select()

            if (saveProfileError) {
                throw saveProfileError;
            }

            setSuccess(true);

        } catch (e) {
            console.log(e);
            toast.error('Não foi possível prosseguir com seu cadastro, entre em contato com o suporte!', { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <img src={image} style={{ position: 'absolute', height: '100vh', width: '100%' }} />
            <div style={{ position: 'relative' }} className='login-container'>
                <div className='login-container-card'>
                    <Form
                        layout='vertical'
                        name="normal_register"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ArrowLeftOutlined onClick={() => navigate('/login')} className='arrow-back' />
                                <h2> Cadastro </h2>
                            </span>
                        </span>
                        <p className='p-fade-in' style={{ marginBottom: '16px' }}> Entre agora mesmo na nossa comunidade! </p>
                        <Form.Item
                            label="Nick"
                            name="nickname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Preencha esse campo!',
                                },
                            ]}
                        >
                            <Input maxLength={16} showCount placeholder="Nick" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Preencha esse campo!',
                                },
                                {
                                    type: 'email',
                                    message: 'Formato de e-mail inválido!',
                                },
                            ]}
                        >
                            <Input type='email' placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            label="Senha"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Preencha esse campo!',
                                },
                                {
                                    min: 8,
                                    message: 'A senha deve ter pelo menos 8 caracteres!',
                                },
                            ]}
                        >
                            <Input.Password
                                type="password"
                                placeholder="Senha"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Confirme sua Senha"
                            name="confirm_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Preencha esse campo!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('As senhas não coincidem!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                type="password"
                                placeholder="Confirme sua Senha"
                            />
                        </Form.Item>
                        <Form.Item >
                            <Button
                                loading={loading}
                                style={{ width: '100%', marginTop: '8px' }}
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                Cadastre-se agora!
                            </Button>
                        </Form.Item>
                    </Form>
                    {success && <Alert style={{ marginBottom: '16px' }} message="Um email de confirmação foi enviado." type='success' showIcon />}
                </div>
            </div>
        </>
    );
};

export default Register;