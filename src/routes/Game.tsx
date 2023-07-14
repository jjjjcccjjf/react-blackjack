import { useState, useEffect, useRef } from 'react'
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setDeckId, shuffleDeckAsync, setGameState, calculateHandValueAsync, addToPileAsync, drawAsync, setPile, setCurrentStreak, setBestStreak, initializeGame, addToGameLogs, setDrawLoading, setMusic, setLastEventSfx } from '../redux/slices/blackjackSlice'
import Button from '../components/Button'
import PlayerPile from '../components/PlayerPile'
import { determineWinner, stringifyPile, hasSoftHand } from '../helpers'
import ApiHelper from '../helpers/api'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import Logs from '../components/Logs'
import clickSfx from '../assets/click.mp3'
import SfxManager from '../components/Managers/SfxManager'
import { FaPaperPlane } from 'react-icons/fa'
import { DrawResponseType } from '../types'
import Loader from '../components/Loader'
import Shuffler from '../components/Shuffler'
import Deck from '../components/Deck'

const api = new ApiHelper()

export default function Game() {

    const [clickAudio] = useState(new Audio(clickSfx))


    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const player = useSelector((state: RootState) => state.blackjack.players.player)
    const dealer = useSelector((state: RootState) => state.blackjack.players.dealer)
    const gameState = useSelector((state: RootState) => state.blackjack.gameState)
    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    const isMusicPlaying = useSelector((state: RootState) => state.blackjack.music.isPlaying)

    const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch()

    const [dealerLastHandCount, setDealerLastHandCount] = useState(dealer.pile.length)

    useEffect(() => {
        clickAudio.volume = 0.33
    }, [])

    useEffect(() => {
        localStorage.setItem('deckId', deckId);
    }, [deckId]);

    useEffect(() => {
        const manageGameState = async () => {

            switch (gameState) {
                case 'INIT_GAME': {
                    // if (!deckId) {
                    //     const newDeckId = await api.getNewDeck()
                    //     await dispatch(addToGameLogs('Shuffling deck...'))
                    //     dispatch(setDeckId(newDeckId))
                    //     localStorage.setItem('deckId', newDeckId)
                    // } else {
                    //     await dispatch(addToGameLogs('Shuffling deck...'))
                    //     await api.shuffleDeck(deckId)
                    // }
                    // dispatch(setGameState('PLAYER_TURN'))
                    // dispatch(addToGameLogs('Deck reshuffled.'))
                    const shuffleDeckAction = await dispatch(shuffleDeckAsync())
                    const newDeckId = shuffleDeckAction.payload as string
                    localStorage.setItem('deckId', newDeckId)

                    break;
                }
                case 'PLAYER_TURN':
                    break;
                case 'DEALER_TURN': {
                    await handleDrawClick(2, "dealer");
                    // dispatch(setLastEventSfx('DEALER_TURN'))
                    break;
                }
                case 'CHECK_WINNERS': {
                    const winState = await determineWinner(player.handValue, dealer.handValue)

                    if (winState === 'TIE') {
                        dispatch(setGameState('END_GAME'))
                        await dispatch(addToGameLogs('TIE.'))
                        dispatch(setLastEventSfx('TIE'))
                    } else if (winState === 'DEALER_WIN') {
                        if (bestStreak < currentStreak) {
                            await dispatch(setBestStreak(currentStreak))
                            localStorage.setItem('bestStreak', currentStreak.toString())
                            await dispatch(setCurrentStreak(0))
                        } else {
                            await dispatch(setCurrentStreak(0))
                        }
                        await dispatch(addToGameLogs('DEALER wins.'))
                        dispatch(setLastEventSfx('DEALER_WIN'))
                    } else if (winState === 'PLAYER_WIN') {
                        const streak = currentStreak + 1
                        await dispatch(setCurrentStreak(streak))

                        if (bestStreak < streak) {
                            await dispatch(setBestStreak(streak))
                            localStorage.setItem('bestStreak', streak.toString())
                        }
                        await dispatch(addToGameLogs('PLAYER wins.'))
                        dispatch(setLastEventSfx('PLAYER_WIN'))
                    }
                    await dispatch(setGameState('END_GAME'))

                    break;
                }
                case 'END_GAME': {
                    break;
                }
            }

        }

        manageGameState()
    }, [gameState, dispatch]) // check if dispatch here is needed

    useEffect(() => {

        if (gameState === 'DEALER_TURN') { //&& dealerLastHandCount.current !== dealer.pile.length
            if (dealer.handValue < 17 || hasSoftHand(dealer.pile, dealer.handValue)) { // 
                setTimeout(() => handleDrawClick(1, "dealer"), 200) // check bug sa ALAS
            } else {
                dispatch(addToGameLogs('DEALER stands.'))
                dispatch(setGameState('CHECK_WINNERS'))
            }
        }

        // setDealerLastHandCount(dealer.pile.length)

    }, [dealer.pileCount, dispatch])

    const handleDrawClick = async (drawCount: number, playerName: 'player' | 'dealer') => {

        try {
            const drawAction = await dispatch(drawAsync({ deckId, drawCount, playerName })) // gamelogs in fulfilled // pending - add cardloading
            const drawPayload = drawAction.payload as DrawResponseType
            const stringifiedCards = await stringifyPile(drawPayload.cards)
            const addToPileAction = await dispatch(addToPileAsync({ deckId, playerName, stringifiedCards })) // add logs here added to hand // remove cardloading
            const listPileResponse = await api.listPile(deckId, playerName)
            await dispatch(setPile({ pile: listPileResponse.piles[playerName].cards, player: playerName }))
            await dispatch(calculateHandValueAsync(playerName))
            await dispatch(setDrawLoading({ player: null, cardCount: 0 }))
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-8 h-full pb-36">

                <div className="h-28 w-full px-4">
                    <Deck />
                </div>
                <div className="w-full px-4">
                    <PlayerPile cards={dealer.pile} handValue={dealer.handValue} player='dealer'></PlayerPile>
                </div>
                <div className="w-full px-4">
                    <PlayerPile cards={player.pile} handValue={player.handValue} player='player'></PlayerPile>
                </div>
                <div className="flex flex-row justify-center gap-8 items-center h-16">
                    {
                        player.pile.length < 2 && gameState === 'PLAYER_TURN' &&

                        <Button onClick={async () => {
                            clickAudio.play()
                            // await (dispatch as ThunkDispatch<RootState, void, AnyAction>)(handleDrawClickAsync({ drawCount: 2, player: "player" }))
                            if (!isMusicPlaying) {
                                dispatch(setMusic({ isPlaying: true, volume: 1 }))
                            }
                            handleDrawClick(2, "player")
                            dispatch(setGameState('PLAYER_TURN'))
                            dispatch(setLastEventSfx('HIT'))
                        }} className="">
                            DEAL HAND
                        </Button>
                    }
                    {
                        player.pile.length >= 2 && gameState === 'PLAYER_TURN' &&
                        <Button onClick={async () => {
                            clickAudio.play()
                            // await (dispatch as ThunkDispatch<RootState, void, AnyAction>)(handleDrawClickAsync({ drawCount: 1, player: "player" }))
                            dispatch(setLastEventSfx('HIT'))

                            handleDrawClick(1, "player")
                        }}>
                            HIT
                        </Button>

                    }
                    {
                        player.pile.length >= 2 && gameState === 'PLAYER_TURN' &&
                        <Button onClick={() => {
                            clickAudio.play()
                            dispatch(setLastEventSfx('STAND'))
                            dispatch(setGameState('DEALER_TURN'))
                            dispatch(addToGameLogs('PLAYER stands.'))
                        }}>
                            STAND
                        </Button>
                    }
                    {
                        gameState === 'END_GAME' &&
                        <Button onClick={() => {
                            dispatch(initializeGame())
                        }}>
                            CONTINUE
                        </Button>
                    }
                    {
                        gameState === 'END_GAME' &&
                        <Button>
                            SHARE <FaPaperPlane />
                        </Button>
                    }

                </div>
                <Logs></Logs>
                <SfxManager />
            </div>
        </>
    )
}