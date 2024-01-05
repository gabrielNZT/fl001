import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CustomLayout } from '../components';
import { TOKEN_KEY } from '../constants';

const PrivateRoute = ({ ...rest }) => {
    const location = useLocation();
    const token = localStorage.getItem(TOKEN_KEY);

    const authenticated = !!token || location.state?.successLogin;

    if (!authenticated) {
        return <Navigate to='/login' />;
    }

    return (
        <CustomLayout>
            <Outlet {...rest} />
        </CustomLayout>
    );
};

export default PrivateRoute;