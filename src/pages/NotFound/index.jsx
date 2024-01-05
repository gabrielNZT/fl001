import { Button, Result } from 'antd';

import { useNavigate } from 'react-router-dom';
import './style.css';

const NotFound = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/bolao');
    };

    return (
        <div className='not-found-container'>
            <Result
                status="404"
                title="404"
                subTitle="Desculpe, a página que você tentou visitar não existe."
                extra={<Button onClick={goToHome} type="primary">Ir para início</Button>}
            />
        </div >
    );
};

export default NotFound;