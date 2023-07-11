import { useEffect } from 'react'
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setDeckId, setGameState, calculateHandValueAsync, setPile, setCurrentStreak, setBestStreak, initializeGame } from '../redux/slices/blackjackSlice'
import Button from '../components/Button'
import PlayerPile from '../components/PlayerPile'
import { determineWinner, stringifyPile, hasSoftHand } from '../helpers'
import ApiHelper from '../helpers/api'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import Logs from '../components/Logs'

const api = new ApiHelper()

export default function Game() {
    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const player = useSelector((state: RootState) => state.blackjack.players.player)
    const dealer = useSelector((state: RootState) => state.blackjack.players.dealer)
    const gameState = useSelector((state: RootState) => state.blackjack.gameState)
    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    const dispatch = useDispatch()

    useEffect(() => {
        const manageGameState = async () => {

            switch (gameState) {
                case 'INIT_GAME': {
                    if (!deckId) {
                        const newDeckId = await api.getNewDeck()
                        dispatch(setDeckId(newDeckId))
                        localStorage.setItem('deckId', newDeckId)
                    } else {
                        await api.shuffleDeck(deckId)
                    }
                    dispatch(setGameState('PLAYER_TURN'))
                    break;
                }
                case 'PLAYER_TURN':
                    break;
                case 'DEALER_TURN': {
                    await handleDrawClick(2, "dealer");
                    break;
                }
                case 'CHECK_WINNERS': {
                    const winState = await determineWinner(player.handValue, dealer.handValue)

                    if (winState === 'TIE') {
                        dispatch(setGameState('END_GAME'))
                    } else if (winState === 'DEALER_WIN') {
                        if (bestStreak < currentStreak) {
                            await dispatch(setBestStreak(currentStreak))
                            localStorage.setItem('bestStreak', currentStreak.toString())
                            await dispatch(setCurrentStreak(0))
                        } else {
                            await dispatch(setCurrentStreak(0))
                        }
                    } else if (winState === 'PLAYER_WIN') {
                        const streak = currentStreak + 1
                        await dispatch(setCurrentStreak(streak))

                        if (bestStreak < streak) {
                            await dispatch(setBestStreak(streak))
                            localStorage.setItem('bestStreak', streak.toString())
                        }
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
            if (dealer.handValue < 17 || hasSoftHand(dealer.pile, dealer.handValue)) {
                handleDrawClick(1, "dealer")
            } else {
                dispatch(setGameState('CHECK_WINNERS'))
            }
        }
    }, [dealer.handValue])

    const handleDrawClick = async (drawCount: number, player: string) => {
        try {
            const drawResponse = await api.draw(deckId, player, drawCount)
            const stringifiedCards = await stringifyPile(drawResponse.cards)
            await api.addToPile(deckId, player, stringifiedCards)
            const listPileResponse = await api.listPile(deckId, player)
            await dispatch(setPile({ pile: listPileResponse.piles[player].cards, player: player }))
            await (dispatch as ThunkDispatch<RootState, void, AnyAction>)(calculateHandValueAsync(player))
            return listPileResponse.success
            //todo: fix dealer sometimes not hitting
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-8 h-full pb-36">

                <div className="h-20"><img src="https://deckofcardsapi.com/static/img/back.png" className="max-h-28" /></div>
                <div className="w-full p-4">
                    <PlayerPile cards={dealer.pile} handValue={dealer.handValue}></PlayerPile>
                </div>
                <div className="w-full p-4">
                    <PlayerPile cards={player.pile} handValue={player.handValue}></PlayerPile>
                </div>
                <div className="flex flex-row justify-center gap-8 items-center h-32">
                    {
                        player.pile.length < 2 && gameState === 'PLAYER_TURN' &&

                        <Button onClick={() => {
                            handleDrawClick(2, "player")
                            dispatch(setGameState('PLAYER_TURN'))
                        }} className="">
                            DEAL HAND
                        </Button>
                    }
                    {
                        player.pile.length >= 2 && gameState === 'PLAYER_TURN' &&
                        <Button onClick={() => handleDrawClick(1, "player")}>
                            HIT
                        </Button>

                    }
                    {
                        player.pile.length >= 2 && gameState === 'PLAYER_TURN' &&
                        <Button onClick={() => dispatch(setGameState('DEALER_TURN'))}>
                            STAND
                        </Button>
                    }
                    {
                        gameState === 'END_GAME' &&
                        <Button onClick={() => dispatch(initializeGame())}>
                            CONTINUE
                        </Button>
                    }

                </div>
                <Logs></Logs>
            </div>
        </>
    )
}