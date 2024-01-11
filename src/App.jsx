
import React from 'react';
import AntdConfigProvider from './provider/AntdConfigProvider';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import SupabaseProvider from './provider/SupabaseProvider';
import Routes from './routes';

function App() {
  return (
    <>
      <SupabaseProvider>
        <AntdConfigProvider>
          <ToastContainer position='top-center' limit={1} />
          <Routes />
        </AntdConfigProvider>
      </SupabaseProvider>
    </>
  );
}

export default App;
