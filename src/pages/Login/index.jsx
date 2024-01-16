import React from 'react';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Modal } from 'antd';

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROLE_KEY, TOKEN_KEY, USER_ID_KEY } from '../../constants';
import { SupabaseContext } from '../../provider/SupabaseProvider';
import image from '../../assets/gameswp.png'

import './style.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const supabase = useContext(SupabaseContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const { username, password, remember } = values;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username,
                password: password,
            });

            if (error) {
                throw new Error('has errors!');
            }

            if (remember) {
                const access_token = `${data.session.token_type} ${data.session.access_token}`;
                localStorage.setItem(TOKEN_KEY, access_token);
                localStorage.setItem(ROLE_KEY, data.user.role);
                localStorage.setItem(USER_ID_KEY, data.user.id);
            }

            navigate('/bolao', { state: { successLogin: true } });
        } catch (e) {
            console.log(e);
            toast.error('Credenciais inválidas.', { position: 'top-center' });
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
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2> Login </h2>
                        </span>
                        <p className='p-fade-in' style={{ marginBottom: '16px' }}> Seja bem-vindo à sua comunidade de apostas. </p>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Preencha esse campo!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Preencha esse campo!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Senha"
                            />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Manter-se logado</Checkbox>
                                </Form.Item>
                            </Form.Item>
                            <a className="login-form-forgot" onClick={() => Modal.info({ title: 'Recurso ainda em desenvolvimento', content: 'Esse recurso ainda não está disponível para ser utilizado, caso tenha problemas com sua conta entre em contato com o admin.' })}>
                                Esqueci a senha
                            </a>
                        </div>

                        <Form.Item >
                            <Button
                                loading={loading}
                                style={{ width: '100%' }}
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                Login
                            </Button>
                            Ou
                            {' '}
                            <a onClick={() => navigate('/cadastro')}>Cadastre-se agora!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Login;