import { useSelector, useDispatch } from "react-redux"
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { RootState } from "../../redux/store"
import { useEffect } from "react"
import { setGameState, shuffleDeckAsync, setCurrentStreak, setBanner, setBestStreak, addToGameLogs, setLastEventSfx } from '../../redux/slices/blackjackSlice'
import { determineWinner, hasSoftHand } from "../../helpers"

type HandleDrawClickType = (deckId: string, drawCount: number, playerName: 'player' | 'dealer') => void // fix this later. add deckid

type GameManagerProps = {
    handleDrawClick: HandleDrawClickType
}

export default function GameManager({ handleDrawClick }: GameManagerProps) {

    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const gameState = useSelector((state: RootState) => state.blackjack.gameState)
    const dealer = useSelector((state: RootState) => state.blackjack.players.dealer)
    const player = useSelector((state: RootState) => state.blackjack.players.player)
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)

    const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch()

    useEffect(() => {
        localStorage.setItem('deckId', deckId);
    }, [deckId]);


    useEffect(() => {
        const manageGameState = async () => {

            switch (gameState) {
                case 'INIT_GAME': {
                    const shuffleDeckAction = await dispatch(shuffleDeckAsync())
                    const newDeckId = shuffleDeckAction.payload as string
                    localStorage.setItem('deckId', newDeckId)
                    break;
                }
                case 'PLAYER_TURN':
                    break;
                case 'DEALER_TURN': {
                    await handleDrawClick(deckId, 2, "dealer");
                    break;
                }
                case 'CHECK_WINNERS': {
                    const winState = await determineWinner(player.handValue, dealer.handValue)

                    if (winState === 'TIE') {
                        dispatch(setBanner({ isVisible: true, text: 'Tie!' }))
                        dispatch(setGameState('END_GAME'))
                        await dispatch(addToGameLogs('TIE.'))
                        dispatch(setLastEventSfx('TIE'))
                    } else if (winState === 'DEALER_WIN') {
                        dispatch(setBanner({ isVisible: true, text: 'Dealer Win!' }))
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
                        dispatch(setBanner({ isVisible: true, text: 'Player Win!' }))
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
    }, [gameState, dispatch])

    useEffect(() => {

        if (gameState === 'DEALER_TURN') {
            if (dealer.handValue < 17 || hasSoftHand(dealer.pile, dealer.handValue)) { 
                setTimeout(() => handleDrawClick(deckId, 1, "dealer"), 100) 
            } else {
                dispatch(addToGameLogs('DEALER stands.'))
                dispatch(setGameState('CHECK_WINNERS'))
            }
        }

    }, [dealer.pileCount, dispatch])

    return (<></>)
}