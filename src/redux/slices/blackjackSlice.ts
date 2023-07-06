import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { BustedType, CardType, GameState } from '../../types';
import { RootState } from '../store';
import { getCalculatedHandValue, getRawHandValue } from '../../helpers';

interface PlayerState {
    pile: CardType[],
    state: BustedType
    handValue: number,
}

interface BlackjackState {
    deckId: string;
    players: {
        [key: string]: PlayerState
    }
    gameState: GameState
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
    return {
        deckId: localStorage.getItem('deckId') ?? '',
        players: {
            "player": {
                pile: [],
                state: "SAFE",
                handValue: 0
            },
            "dealer": {
                pile: [],
                state: "SAFE",
                handValue: 0
            },
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
            state.players.player.pile = action.payload
        },
        setPlayerHandValue: (state, action: PayloadAction<number>) => {
            state.players.player.handValue = action.payload
        },
        setDealerPile: (state, action: PayloadAction<CardType[]>) => {
            state.players.dealer.pile = action.payload
        },
        setDealerHandValue: (state, action: PayloadAction<number>) => {
            state.players.dealer.handValue = action.payload
        },
        setGameState: (state, action: PayloadAction<GameState>) => {
            state.gameState = action.payload
        },
        setPile: (state, action: PayloadAction<{ pile: CardType[], player: string }>) => {
            const { pile, player } = action.payload
            state.players[player].pile = pile
        },
        setHandValue: (state, action: PayloadAction<{ handValue: number, player: string }>) => {
            const { handValue, player } = action.payload
            state.players[player].handValue = handValue
        }
    },
    extraReducers: (builder) => {
        builder.addCase(calculateHandValueAsync.fulfilled, (state, action: PayloadAction<{ handValue: number, player: string }>) => {
            const { handValue, player } = action.payload
            state.players[player].handValue = handValue
        });
    }
})

export const { setDeckId, setPlayerPile, setPlayerHandValue, setGameState, setDealerPile, setDealerHandValue } = blackjackSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default blackjackSlice.reducer