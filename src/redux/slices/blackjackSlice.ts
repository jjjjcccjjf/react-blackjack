import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { CardType } from '../../types';

// Define a type for the slice state
interface BlackjackState {
    deckId: string,
    playerPile: CardType[],
    dealerPile: CardType[]
}

// Define the initial state using that type
// const initialState: BlackjackState = {
//     value: 0,
// }

const initializeState = (): BlackjackState => {
    // Perform any necessary initialization logic here
    return {
        deckId: localStorage.getItem('deckId') ?? '',
        playerPile: [],
        dealerPile: [],
    };
};

const initialState: BlackjackState = initializeState();

export const blackjackSlice = createSlice({
    name: 'blackjack',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setDeckId: (state, action: PayloadAction<string>) => {
            state.deckId = action.payload
        },
        setPlayerPile: (state, action: PayloadAction<CardType[]>) => {
            state.playerPile = action.payload
        }
        // increment: (state) => {
        //     state.value += 1
        // },
        // decrement: (state) => {
        //     state.value -= 1
        // },
        // Use the PayloadAction type to declare the contents of `action.payload`
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload
        // },
    },
})

export const { setDeckId, setPlayerPile } = blackjackSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default blackjackSlice.reducer