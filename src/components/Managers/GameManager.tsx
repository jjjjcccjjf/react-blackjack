import { useSelector, useDispatch } from "react-redux"
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { RootState } from "../../redux/store"
import { useEffect } from "react"
import { getRawHandValue, getCalculatedHandValue } from "../../helpers"
import { setDeckId, setGameState, calculateHandValueAsync, shuffleDeckAsync, addToPileAsync, drawAsync, setPile, setCurrentStreak, setBestStreak, initializeGame, addToGameLogs, setDrawLoading, setMusic, setLastEventSfx } from '../redux/slices/blackjackSlice'
import { determineWinner } from "../../helpers"

type HandleDrawClickType = (drawCount: number, playerName: 'player' | 'dealer') => void // fix this later. add deckid

type GameManagerProps = {
    handleDrawClick: HandleDrawClickType
}

export default function GameManager({ handleDrawClick }: GameManagerProps) {
    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const gameState = useSelector((state: RootState) => state.blackjack.gameState)
    const dealer = useSelector((state: RootState) => state.blackjack.players.dealer)
    const player = useSelector((state: RootState) => state.blackjack.players.player)

    const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch()

    useEffect(() => {
        localStorage.setItem('deckId', deckId);
    }, [deckId]);

    useEffect(() => {
        const manageGameState = async () => {

            switch (gameState) {
                case 'INIT_GAME': {
                    await dispatch(shuffleDeckAsync())
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

    // useEffect(() => {
    //     if (gameState === 'DEALER_TURN') {
    //         if (dealer.handValue < 17) { // || hasSoftHand(dealer.pile, dealer.handValue)
    //             setTimeout(() => handleDrawClick(1, "dealer"), 200) // check bug sa ALAS
    //         } else {
    //             dispatch(addToGameLogs('DEALER stands.'))
    //             dispatch(setGameState('CHECK_WINNERS'))

    //         }
    //     }
    // }, [dealer.handValue])

    return (<></>)
}