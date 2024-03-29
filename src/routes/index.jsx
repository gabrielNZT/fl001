import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Login, NotFound, ListTimes, Register, Rules } from '../pages';
import { DetailsBolao, ListBolao } from '../pages/Bolao';
import PrivateRoute from './PrivateRoutes';

const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path='/cadastro' element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path='*' element={<NotFound />} />
                <Route path='/*' element={<PrivateRoute />}>
                    <Route path='bolao' element={<ListBolao />} />
                    <Route path='bolao/:id' element={<DetailsBolao />} />
                    <Route path='time' element={<ListTimes />} />
                    <Route path='regras' element={<Rules />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default RoutesConfig;