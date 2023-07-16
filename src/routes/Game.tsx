import { useState, useEffect } from 'react'
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setGameState, calculateHandValueAsync, addToPileAsync, drawAsync, setPile, initializeGame, addToGameLogs, setMusic, setLastEventSfx } from '../redux/slices/blackjackSlice'
import Button from '../components/Button'
import PlayerPile from '../components/PlayerPile'
import { stringifyPile } from '../helpers'
import ApiHelper from '../helpers/api'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import Logs from '../components/Logs'
import clickSfx from '../assets/click.mp3'
import SfxManager from '../components/Managers/SfxManager'
import { FaPaperPlane } from 'react-icons/fa'
import { DrawResponseType } from '../types'
import Deck from '../components/Deck'
import GameManager from '../components/Managers/GameManager'
import { Link, Outlet } from "react-router-dom";
import { AiFillHome, AiFillQuestionCircle } from 'react-icons/ai'
import Music from '../components/Music'

const api = new ApiHelper()

export default function Game() {

    const [clickAudio] = useState(new Audio(clickSfx))


    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const player = useSelector((state: RootState) => state.blackjack.players.player)
    const dealer = useSelector((state: RootState) => state.blackjack.players.dealer)
    const gameState = useSelector((state: RootState) => state.blackjack.gameState)
    const isMusicPlaying = useSelector((state: RootState) => state.blackjack.music.isPlaying)
    const disabledButtons = useSelector((state: RootState) => state.blackjack.disabledButtons)
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)

    const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch()

    useEffect(() => {
        clickAudio.volume = 0.33
    }, [])

    const handleDrawClick = async (deckId: string, drawCount: number, playerName: 'player' | 'dealer') => {

        try {
            const drawAction = await dispatch(drawAsync({ deckId, drawCount, playerName })) // gamelogs in fulfilled // pending - add cardloading
            const drawPayload = drawAction.payload as DrawResponseType
            const stringifiedCards = await stringifyPile(drawPayload.cards)
            const addToPileAction = await dispatch(addToPileAsync({ deckId, playerName, stringifiedCards })) // add logs here added to hand // remove cardloading
            const listPileResponse = await api.listPile(deckId, playerName)
            await dispatch(setPile({ pile: listPileResponse.piles[playerName].cards, player: playerName }))
            await dispatch(calculateHandValueAsync(playerName))
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    return (
        <>
            <div className="glass h-full w-full">

                <div className="p-4 flex flex-row justify-between w-full glass backdrop-blur-lg text-xl absolute top-0">
                    <Link className="flex justify-center items-center text-white/70 text-2xl hover:text-white/50" to="/"> <AiFillHome /></Link>
                    <p className="h-10 flex justify-center items-center">🏆 Best: {bestStreak}</p>
                    <p className="h-10 flex justify-center items-center">🔥 Streak: {currentStreak}</p>

                    <Music />
                    <button className="flex justify-center items-center text-white/70 text-3xl hover:text-white/50"><AiFillQuestionCircle /></button>
                </div>
                <div className="flex flex-col items-center justify-center gap-8 h-full pb-[156px] pt-[56px]">

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
                                if (!isMusicPlaying) {
                                    dispatch(setMusic({ isPlaying: true, volume: 1 }))
                                }
                                handleDrawClick(deckId, 2, "player")
                                dispatch(setGameState('PLAYER_TURN'))
                                dispatch(setLastEventSfx('HIT'))
                            }} disabled={disabledButtons.dealHand}>
                                DEAL HAND
                            </Button>
                        }
                        {
                            player.pile.length >= 2 && gameState === 'PLAYER_TURN' &&
                            <Button onClick={async () => {
                                clickAudio.play()
                                // await (dispatch as ThunkDispatch<RootState, void, AnyAction>)(handleDrawClickAsync({ drawCount: 1, player: "player" }))
                                dispatch(setLastEventSfx('HIT'))

                                handleDrawClick(deckId, 1, "player")
                            }} disabled={disabledButtons.hit}>
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
                    <GameManager handleDrawClick={handleDrawClick} />
                </div>
            </div>
        </>
    )
}