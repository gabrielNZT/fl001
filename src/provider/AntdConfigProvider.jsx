import { ConfigProvider, theme } from 'antd';
import ptBR from 'antd/locale/pt_BR';

const AntdConfigProvider = ({ children }) => (
    <ConfigProvider
        locale={ptBR}
        theme={{
            algorithm: theme.darkAlgorithm,
            token: {
                colorPrimary: '#9E339F',
                borderRadius: 6
            }
        }}>
        {children}
    </ConfigProvider>
);

export default AntdConfigProvider;
