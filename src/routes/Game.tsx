import { useEffect } from 'react'
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setDeckId, setPlayerPile, setGameState, setPlayerHandValue } from '../redux/slices/blackjackSlice'
import Button from '../components/Button'
import type { CardType } from '../types'
import PlayerPile from '../components/PlayerPile'
import { getCalculatedHandValue, getRawHandValue } from '../helpers'
import ApiHelper from '../helpers/api'

const api = new ApiHelper()

type DrawResponseType = {
    success: boolean,
    deck_id: string,
    cards: CardType[],
    remaining: number
}

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

type ListPileResponseType = {
    success: boolean,
    deck_id: string,
    remaining: number,
    piles: {
        [key: string]: {
            remaining: number,
            cards: CardType[]
        }
    }
}



export default function Game() {
    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const playerPile = useSelector((state: RootState) => state.blackjack.player.pile)
    const playerHandValue = useSelector((state: RootState) => state.blackjack.player.handValue)
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
                    dispatch(setGameState('NEW_GAME'))
                    break;
                }
                case 'NEW_GAME':
                case 'PLAYER_TURN':
                case 'DEALER_TURN':
                case 'CHECK_WINNERS':
                case 'END_GAME':
            }

        }

        manageGameState()
    }, [gameState, dispatch]) // check if dispatch here is needed

    useEffect(() => {
        const calculatePlayerHandValueAsync = async () => {
            const playerHandValue = await getRawHandValue(playerPile)
                .then(res => getCalculatedHandValue(res))
                .catch(e => {
                    console.error(e)
                    return 0
                })
            await dispatch(setPlayerHandValue(playerHandValue));
        }

        calculatePlayerHandValueAsync()
    }, [playerPile, dispatch]);

    const handleDrawClick = async (drawCount: number) => {
        console.log('triggered')
        try {
            const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${drawCount}`)
            const drawResJson: DrawResponseType = await drawRes.json()

            const cardsString: string = drawResJson.cards.reduce((acc, curr: CardType) => {
                acc += curr.code + ","
                return acc
            }, "")

            const trimmedString = cardsString.replace(/,+$/, '');

            const pileRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player/add/?cards=${trimmedString}`)
            const pileResJson: AddToPileResponseType = await pileRes.json()

            const listPileRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player/list/`)
            const listPileResJson: ListPileResponseType = await listPileRes.json() // TODO: add type

            dispatch(setPlayerPile(listPileResJson.piles.player.cards))

            return listPileResJson.success
        } catch (e) {
            console.error(e)
            throw e;
        }
    }


    return (
        <>
            <div className="flex flex-col items-center justify-center gap-8 h-full">

                <div className="h-20"> cards</div>
                <div className="bg-red-200">
                    <PlayerPile cards={playerPile} handValue={playerHandValue}></PlayerPile>
                </div>
                <div className="bg-red-200">
                    <PlayerPile cards={playerPile} handValue={playerHandValue}></PlayerPile>
                </div>
                <div className="flex flex-row justify-center gap-8 bg-slate-500 p-8">
                    <div>
                        {['INIT_GAME', 'NEW_GAME'].includes(gameState) ?
                            <Button onClick={() => {
                                handleDrawClick(2)
                                dispatch(setGameState('PLAYER_TURN'))
                            }}>Deal Hand
                            </Button> :
                            <Button onClick={() => handleDrawClick(1)}>HIT</Button>
                        }
                    </div>
                    <div>
                        <Button onClick={() => dispatch(setGameState('DEALER_TURN'))}>Stand</Button>
                    </div>
                </div>
            </div>
        </>
    )
}