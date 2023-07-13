import { useState, useEffect } from 'react'
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setDeckId, setGameState, calculateHandValueAsync, addToPileAsync, drawAsync, setPile, setCurrentStreak, setBestStreak, initializeGame, addToGameLogs, setDrawLoading, setMusic, setLastEventSfx } from '../redux/slices/blackjackSlice'
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

    useEffect(() => {
        clickAudio.volume = 0.25
    }, [])

    useEffect(() => {
        const manageGameState = async () => {

            switch (gameState) {
                case 'INIT_GAME': {
                    if (!deckId) {
                        const newDeckId = await api.getNewDeck()
                        await dispatch(addToGameLogs('Shuffling deck...'))
                        dispatch(setDeckId(newDeckId))
                        localStorage.setItem('deckId', newDeckId)
                    } else {
                        await dispatch(addToGameLogs('Shuffling deck...'))
                        await api.shuffleDeck(deckId)
                    }
                    dispatch(setGameState('PLAYER_TURN'))
                    dispatch(addToGameLogs('Deck reshuffled.'))
                    break;
                }
                case 'PLAYER_TURN':
                    break;
                case 'DEALER_TURN': {
                    await handleDrawClick2(2, "dealer");
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
        if (gameState === 'DEALER_TURN') {
            if (dealer.handValue < 17) { // || hasSoftHand(dealer.pile, dealer.handValue)
                setTimeout(() => handleDrawClick2(1, "dealer"), 200) // check bug sa ALAS
            } else {
                dispatch(addToGameLogs('DEALER stands.'))
                dispatch(setGameState('CHECK_WINNERS'))

            }
        }
    }, [dealer.handValue])

    const handleDrawClick2 = async (drawCount: number, playerName: 'player' | 'dealer') => {

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

                <div className="h-20">
                    <img src="https://deckofcardsapi.com/static/img/back.png" className="max-h-28" />
                    {/* <Loader></Loader> */}
                </div>
                <div className="w-full p-4">
                    <PlayerPile cards={dealer.pile} handValue={dealer.handValue} player='dealer'></PlayerPile>
                </div>
                <div className="w-full p-4">
                    <PlayerPile cards={player.pile} handValue={player.handValue} player='player'></PlayerPile>
                </div>
                <div className="flex flex-row justify-center gap-8 items-center h-16">
                    {
                        player.pile.length < 2 && gameState === 'PLAYER_TURN' &&

                        <Button onClick={async () => {
                            clickAudio.play()
                            // await (dispatch as ThunkDispatch<RootState, void, AnyAction>)(handleDrawClickAsync({ drawCount: 2, player: "player" }))
                            handleDrawClick2(2, "player")
                            dispatch(setGameState('PLAYER_TURN'))
                            dispatch(setLastEventSfx('HIT'))
                            if (!isMusicPlaying) {
                                dispatch(setMusic({ isPlaying: true, volume: 1 }))
                            }
                        }} className="">
                            DEAL HAND
                        </Button>
                    }
                    {
                        player.pile.length >= 2 && gameState === 'PLAYER_TURN' &&
                        <Button onClick={async () => {
                            clickAudio.play()
                            // await (dispatch as ThunkDispatch<RootState, void, AnyAction>)(handleDrawClickAsync({ drawCount: 1, player: "player" }))

                            handleDrawClick2(1, "player")
                        }}>
                            HIT
                        </Button>

                    }
                    {
                        player.pile.length >= 2 && gameState === 'PLAYER_TURN' &&
                        <Button onClick={() => {
                            clickAudio.play()
                            dispatch(setGameState('DEALER_TURN'))
                            dispatch(addToGameLogs('PLAYER stands.'))
                            dispatch(setLastEventSfx('STAND'))
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