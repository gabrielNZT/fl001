/* eslint-disable no-undef */
import React from 'react';

import { createClient } from '@supabase/supabase-js';
import { createContext } from 'react';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const SupabaseContext = createContext(null);

const SupabaseProvider = ({ children }) => {
    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    );
};

export default SupabaseProvider;