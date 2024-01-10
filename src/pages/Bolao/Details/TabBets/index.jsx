import { Empty } from "antd";
import React from "react";

const TabBets = () => {
    return (
        <div className="fade-in">
            <Empty description={<h2> Não há nenhuma bet </h2>} >
                <p> Entre em contato com o admin da página para criar as bets. </p>
            </Empty>
        </div>
    );
}

export default TabBets;