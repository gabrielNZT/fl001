import React, { useState } from 'react';
import { Modal, Checkbox, Button, Typography } from 'antd';
import { ACCEPT_TERMS_KEY } from 'constants';

const { Text } = Typography;

const TermsModal = () => {
    const [visible, setVisible] = useState(!localStorage.getItem(ACCEPT_TERMS_KEY));
    const [isCheckboxChecked, setCheckboxChecked] = useState(false);
    const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);

    const handleCheckboxChange = (e) => {
        setCheckboxChecked(e.target.checked);
        setConfirmButtonDisabled(!e.target.checked);
    };

    const handleConfirm = () => {
        localStorage.setItem(ACCEPT_TERMS_KEY, 'true');
        setVisible(false);
    };

    return (
        <Modal
            closable={false}
            maskClosable={false}
            title="Termos de Serviço"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={[
                <Button
                    key="confirm"
                    type="primary"
                    onClick={handleConfirm}
                    disabled={confirmButtonDisabled}
                >
                    Confirmar
                </Button>,
            ]}
            style={{ maxHeight: '80vh' }}  // Define uma altura máxima para permitir rolagem
        >
            <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 108px)' }}>
                <Text>
                    Dentre os fatores desclassificantes, incluem-se comportamentos antiéticos, desrespeito de qualquer natureza, seja em relação a times ou mesmo com a intenção de prejudicar outra pessoa. Além disso, discussões sobre temas não relacionados ao foco do Bolão também serão consideradas como um fator passível de punição. Buscamos manter um ambiente saudável e respeitoso para a experiência positiva de todos os participantes.
                </Text>
                <br />
                <br />
                <Text strong>Distribuição das Premiações:</Text>
                <ul>
                    <li>1° Lugar: 4.035 RP</li>
                    <li>2° Lugar: 1.990 RP</li>
                    <li>3° Lugar: 1.585 RP</li>
                    <li>4° Lugar: 755 RP</li>
                </ul>
            </div>
            <Checkbox checked={isCheckboxChecked} onChange={handleCheckboxChange}>Eu li e aceito os termos</Checkbox>
        </Modal>
    );
};

export default TermsModal;
