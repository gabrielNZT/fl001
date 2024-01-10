import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Login, NotFound, ListTimes } from '../pages';
import { DetailsBolao, ListBolao } from '../pages/Bolao';
import PrivateRoute from './PrivateRoutes';

const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path='*' element={<NotFound />} />
                <Route path='/*' element={<PrivateRoute />}>
                    <Route path='bolao' element={<ListBolao />} />
                    <Route path='bolao/:id' element={<DetailsBolao />} />
                    <Route path='time' element={<ListTimes />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default RoutesConfig;