import React, { useLayoutEffect, useState } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROLE_KEY, TOKEN_KEY, USER_ID_KEY } from '../../constants';
import './style.css';
import { isAdmin } from '../Private';

const { Header, Content, Footer } = Layout;

const CustomLayout = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState();

    const navigate = useNavigate();
    const location = useLocation();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleExit = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(USER_ID_KEY);
        navigate('/login');
    };

    const itemsDropdown = [
        {
            label: <a href="https://www.antgroup.com">Ver pefil</a>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={handleExit} style={{ color: 'red', display: 'flex', justifyContent: 'space-between' }}> Sair <LogoutOutlined /> </span>,
            key: '3',
        },
    ];

    const hashTableUrl = {
        '1': '/bolao',
        '2': '/time'
    }

    const items = [
        {
            key: '1',
            label: 'Bolões',
        }
    ];

    if (isAdmin()) {
        items.push({
            key: '2',
            label: 'Times',
        });
    }

    const handleChangeMenu = (menu) => {
        navigate(hashTableUrl[menu.key]);
        setSelectedMenu(prev => menu.keyPath || prev);
    }

    useLayoutEffect(() => {
        setSelectedMenu(() => Object.entries(hashTableUrl).find(([, value]) => location.pathname.includes(value))[0])
    }, []);

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Menu
                    onClick={handleChangeMenu}
                    mode="horizontal"
                    selectedKeys={selectedMenu}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', width: '80px' }}>
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: itemsDropdown
                        }}
                    >
                        <Avatar style={{ cursor: 'pointer' }} size={48} icon={<UserOutlined />} />
                    </Dropdown>
                </div>
            </Header>
            <Content
                style={{
                    padding: '0 48px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                </Breadcrumb>
                <div
                    className='fade-in'
                    style={{
                        padding: 24,
                        minHeight: 600,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        color: 'white'
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                BOLAO 2024 ©2023 Created by NZT
            </Footer>
        </Layout>
    );
};
export default CustomLayout;