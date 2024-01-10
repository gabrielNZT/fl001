import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    availables: [],
    participating: [],
    finished: [],
};

const bolaoSlice = createSlice({
    name: 'bolao',
    initialState,
    reducers: {
        setAvailables: (state, action) => {
            state.availables.push(action.payload);
        },
        setParticipating: (state, action) => {
            state.participating.push(action.payload);
        },
        setFinished: (state, action) => {
            state.finished.push(action.payload);
        },
        setAll: (state, action) => {
            const { avaibleList, participatingList, finishedList } = action.payload || {};
            state.availables = avaibleList;
            state.participating = participatingList;
            state.finished = finishedList;
        }
    },
});

export const { setAvailables, setParticipating, setFinished, setAll } = bolaoSlice.actions;
export default bolaoSlice.reducer;
