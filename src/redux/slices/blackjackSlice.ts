import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CardType, DrawResponseType, GameState, drawLoading } from '../../types';
import { RootState } from '../store';
import { getCalculatedHandValue, getRawHandValue } from '../../helpers';
import ApiHelper from '../../helpers/api'

const api = new ApiHelper()

interface PlayerState {
    pile: CardType[],
    pileCount: number,
    handValue: number,
}

type MusicType = {
    isPlaying: boolean,
    volume: number
}

interface DrawPayload {
    deckId: string
    drawCount: number;
    playerName: 'player' | 'dealer'; //TODO: FIX THIS LATER
}

interface DisabledButtonsStateTypes {
    hit: boolean
    stand: boolean
    dealHand: boolean
}

const DEFAULT_DISABLED_BUTTONS_STATE = {
    hit: false,
    stand: false,
    dealHand: false
}

type LastEventSfxType = "HIT" | "STAND" | "BLACKJACK" | "PLAYER_BLACKJACK" | "DEALER_BLACKJACK" | "BUST" | "TIE" | "PLAYER_WIN" | "DEALER_TURN" | "PLAYER_TURN" | "DEALER_WIN" | "GAME_START" | "WELCOME" | null

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
    lastEventSfx: LastEventSfxType,
    isDeckShuffling: boolean,
    disabledButtons: DisabledButtonsStateTypes
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

export const shuffleDeckAsync = createAsyncThunk(
    'blackjack/shuffleDeckAsync',
    async (_, thunkAPI): Promise<string> => {
        const state = thunkAPI.getState() as RootState

        if (!state.blackjack.deckId) {
            return await api.getNewDeck()
        } else {
            return await api.shuffleDeck(state.blackjack.deckId)
        }
    }
)

export const drawAsync = createAsyncThunk(
    'blackjack/drawAsync',
    async ({ deckId, drawCount, playerName }: DrawPayload): Promise<DrawResponseType> => {
        return await api.draw(deckId, playerName, drawCount)
    }
)

export const addToPileAsync = createAsyncThunk(
    'blackjack/addToPileAsync',
    async ({ deckId, playerName, stringifiedCards }: { deckId: string, playerName: string, stringifiedCards: string }): Promise<string> => { // TODO: fix this later
        return await api.addToPile(deckId, playerName, stringifiedCards)
    }
)

const initializeState = (): BlackjackState => {
    let deckId = localStorage.getItem('deckId') 
    deckId = deckId === 'undefined' ? '' : deckId
    const bestStreak = localStorage.getItem('bestStreak')
    return {
        deckId: deckId ?? '',
        players: {
            "player": {
                pile: [],
                pileCount: 0,
                handValue: 0
            },
            "dealer": {
                pile: [],
                pileCount: 0,
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
        lastEventSfx: null,
        isDeckShuffling: false,
        disabledButtons: DEFAULT_DISABLED_BUTTONS_STATE
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
                    pileCount: 0,
                    handValue: 0
                },
                "dealer": {
                    pile: [],
                    pileCount: 0,
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
        },
        setIsDeckShuffling: (state, action: PayloadAction<boolean>) => {
            state.isDeckShuffling = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(calculateHandValueAsync.fulfilled, (state, action: PayloadAction<{ handValue: number, player: string }>) => {
                const { handValue, player } = action.payload
                state.players[player].handValue = handValue
                state.players[player].pileCount = state.players[player].pile.length

                if (handValue === 21) {
                    state.gameLogs.push(`${player.toUpperCase()} blackjack!`)
                    state.lastEventSfx = (player === 'player') ? 'PLAYER_BLACKJACK' : 'DEALER_BLACKJACK'
                }
                if (handValue > 21) {
                    if (player === 'player') {
                        state.lastEventSfx = 'BUST'
                        // state.lastEventSfx = (player === 'player') ? 'PLAYER_BUST' : 'DEALER_BUST'
                    }
                    state.gameLogs.push(`${player.toUpperCase()} busts at ${handValue}.`)
                }
            })
            .addCase(drawAsync.pending, (state, action) => {
                const { drawCount, playerName } = action.meta.arg
                state.drawLoading = { cardCount: drawCount, player: playerName }

                if (drawCount === 2) {
                    state.disabledButtons.dealHand = true
                } else if (drawCount === 1) {
                    state.disabledButtons.hit = true
                }
            })
            .addCase(drawAsync.fulfilled, (state, action) => {
                const { drawCount, playerName } = action.meta.arg
                state.gameLogs.push(`${playerName.toUpperCase()} drew ${drawCount} card(s).`) // PLAYER drew 2 card(s).
            })
            .addCase(addToPileAsync.fulfilled, (state, action) => {
                state.gameLogs.push(action.payload) // 6S, 2S added to PLAYER's hand.
                state.disabledButtons = DEFAULT_DISABLED_BUTTONS_STATE
                state.drawLoading = { player: null, cardCount: 0 }
            })
            .addCase(shuffleDeckAsync.pending, (state) => {
                state.gameLogs.push('Shuffling deck...')
                state.isDeckShuffling = true;
            })
            .addCase(shuffleDeckAsync.fulfilled, (state, action) => {
                state.isDeckShuffling = false;
                state.deckId = action.payload
                state.gameLogs.push('Deck reshuffled.')
                state.gameState = 'PLAYER_TURN'
            })


    }
})

export const { setDeckId, setGameState, setPile, setCurrentStreak, setBestStreak, initializeGame, addToGameLogs, setDrawLoading, setMusic, setLastEventSfx } = blackjackSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default blackjackSlice.reducer