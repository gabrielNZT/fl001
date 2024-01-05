// src/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Defina a URL base da sua API
    endpoints: (builder) => ({
        // Adicione suas queries aqui
        getData: builder.query({
            query: () => 'data', // Substitua pela sua lógica de consulta
        }),
    }),
});

export const { useGetDataQuery } = api;
