import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CardType, GameState, drawLoading } from '../../types';
import { RootState } from '../store';
import { getCalculatedHandValue, getRawHandValue } from '../../helpers';

interface PlayerState {
    pile: CardType[],
    handValue: number,
}

type MusicType = {
    isPlaying: boolean,
    volume: number
}

type LastEventSfxType = "HIT" | "STAND" | "BLACKJACK" | "PLAYER_BLACKJACK" | "DEALER_BLACKJACK" | "BUST" | "TIE" | "PLAYER_WIN" | "DEALER_WIN" | "GAME_START" | "WELCOME" | null

interface BlackjackState {
    deckId: string;
    players: {
        [key: string]: PlayerState
    }
    gameState: GameState,
    bestStreak: number,
    currentStreak: number,
    gameLogs: string[],
    drawLoading: drawLoading,
    music: MusicType,
    lastEventSfx: LastEventSfxType
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
        currentStreak: 0,
        gameLogs: [],
        drawLoading: { player: null, cardCount: 0 },
        music: {
            isPlaying: false,
            volume: 1
        },
        lastEventSfx: null
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
        addToGameLogs: (state, action: PayloadAction<string>) => {
            state.gameLogs.push(action.payload)
        },
        initializeGame(state) {
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
        },
        setDrawLoading: (state, action: PayloadAction<drawLoading>) => {
            state.drawLoading = action.payload
        },
        setMusic: (state, action: PayloadAction<MusicType>) => {
            state.music = action.payload
        },
        setLastEventSfx: (state, action: PayloadAction<LastEventSfxType>) => {
            state.lastEventSfx = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(calculateHandValueAsync.fulfilled, (state, action: PayloadAction<{ handValue: number, player: string }>) => {
            const { handValue, player } = action.payload
            state.players[player].handValue = handValue
            if (handValue === 21) {
                state.gameLogs.push(`${player.toUpperCase()} blackjack!`)
                state.lastEventSfx = (player === 'player') ? 'PLAYER_BLACKJACK' : 'DEALER_BLACKJACK'
            }
            if (handValue > 21 && player === 'player') {
                state.gameLogs.push(`${player.toUpperCase()} busts at ${handValue}`)
                // state.lastEventSfx = (player === 'player') ? 'PLAYER_BUST' : 'DEALER_BUST'
                state.lastEventSfx = 'BUST'
            }
        });
    }
})

export const { setDeckId, setGameState, setPile, setCurrentStreak, setBestStreak, initializeGame, addToGameLogs, setDrawLoading, setMusic, setLastEventSfx } = blackjackSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default blackjackSlice.reducer