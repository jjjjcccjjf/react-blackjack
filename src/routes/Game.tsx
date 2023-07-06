import { useEffect } from 'react'
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setDeckId, setGameState, calculateHandValueAsync, setPile } from '../redux/slices/blackjackSlice'
import Button from '../components/Button'
import PlayerPile from '../components/PlayerPile'
import { stringifyPile } from '../helpers'
import ApiHelper from '../helpers/api'
import DealerHelper from '../helpers/dealer'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'

const api = new ApiHelper()
const dealerLogic = new DealerHelper()

type AddToPileResponseType = {
    success: boolean,
    deck_id: string,
    remaining: number,
    piles: {
        [key: string]: {
            "remaining": number
        }
    }
}

export default function Game() {
    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const player = useSelector((state: RootState) => state.blackjack.players.player)
    const dealer = useSelector((state: RootState) => state.blackjack.players.dealer)
    const gameState = useSelector((state: RootState) => state.blackjack.gameState)
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
                case 'CHECK_WINNERS':
                    break;
                case 'END_GAME':
                    break;
                // dealer.play()
            }

        }

        manageGameState()
    }, [gameState, dispatch]) // check if dispatch here is needed

    useEffect(() => {
        // dealer's logic
        if (gameState === 'DEALER_TURN' && dealer.handValue < 17) {
            handleDrawClick(1, "dealer")
        } else {
            dispatch(setGameState('CHECK_WINNERS'))
        }
    }, [dealer.handValue])

    const handleDrawClick = async (drawCount: number, player: string) => {
        try {
            const drawResponse = await api.draw(deckId, player, drawCount)
            const stringifiedCards = await stringifyPile(drawResponse.cards)
            const addToPileResponse = await api.addToPile(deckId, player, stringifiedCards)
            const listPileResponse = await api.listPile(deckId, player)
            await dispatch(setPile({ pile: listPileResponse.piles[player].cards, player: player }))
            await (dispatch as ThunkDispatch<RootState, void, AnyAction>)(calculateHandValueAsync(player))
            return listPileResponse.success
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    // const dealerPlay = async (drawCount: number) => {
    //     try {
    //         const drawResponse = await api.draw(deckId, "dealer", drawCount)
    //         const stringifiedCards = await stringifyPile(drawResponse.cards)
    //         const addToPileResponse = await api.addToPile(deckId, "dealer", stringifiedCards)
    //         const listPileResponse = await api.listPile(deckId, "dealer")
    //         dispatch(setDealerPile(listPileResponse.piles.dealer.cards))
    //         return listPileResponse.success
    //     } catch (e) {
    //         console.error(e)
    //         throw e;
    //     }
    // }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-8 h-full">

                <div className="h-20"> cards</div>
                <div className="bg-red-200">
                    <PlayerPile cards={dealer.pile} handValue={dealer.handValue}></PlayerPile>
                </div>
                <div className="bg-red-200">
                    <PlayerPile cards={player.pile} handValue={player.handValue}></PlayerPile>
                </div>
                <div className="flex flex-row justify-center gap-8 bg-slate-500 p-8">

                    {player.pile.length < 2 ?
                        <Button onClick={() => {
                            handleDrawClick(2, "player")
                            dispatch(setGameState('PLAYER_TURN'))
                        }}>
                            DEAL HAND
                        </Button>
                        :
                        <Button onClick={() => handleDrawClick(1, "player")}>
                            HIT
                        </Button>
                    }

                    {player.pile.length >= 2 && <Button onClick={() => dispatch(setGameState('DEALER_TURN'))}>STAND</Button>}

                </div>
            </div>
        </>
    )
}