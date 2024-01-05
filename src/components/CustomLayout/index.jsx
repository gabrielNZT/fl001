import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ROLE_KEY, TOKEN_KEY } from '../../constants';
import './style.css';

const { Header, Content, Footer } = Layout;

const CustomLayout = ({ children }) => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleExit = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
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

    const items = [
        {
            key: '1',
            label: 'Bolões'
        }
    ];

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
                <div style={{ display: 'flex', justifyContent: 'center', width: '100px' }} >
                    <img src={logo} alt='logo-intz' style={{ height: '48px', width: '48px', cursor: 'pointer' }} />
                </div>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
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
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
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
                INZT E2A ©2023 Created by NZT
            </Footer>
        </Layout>
    );
};
export default CustomLayout;