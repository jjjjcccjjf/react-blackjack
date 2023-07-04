import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { BustedType, CardType, GameState } from '../../types';

interface PlayerState {
    pile: CardType[],
    state: BustedType
    handValue: number,
}

interface BlackjackState {
    deckId: string,
    player: PlayerState,
    dealer: PlayerState,
    gameState: GameState
}

const initializeState = (): BlackjackState => {
    return {
        deckId: localStorage.getItem('deckId') ?? '',
        player: {
            pile: [],
            state: "SAFE",
            handValue: 0
        },
        dealer: {
            pile: [],
            state: "SAFE",
            handValue: 0
        },
        gameState: "INIT_GAME"
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
            state.player.pile = action.payload
        },
        setPlayerHandValue: (state, action: PayloadAction<number>) => {
            state.player.handValue = action.payload
        },
        setGameState: (state, action: PayloadAction<GameState>) => {
            state.gameState = action.payload
        }
    },
})

export const { setDeckId, setPlayerPile, setPlayerHandValue, setGameState } = blackjackSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default blackjackSlice.reducer