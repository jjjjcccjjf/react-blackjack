import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CardType, GameState } from '../../types';
import { RootState } from '../store';
import { getCalculatedHandValue, getRawHandValue } from '../../helpers';

interface PlayerState {
    pile: CardType[],
    handValue: number,
}

interface BlackjackState {
    deckId: string;
    players: {
        [key: string]: PlayerState
    }
    gameState: GameState,
    bestStreak: number,
    currentStreak: number,
}

export const calculateHandValueAsync = createAsyncThunk(
    'blackjack/calculateHandValueAsync',
    async (player: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState

        try {
            const handArray = await getRawHandValue(state.blackjack.players[player].pile)
            const handValue = await getCalculatedHandValue(handArray)
            console.log(`${player}'s hand value: ${handValue}`);

            return { player, handValue }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
)

const initializeState = (): BlackjackState => {
    const deckId = localStorage.getItem('deckId')
    const bestStreak = localStorage.getItem('bestStreak')
    return {
        deckId: deckId ?? '',
        players: {
            "player": {
                pile: [],
                handValue: 0
            },
            "dealer": {
                pile: [],
                handValue: 0
            },
        },
        gameState: "INIT_GAME",
        bestStreak: bestStreak ? parseInt(bestStreak) : 0,
        currentStreak: 0
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
        setGameState: (state, action: PayloadAction<GameState>) => {
            state.gameState = action.payload
        },
        setCurrentStreak: (state, action: PayloadAction<number>) => {
            state.currentStreak = action.payload
        },
        setBestStreak: (state, action: PayloadAction<number>) => {
            state.bestStreak = action.payload
        },
        setPile: (state, action: PayloadAction<{ pile: CardType[], player: string }>) => {
            const { pile, player } = action.payload
            state.players[player].pile = pile
        },
        initializeGame(state, action: PayloadAction) {
            state.gameState = 'INIT_GAME'
            state.players = {
                "player": {
                    pile: [],
                    handValue: 0
                },
                "dealer": {
                    pile: [],
                    handValue: 0
                },
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(calculateHandValueAsync.fulfilled, (state, action: PayloadAction<{ handValue: number, player: string }>) => {
            const { handValue, player } = action.payload
            state.players[player].handValue = handValue
        });
    }
})

export const { setDeckId, setGameState, setPile, setCurrentStreak, setBestStreak, initializeGame } = blackjackSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default blackjackSlice.reducer